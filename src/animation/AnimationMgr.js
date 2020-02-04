/**
 * 动画主类, 调度和管理所有动画控制器
 * 每个 zrender 实例中会持有一个 AnimationMgr 实例。
 * 
 * @module zrender/animation/AnimationMgr
 * @author pissang(https://github.com/pissang)
 */
// TODO Additive animation
// http://iosoteric.com/additive-animations-animatewithduration-in-ios-8/
// https://developer.apple.com/videos/wwdc2014/#236

import * as util from '../core/dataUtil';
import {Dispatcher} from '../core/eventUtil';
import requestAnimationFrame from './requestAnimationFrame';
import Animator from './Animator';

/**
 * @typedef {Object} IZRenderStage
 * @property {Function} update
 */

/**
 * @alias module:zrender/animation/AnimationMgr
 * @constructor
 * @param {Object} [options]
 * @param {Function} [options.onframe]
 * @param {IZRenderStage} [options.stage]
 * @example
 *     var animation = new AnimationMgr();
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
var AnimationMgr = function (options) {
    options = options || {};
    this.stage = options.stage || {};
    this.onframe = options.onframe || function () {};

    this._animators=[];
    this._running = false;
    this._time;
    this._pausedTime;
    this._pauseStart;
    this._paused = false;
    Dispatcher.call(this);
};

AnimationMgr.prototype = {

    constructor: AnimationMgr,

    /**
     * 添加 animator
     * @param {module:zrender/animation/Animator} animator
     */
    addAnimator: function (animator) {
        animator.animation = this;
        this._animators.push(animator);
    },

    /**
     * 删除动画片段
     * @param {module:zrender/animation/Animator} animator
     */
    removeAnimator: function (animator) {
        animator.animation = null;
        let index=this._animators.findIndex(animator);
        if(index>=0){
            this._animators.splice(index,1);
        }
    },

    _getAllClips:function(){
        let clips=[];
        this._animators.forEach((animator,index)=>{
            let temp=animator.getClips();
            if(temp&&temp.length){
                clips=[...clips,...temp];
            }
        });
        return clips;
    },

    _update: function () {
        var time = new Date().getTime() - this._pausedTime;
        var delta = time - this._time;
        var clips = this._getAllClips();
        var len = clips.length;
        var deferredEvents = [];
        var deferredClips = [];
        for (var i = 0; i < len; i++) {
            var clip = clips[i];
            var e = clip.step(time, delta);
            // Throw out the events need to be called after
            // stage.update, like destroy
            if (e) {
                deferredEvents.push(e);
                deferredClips.push(clip);
            }
        }

        len = deferredEvents.length;
        for (var i = 0; i < len; i++) {
            deferredClips[i].fire(deferredEvents[i]);
        }

        this._time = time;

        this.onframe(delta);

        // 'frame' should be triggered before stage, because upper application
        // depends on the sequence (e.g., echarts-stream and finish
        // event judge)
        this.trigger('frame', delta);//不断触发 frame 事件

        if (this.stage.update) {
            //在 zrender.js 中，创建 AnimationMgr 对象时绑定了 zrender.flush 方法，flush 方法会根据不同的条件刷新画布
            this.stage.update(); 
        }
    },

    _startLoop: function () {
        var self = this;

        this._running = true;

        //按照 W3C 的推荐标准 60fps，这里的 step 函数大约 16ms 被调用一次
        //@see https://developer.mozilla.org/en-US/docs/Web/API/window/requestAnimationFrame
        function step() {
            if (self._running) {

                //这里开始递归执行，TODO:需要确认在大量节点下的性能问题。
                //如果这里的 _update() 不能在16ms的时间内完成一轮刷新，就会出现明显的卡顿。
                requestAnimationFrame(step);

                !self._paused && self._update();
            }
        }

        requestAnimationFrame(step);//触发第一次动作
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
        this._animators=[];
    },

    /**
     * Whether all the animations have finished.
     */
    isFinished:function(){
        let finished=true;
        this._animators.forEach((animator,index)=>{
            if(!animator.isFinished()){
                finished=false;
            }
        });
        return finished;
    },

    /**
     * Creat animator for a target, whose props can be animated.
     *
     * @param  {Object} target
     * @param  {Object} options
     * @param  {boolean} [options.loop=false] Whether loop animation.
     * @param  {Function} [options.getter=null] Get value from target.
     * @param  {Function} [options.setter=null] Set value to target.
     * @return {module:zrender/animation/AnimationMgr~Animator}
     */
    // TODO Gap
    animate: function (target, options) {
        options = options || {};
        var animator = new Animator(
            target,
            options.loop,
            options.getter,
            options.setter
        );
        this.addAnimator(animator);
        return animator;
    }
};

util.mixin(AnimationMgr, Dispatcher);
export default AnimationMgr;