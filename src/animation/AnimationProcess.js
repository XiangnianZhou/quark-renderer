/* eslint-disable no-unused-vars */
import * as dataUtil from '../utils/data_structure_util';
import * as classUtil from '../utils/class_util';
import Track from './Track';
import Eventful from '../event/Eventful';

/**
 * @class qrenderer.animation.AnimationProcess
 * 
 * AnimationProcess 表示一次完整的动画过程，每一个元素（Element）中都有一个列表，用来存储本实例上的所有动画过程。
 * 列表中的动画过程按照顺序获得运行机会，在特定的时间点上只有一个 AnimationProcess 处于运行状态，运行过程由 GlobalAnimationMgr 进行调度。 
 * AnimationProcess 运行完成之后会触发 done 事件，Element 实例在监听到 done 事件之后，会把对应的动画过程从列表中删除。如果 Element 实例
 * 的动画过程列表中存在多个实例，其中某个过程是无限循环运行的，那么后续所有动画过程都不会获得到运行机会。
 * 
 * @docauthor 大漠穷秋 <damoqiongqiu@126.com>
 */

/**
 * @method constructor AnimationProcess
 * @param {Object} element 需要进行动画的元素
 */
class AnimationProcess{
    constructor(element){
        this.element = element;
        this._trackCacheMap = new Map();
        this._delay = 0;
        this._running = false;
        this._paused = false;
        classUtil.inheritProperties(this,Eventful,this.options);
    }

    /**
     * @method when
     * 为每一种需要进行动画的属性创建一条轨道
     * @param  {Number} time 关键帧时间，单位ms
     * @param  {Object} config 关键帧的属性值，key-value表示
     * @return {qrenderer.animation.AnimationProcess}
     */
    when(time, config) {
        //TODO:这里需要重构，仿射变换的参数是有顺序的
        let flattenMap=new Map();
        dataUtil.flattenObj(config,flattenMap);
        flattenMap.forEach((value,key,map)=>{
            let track=this._trackCacheMap.get(key);
            if(!track){
                track=new Track({
                    element:this.element,
                    path:key,
                    delay:this._delay
                });
                //如果参数中没有提供第 0 帧，自动补第 0 帧，以元素上当前的属性值为值
                if (time !== 0) {
                    let temp=dataUtil.getAttrByPath(this.element,key);
                    if(temp==null||temp==undefined){
                        temp=0;
                    }
                    track.addKeyFrame({
                        time: 0,
                        value: dataUtil.clone(temp)
                    });
                }
                this._trackCacheMap.set(key,track);
            }
            
            track.addKeyFrame({
                time: time,
                value: dataUtil.clone(value)
            });
        });
        return this;
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
        this._running=true;
        this._paused=false;
        this.trigger("start");

        let self = this;
        if(!this._trackCacheMap.size){
            this.trigger("done");
            return this;
        }
        this._trackCacheMap.forEach((track,key,map)=>{
            track&&track.start(loop,easing,forceAnimate);
        });
        return this;
    }

    /**
     * @method nextFrame
     * 进入下一帧
     * @param {Number} time  当前时间
     * @param {Number} delta 时间偏移量
     */
    nextFrame(time,delta){
        this._running=true;
        this._paused=false;

        let deferredEvents = [];
        let deferredTracks = [];
        let percent="";
        let isFinished=true;

        this._trackCacheMap.forEach((track,key,map)=>{
            let result = track.nextFrame(time, delta);
            if (dataUtil.isString(result)) {
                deferredEvents.push(result);
                deferredTracks.push(track);
            }else if(dataUtil.isNumeric(result)){
                percent=result;
            }
            isFinished=isFinished&&track.isFinished;

            if(dataUtil.isNumeric(percent)){
                this.trigger("during",this.element,track._path,track._currentValue,percent);
            }
        });

        let len = deferredEvents.length;
        for (let i = 0; i < len; i++) {
            deferredTracks[i].fire(deferredEvents[i]);
        }

        if(isFinished){
            this.trigger("done");
        }
    }

    /**
     * @method stop
     * 停止动画
     * @param {Boolean} forwardToLast If move to last frame before stop
     */
    stop(forwardToLast) {
        this._running=false;
        this._paused=false;
        this._trackCacheMap.forEach((track,key,map)=>{
            track.stop(this.element, 1);
        });
        this._trackCacheMap=new Map();
        this.trigger("stop");
        return this;
    }

    /**
     * @method pause
     * 暂停动画
     */
    pause() {
        this._running=false;
        this._paused=true;
        this._trackCacheMap.forEach((track,key,map)=>{
            track.pause();
        });
        this.trigger("pause");
        return this;
    }

    /**
     * @method resume
     * 恢复动画
     */
    resume() {
        this._running=true;
        this._paused=false;
        this._trackCacheMap.forEach((track,key,map)=>{
            track.resume();
        });
        this.trigger("resume");
        return this;
    }

    /**
     * @method during
     * 添加动画每一帧的回调函数，方便链式调用。
     * @param  {Function} callback
     * @return {qrenderer.animation.AnimationProcess}
     */
    during(callback) {
        this.on("during",callback);
        return this;
    }

    /**
     * @method done
     * 添加动画结束的回调，方便链式调用。
     * @param  {Function} callback
     * @return {qrenderer.animation.AnimationProcess}
     */
    done(callback) {
        this.on("done",callback);
        return this;
    }

    /**
     * @method isFinished
     * 判断整个动画过程是否已经完成，所有 Track 上的动画都完成则整个动画过程完成
     */
    isFinished() {
        let isFinished=true;
        this._trackCacheMap.forEach((track,key,map)=>{
            if(!track.isFinished){
                isFinished=false;
            }
        });
        return isFinished;
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