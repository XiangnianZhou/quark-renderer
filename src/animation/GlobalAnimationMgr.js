import * as dataUtil from '../core/utils/dataStructureUtil';
import * as classUtil from '../core/utils/classUtil';
import {Dispatcher} from '../core/utils/eventUtil';
import requestAnimationFrame from './utils/requestAnimationFrame';
/**
 * @singleton
 * @class qrenderer.animation.GlobalAnimationMgr
 * 
 * Animation manager, global singleton, controls all the animation process.
 * Each QRenderer instance has a GlobalAnimationMgr instance. GlobalAnimationMgr 
 * is designed to manage all the AnimationProcesses inside a qrenderer instance.
 * 
 * 动画管理器，全局单例，控制和调度所有动画过程。每个 qrenderer 实例中会持有一个 
 * GlobalAnimationMgr 实例。GlobalAnimationMgr 会管理 qrenderer 实例中的所有
 * AnimationProcess。
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
        this._animationProcessList=[];
        this._running = false;
        this._timestamp;
        this._pausedTime;//ms
        this._pauseStart;
        this._paused = false;
        Dispatcher.call(this);
    }

    /**
     * @method addAnimationProcess
     * 添加 animationProcess
     * @param {qrenderer.animation.GlobalAnimationMgr} animationProcess
     */
    addAnimationProcess(animationProcess) {
        this._animationProcessList.push(animationProcess);
    }

    /**
     * @method removeAnimationProcess
     * 删除动画片段
     * @param {qrenderer.animation.GlobalAnimationMgr} animationProcess
     */
    removeAnimationProcess(animationProcess) {
        let index=this._animationProcessList.findIndex(animationProcess);
        if(index>=0){
            this._animationProcessList.splice(index,1);
        }
    }

    /**
     * @private
     * @method _update
     */
    _update() {
        let time = new Date().getTime() - this._pausedTime;
        let delta = time - this._timestamp;

        this._animationProcessList.forEach((ap,index)=>{
            ap.nextFrame(time,delta);
        });

        this._timestamp = time;

        // TODO:What's going on here?
        // 'frame' should be triggered before stage, because upper application
        // depends on the sequence (e.g., echarts-stream and finish
        // event judge)
        this.trigger('frame', delta);
    }

    /**
     * @private
     * @method _startLoop
     * TODO:需要确认在大量节点下的动画性能问题，比如 100 万个元素同时进行动画
     * 这里开始利用requestAnimationFrame递归执行
     * 如果这里的 _update() 不能在16ms的时间内完成一轮动画，就会出现明显的卡顿。
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
     * @method stop
     * Stop all the animations.
     */
    stop() {
        this._running = false;
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
        this._animationProcessList.length=0;
    }

    /**
     * @method isFinished
     * Whether all the animations have finished.
     */
    isFinished(){
        let finished=true;
        this._animationProcessList.forEach((animationProcess,index)=>{
            if(!animationProcess.isFinished()){
                finished=false;
            }
        });
        return finished;
    }
}

classUtil.mixin(GlobalAnimationMgr, Dispatcher);
export default GlobalAnimationMgr;