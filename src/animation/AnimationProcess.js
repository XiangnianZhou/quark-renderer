/**
 * AnimationProcess 表示一次完整的动画过程。
 * 
 * @module echarts/animation/AnimationProcess
 */
import * as dataUtil from '../core/dataStructureUtil';
import Track from './Track';

/**
 * @alias module:zrender/animation/AnimationProcess
 * @constructor
 * @param {Object} target 需要进行动画的图元
 * @param {boolean} loop 动画是否循环播放
 * @param {Function} getter
 * @param {Function} setter
 */
let AnimationProcess = function (target, loop, getter, setter) {
    this._trackCacheMap = new Map();
    this._target = target;
    this._loop = loop || false;
    this._getter = getter || function(target, key) {
        return target[key];
    };
    this._setter = setter || function(target, key, value) {
        target[key] = value;
    };

    this._delay = 0;
    this._paused = false;
    this._doneList = [];    //callback list when the entire animation process is finished
    this._onframeList = []; //callback list for each frame
};

AnimationProcess.prototype = {
    constructor: AnimationProcess,

    /**
     * 为每一种属性创建一条轨道
     * @param  {number} time 关键帧时间，单位ms
     * @param  {Object} props 关键帧的属性值，key-value表示
     * @return {module:zrender/animation/AnimationProcess}
     */
    when: function (time, props) {
        for (let propName in props) {
            if (!props.hasOwnProperty(propName)) {
                continue;
            }

            // Invalid value
            let value = this._getter(this._target, propName);
            if (value == null) {
                // zrLog('Invalid property ' + propName);
                continue;
            }

            let track=this._trackCacheMap.get(propName);
            if(!track){
                track=new Track({
                    _target:this._target,
                    _getter:this._getter,
                    _setter:this._setter,
                    _loop:this._loop,
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
    },

    /**
     * 添加动画每一帧的回调函数
     * @param  {Function} callback
     * @return {module:zrender/animation/AnimationProcess}
     */
    during: function (callback) {
        this._onframeList.push(callback);
        return this;
    },

    /**
     * 动画过程整体结束的时候回调此函数
     */
    _doneCallback: function () {
        this._doneList.forEach((fn,index)=>{
            fn.call(this);
        });
        this._trackCacheMap = new Map();
    },

    /**
     * 所有 Track 上的动画都完成则整个动画过程完成
     */
    isFinished: function () {
        let isFinished=true;
        [...this._trackCacheMap.values()].forEach((track,index)=>{
            if(!track.isFinished){
                isFinished=false;
            }
        });
        return isFinished;
    },

    /**
     * 开始执行动画
     * @param  {string|Function} [easing]
     *         动画缓动函数，详见{@link module:zrender/animation/easing}
     * @param  {boolean} forceAnimate
     * @return {module:zrender/animation/AnimationProcess}
     */
    start: function (easing, forceAnimate) {
        let self = this;
        let keys=[...this._trackCacheMap.keys()];
        keys.forEach((propName,index)=>{
            if (!this._trackCacheMap.get(propName)) {
                return;
            }
            let track=this._trackCacheMap.get(propName);
            track.start(this,easing,null,propName,forceAnimate);
        });

        // This optimization will help the case that in the upper application
        // the view may be refreshed frequently, where animation will be
        // called repeatly but nothing changed.
        if (!keys.length) {
            this._doneCallback();
        }
        return this;
    },

    /**
     * 停止动画
     * @param {boolean} forwardToLast If move to last frame before stop
     */
    stop: function (forwardToLast) {
        [...this._trackCacheMap.values()].forEach((track,index)=>{
            track.stop(this._target, 1);
        });
        this._trackCacheMap=new Map();
    },

    nextFrame:function(time,delta){
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
            for (let i = 0; i < this._onframeList.length; i++) {
                this._onframeList[i](this._target, percent);
            }
        }

        if(this.isFinished()){
            this._doneCallback();
        }
    },

    pause: function () {
        [...this._trackCacheMap.values()].forEach((track,index)=>{
            track.pause();
        });
        this._paused = true;
    },

    resume: function () {
        [...this._trackCacheMap.values()].forEach((track,index)=>{
            track.resume();
        });
        this._paused = false;
    },

    isPaused: function () {
        return !!this._paused;
    },

    /**
     * 设置动画延迟开始的时间
     * @param  {number} time 单位ms
     * @return {module:zrender/animation/AnimationProcess}
     */
    delay: function (time) {
        this._delay = time;
        return this;
    },
    
    /**
     * 添加动画结束的回调
     * @param  {Function} cb
     * @return {module:zrender/animation/AnimationProcess}
     */
    done: function (cb) {
        if (cb) {
            this._doneList.push(cb);
        }
        return this;
    }
};

export default AnimationProcess;