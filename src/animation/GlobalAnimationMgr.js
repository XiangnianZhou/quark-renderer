import * as dataUtil from '../core/utils/data_structure_util';
import * as classUtil from '../core/utils/class_util';
import {Dispatcher} from '../core/utils/event_util';
import requestAnimationFrame from './utils/request_animation_frame';

/**
 * @singleton
 * @class qrenderer.animation.GlobalAnimationMgr
 * 
 * Animation manager, global singleton, controls all the animation process.
 * Each QRenderer instance has a GlobalAnimationMgr instance. GlobalAnimationMgr 
 * is designed to manage all the elements which are animating.
 * 
 * 动画管理器，全局单例，控制和调度所有动画过程。每个 qrenderer 实例中会持有一个 
 * GlobalAnimationMgr 实例。GlobalAnimationMgr 会管理 qrenderer 实例中的所有
 * 正在进行动画的元素。
 * 
 * @author pissang(https://github.com/pissang)
 * @docauthor 大漠穷秋 <damoqiongqiu@126.com>
 */
// TODO Additive animation
// http://iosoteric.com/additive-animations-animatewithduration-in-ios-8/
// https://developer.apple.com/videos/wwdc2014/#236

class GlobalAnimationMgr{
    /**
     * @method constructor GlobalAnimationMgr
     * @param {Object} [options]
     */
    constructor(options){
        options = options || {};
        this._animatableMap=new Map();
        this._running = false;
        this._timestamp;
        this._pausedTime;//ms
        this._pauseStart;
        this._paused = false;
        Dispatcher.call(this);
    }

    addAnimatable(animatable){
        this._animatableMap.set(animatable.id,animatable);
    }

    removeAnimatable(animatable) {
        this._animatableMap.delete(animatable.id);
    }

    /**
     * @private
     * @method _update
     */
    _update() {
        let time = new Date().getTime() - this._pausedTime;
        let delta = time - this._timestamp;

        this._animatableMap.forEach((animatable,index,map)=>{
            let ap=animatable.animationProcessList[0];
            if(!ap){
                this.removeAnimatable(animatable);
                return;
            }
            ap.nextFrame(time,delta);
        });

        this._timestamp = time;
        this.trigger('frame', delta);
    }

    /**
     * @private
     * @method _startLoop
     * 这里开始利用requestAnimationFrame递归执行，如果这里的 _update() 不能在16ms的
     * 时间内完成一轮动画，就会出现明显的卡顿。
     * 按照 W3C 的推荐标准 60fps，这里的 step 函数大约每隔 16ms 被调用一次
     * @see https://developer.mozilla.org/en-US/docs/Web/API/window/requestAnimationFrame
     */
    _startLoop() {
        let self = this;
        this._running = true;
        function nextFrame() {
            if (self._running) {
                requestAnimationFrame(nextFrame);
                !self._paused && self._update();
            }
        }
        requestAnimationFrame(nextFrame);
    }

    /**
     * @method start
     * Start all the animations.
     */
    start() {
        this._timestamp = new Date().getTime();
        this._pausedTime = 0;
        this._startLoop();
    }

    /**
     * @method pause
     * Pause all the animations.
     */
    pause() {
        if (!this._paused) {
            this._pauseStart = new Date().getTime();
            this._paused = true;
        }
    }

    /**
     * @method resume
     * Resume all the animations.
     */
    resume() {
        if (this._paused) {
            this._pausedTime += (new Date().getTime()) - this._pauseStart;
            this._paused = false;
        }
    }

    /**
     * @method clear
     * Clear all the animations.
     */
    clear() {
        this._animatableMap.forEach((animatable,index)=>{
            animatable.stopAnimation();
        });
        this._running = false;
        this._animatableMap=new Map();
    }
}

classUtil.mixin(GlobalAnimationMgr, Dispatcher);
export default GlobalAnimationMgr;