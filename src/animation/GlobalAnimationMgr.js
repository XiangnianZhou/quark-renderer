/**
 * Animation manager, global singleton, controls all the animation process.
 * Each ZRender instance has a GlobalAnimationMgr instance.
 * 
 * 动画管理器，全局单例，控制和调度所有动画过程。每个 zrender 实例中会持有一个 
 * GlobalAnimationMgr 实例。
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
 * @alias module:zrender/animation/GlobalAnimationMgr
 * @constructor
 * @param {Object} [options]
 */
function GlobalAnimationMgr(options) {
    options = options || {};
    this._animationProcessList=[];
    this._running = false;
    this._timestamp;
    this._pausedTime;//ms
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
        this._animationProcessList.push(animationProcess);
    },

    /**
     * 删除动画片段
     * @param {module:zrender/animation/AnimationProcess} animationProcess
     */
    removeAnimationProcess: function (animationProcess) {
        let index=this._animationProcessList.findIndex(animationProcess);
        if(index>=0){
            this._animationProcessList.splice(index,1);
        }
    },

    _update: function () {
        var time = new Date().getTime() - this._pausedTime;
        var delta = time - this._timestamp;

        this._animationProcessList.forEach((ap,index)=>{
            ap.nextFrame(time,delta);
        });

        this._timestamp = time;

        // TODO:What's going on here?
        // 'frame' should be triggered before stage, because upper application
        // depends on the sequence (e.g., echarts-stream and finish
        // event judge)
        this.trigger('frame', delta);
    },

    /**
     * TODO:需要确认在大量节点下的动画性能问题，比如 100 万个图元同时进行动画
     * 这里开始利用requestAnimationFrame递归执行
     * 如果这里的 _update() 不能在16ms的时间内完成一轮动画，就会出现明显的卡顿。
     * 按照 W3C 的推荐标准 60fps，这里的 step 函数大约每隔 16ms 被调用一次
     * @see https://developer.mozilla.org/en-US/docs/Web/API/window/requestAnimationFrame
     */
    _startLoop: function () {
        var self = this;
        this._running = true;
        function nextFrame() {
            if (self._running) {
                requestAnimationFrame(nextFrame);
                !self._paused && self._update();
            }
        }
        requestAnimationFrame(nextFrame);
    },

    /**
     * Start all the animations.
     */
    start: function () {
        this._timestamp = new Date().getTime();
        this._pausedTime = 0;
        this._startLoop();
    },

    /**
     * Stop all the animations.
     */
    stop: function () {
        this._running = false;
    },

    /**
     * Pause all the animations.
     */
    pause: function () {
        if (!this._paused) {
            this._pauseStart = new Date().getTime();
            this._paused = true;
        }
    },

    /**
     * Resume all the animations.
     */
    resume: function () {
        if (this._paused) {
            this._pausedTime += (new Date().getTime()) - this._pauseStart;
            this._paused = false;
        }
    },

    /**
     * Clear all the animations.
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
    }
};

dataUtil.mixin(GlobalAnimationMgr, Dispatcher);
export default GlobalAnimationMgr;