/**
 * Animation manager, global singleton, controls all the animation process.
 * Each ZRender instance has a GlobalAnimationMgr instance.
 * 
 * 动画管理器，全局单例，控制和调度所有动画过程。
 * 每个 zrender 实例中会持有一个 GlobalAnimationMgr 实例。
 * 
 * @module zrender/animation/GlobalAnimationMgr
 * @author pissang(https://github.com/pissang)
 */
// TODO Additive animation
// http://iosoteric.com/additive-animations-animatewithduration-in-ios-8/
// https://developer.apple.com/videos/wwdc2014/#236

import * as dataUtil from '../core/dataStructureUtil';
import {Dispatcher} from '../core/eventUtil';
import requestAnimationFrame from './utils/requestAnimationFrame';
import AnimationProcess from './AnimationProcess';

/**
 * @typedef {Object} IZRenderStage
 * @property {Function} update
 */

/**
 * @alias module:zrender/animation/GlobalAnimationMgr
 * @constructor
 * @param {Object} [options]
 * @param {Function} [options.onframe]
 * @param {IZRenderStage} [options.stage]
 * @example
 *     var animation = new GlobalAnimationMgr();
 *     var obj = {
 *         x: 100,
 *         y: 100
 *     };
 *     animation.animate(node.position)
 *         .when(1000, {
 *             x: 500,
 *             y: 500
 *         })
 *         .when(2000, {
 *             x: 100,
 *             y: 100
 *         })
 *         .start('spline');
 */
function GlobalAnimationMgr(options) {
    options = options || {};
    this.stage = options.stage || {};
    this.onframe = options.onframe || function () {};

    this._animationProcessList=[];
    this._running = false;
    this._time;
    this._pausedTime;
    this._pauseStart;
    this._paused = false;
    Dispatcher.call(this);
};

GlobalAnimationMgr.prototype = {

    constructor: GlobalAnimationMgr,

    /**
     * 添加 animationProcess
     * @param {module:zrender/animation/AnimationProcess} animationProcess
     */
    addAnimationProcess: function (animationProcess) {
        animationProcess.animation = this;
        this._animationProcessList.push(animationProcess);
    },

    /**
     * 删除动画片段
     * @param {module:zrender/animation/AnimationProcess} animationProcess
     */
    removeAnimationProcess: function (animationProcess) {
        animationProcess.animation = null;
        let index=this._animationProcessList.findIndex(animationProcess);
        if(index>=0){
            this._animationProcessList.splice(index,1);
        }
    },

    _update: function () {
        var time = new Date().getTime() - this._pausedTime;
        var delta = time - this._time;

        this._animationProcessList.forEach((ap,index)=>{
            ap.nextFrame(time,delta);
        });

        this._time = time;

        this.onframe(delta);

        // 'frame' should be triggered before stage, because upper application
        // depends on the sequence (e.g., echarts-stream and finish
        // event judge)
        this.trigger('frame', delta);//不断触发 frame 事件

        if (this.stage.update) {
            //在 zrender.js 中，创建 GlobalAnimationMgr 对象时绑定了 zrender.flush 方法，flush 方法会根据不同的条件刷新画布
            this.stage.update(); 
        }
    },

    /**
     * TODO:需要确认在大量节点下的动画性能问题，比如 100 万个图元同时进行动画
     * 这里开始利用requestAnimationFrame递归执行
     * 如果这里的 _update() 不能在16ms的时间内完成一轮刷新，就会出现明显的卡顿。
     * 按照 W3C 的推荐标准 60fps，这里的 step 函数大约 16ms 被调用一次
     * @see https://developer.mozilla.org/en-US/docs/Web/API/window/requestAnimationFrame
     */
    _startLoop: function () {
        var self = this;
        this._running = true;
        function step() {
            if (self._running) {
                requestAnimationFrame(step);
                !self._paused && self._update();
            }
        }
        requestAnimationFrame(step);
    },

    /**
     * Start animation.
     */
    start: function () {
        this._time = new Date().getTime();
        this._pausedTime = 0;
        this._startLoop();
    },

    /**
     * Stop animation.
     */
    stop: function () {
        this._running = false;
    },

    /**
     * Pause animation.
     */
    pause: function () {
        if (!this._paused) {
            this._pauseStart = new Date().getTime();
            this._paused = true;
        }
    },

    /**
     * Resume animation.
     */
    resume: function () {
        if (this._paused) {
            this._pausedTime += (new Date().getTime()) - this._pauseStart;
            this._paused = false;
        }
    },

    /**
     * Clear animation.
     */
    clear: function () {
        this._animationProcessList.length=0;
    },

    /**
     * Whether all the animations have finished.
     */
    isFinished:function(){
        let finished=true;
        this._animationProcessList.forEach((animationProcess,index)=>{
            if(!animationProcess.isFinished()){
                finished=false;
            }
        });
        return finished;
    },

    /**
     * Creat animationProcess for a target, whose props can be animated.
     *
     * @param  {Object} target
     * @param  {Object} options
     * @param  {boolean} [options.loop=false] Whether loop animation.
     * @param  {Function} [options.getter=null] Get value from target.
     * @param  {Function} [options.setter=null] Set value to target.
     * @return {module:zrender/animation/GlobalAnimationMgr~AnimationProcess}
     */
    // TODO Gap
    animate: function (target, options) {
        options = options || {};
        var animationProcess = new AnimationProcess(
            target,
            options.loop,
            options.getter,
            options.setter
        );
        this.addAnimationProcess(animationProcess);
        return animationProcess;
    }
};

dataUtil.mixin(GlobalAnimationMgr, Dispatcher);
export default GlobalAnimationMgr;