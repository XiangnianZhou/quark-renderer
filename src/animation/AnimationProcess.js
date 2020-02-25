import * as dataUtil from '../core/utils/data_structure_util';
import * as classUtil from '../core/utils/class_util';
import Track from './Track';
import Eventful from '../event/Eventful';

/**
 * @class qrenderer.animation.AnimationProcess
 * 
 * AnimationProcess 表示一次完整的动画过程，每一个元素（Element）中都有一个列表，用来存储本实例上的动画过程。
 * GlobalAnimationMgr 负责维护和调度所有 AnimationProcess 实例。
 * 
 * @docauthor 大漠穷秋 <damoqiongqiu@126.com>
 */

/**
 * @method constructor AnimationProcess
 * @param {Object} target 需要进行动画的元素
 */
class AnimationProcess{
    constructor(target){
        this._trackCacheMap = new Map();
        this._target = target;
        this._delay = 0;
        this._paused = false;
        classUtil.inheritProperties(this,Eventful,this.options);
    }

    /**
     * @method when
     * 为每一种需要进行动画的属性创建一条轨道
     * @param  {Number} time 关键帧时间，单位ms
     * @param  {Object} props 关键帧的属性值，key-value表示
     * @return {qrenderer.animation.AnimationProcess}
     */
    when(time, props) {
        for (let propName in props) {
            if (!props.hasOwnProperty(propName)) {
                continue;
            }

            let value = this._target[propName];
            if (value === null || value===undefined) {
                continue;
            }

            let track=this._trackCacheMap.get(propName);
            if(!track){
                track=new Track({
                    _target:this._target,
                    _delay:this._delay
                });
            }

            if (time !== 0) {
                track.addKeyFrame({
                    time: 0,
                    value: dataUtil.cloneValue(value)
                });
            }

            track.addKeyFrame({
                time: time,
                value: props[propName]
            });

            this._trackCacheMap.set(propName,track);
        }
        return this;
    }

    /**
     * @method during
     * 添加动画每一帧的回调函数
     * @param  {Function} callback
     * @return {qrenderer.animation.AnimationProcess}
     */
    during(callback) {
        this.on("during",callback);
        return this;
    }

    /**
     * @method done
     * 添加动画结束的回调
     * @param  {Function} callback
     * @return {qrenderer.animation.AnimationProcess}
     */
    done(callback) {
        this.on("done",callback);
        return this;
    }

    /**
     * @private
     * @method _doneCallback
     * 动画过程整体结束的时候回调此函数
     */
    _doneCallback() {
        this._trackCacheMap = new Map();
        this.trigger("done");
        this.clearAll();
    }

    /**
     * @method isFinished
     * 判断整个动画过程是否已经完成，所有 Track 上的动画都完成则整个动画过程完成
     */
    isFinished() {
        let isFinished=true;
        [...this._trackCacheMap.values()].forEach((track,index)=>{
            if(!track.isFinished){
                isFinished=false;
            }
        });
        return isFinished;
    }

    /**
     * @method start
     * 开始执行动画
     * @param  {Boolean} loop 是否循环
     * @param  {String|Function} [easing] 缓动函数名称，详见{@link qrenderer.animation.easing 缓动引擎}
     * @param  {Boolean} forceAnimate 是否强制开启动画
     * @return {qrenderer.animation.AnimationProcess}
     */
    start(loop=false, easing='',forceAnimate=false) {
        let self = this;
        let keys=[...this._trackCacheMap.keys()];
        keys.forEach((propName,index)=>{
            let track=this._trackCacheMap.get(propName);
            track&&track.start(propName,loop,easing,forceAnimate);
        });

        // This optimization will help the case that in the upper application
        // the view may be refreshed frequently, where animation will be
        // called repeatly but nothing changed.
        if (!keys.length) {
            this._doneCallback();
        }
        return this;
    }

    /**
     * @method stop
     * 停止动画
     * @param {Boolean} forwardToLast If move to last frame before stop
     */
    stop(forwardToLast) {
        [...this._trackCacheMap.values()].forEach((track,index)=>{
            track.stop(this._target, 1);
        });
        this._trackCacheMap=new Map();
        this._doneCallback();
    }

    /**
     * @method nextFrame
     * 进入下一帧
     * @param {Number} time  当前时间
     * @param {Number} delta 时间偏移量
     */
    nextFrame(time,delta){
        let deferredEvents = [];
        let deferredTracks = [];
        let percent="";

        [...this._trackCacheMap.values()].forEach((track,index)=>{
            let result = track.nextFrame(time, delta);
            if (dataUtil.isString(result)) {
                deferredEvents.push(result);
                deferredTracks.push(track);
            }else if(dataUtil.isNumeric(result)){
                percent=result;
            }
        });

        let len = deferredEvents.length;
        for (let i = 0; i < len; i++) {
            deferredTracks[i].fire(deferredEvents[i]);
        }

        if(dataUtil.isNumeric(percent)){
            this.trigger("during",this._target, percent);
        }

        if(this.isFinished()){
            this._doneCallback();
        }
    }

    /**
     * @method pause
     * 暂停动画
     */
    pause() {
        [...this._trackCacheMap.values()].forEach((track,index)=>{
            track.pause();
        });
        this._paused = true;
    }

    /**
     * @method resume
     * 恢复动画
     */
    resume() {
        [...this._trackCacheMap.values()].forEach((track,index)=>{
            track.resume();
        });
        this._paused = false;
    }

    /**
     * @method isPaused
     * 是否暂停
     */
    isPaused() {
        return !!this._paused;
    }

    /**
     * @method delay
     * 设置动画延迟开始的时间
     * @param  {Number} time 单位ms
     * @return {qrenderer.animation.AnimationProcess}
     */
    delay(time) {
        this._delay = time;
        return this;
    }
}

classUtil.mixin(AnimationProcess,Eventful);
export default AnimationProcess;