/**
 * AnimationProcess 表示一次完整的动画过程。
 * 
 * @module echarts/animation/AnimationProcess
 */
import Timeline from './Timeline';
import * as dataUtil from '../core/dataStructureUtil';

/**
 * @alias module:zrender/animation/AnimationProcess
 * @constructor
 * @param {Object} target 需要进行动画的图元
 * @param {boolean} loop 动画是否循环播放
 * @param {Function} getter
 * @param {Function} setter
 */
var AnimationProcess = function (target, loop, getter, setter) {
    this._tracks = new Map();
    this._target = target;
    this._loop = loop || false;
    this._getter = getter || function(target, key) {
        return target[key];
    };
    this._setter = setter || function(target, key, value) {
        target[key] = value;
    };
    this._clipCount = 0;
    this._delay = 0;
    this._doneList = [];
    this._onframeList = [];
    this._timelineList = [];

    this._pausedTime;
    this._pauseStart;
    this._paused = false;
};

AnimationProcess.prototype = {
    constructor: AnimationProcess,

    /**
     * 设置动画关键帧
     * @param  {number} time 关键帧时间，单位是ms
     * @param  {Object} props 关键帧的属性值，key-value表示
     * @return {module:zrender/animation/AnimationProcess}
     */
    when: function (time /* ms */, props) {
        //TODO:validate argument props
        //为每一种属性创建一条轨道
        for (var propName in props) {
            if (!props.hasOwnProperty(propName)) {
                continue;
            }

            if (!this._tracks.get(propName)) {
                this._tracks.set(propName,[]);
                // Invalid value
                var value = this._getter(this._target, propName);
                if (value == null) {
                    // zrLog('Invalid property ' + propName);
                    continue;
                }
                // If time is 0
                //  Then props is given initialize value
                // Else
                //  Initialize value from current prop value
                if (time !== 0) {
                    this._tracks.get(propName).push({
                        time: 0,
                        value: dataUtil.cloneValue(value)
                    });
                }
            }
            this._tracks.get(propName).push({
                time: time,
                value: props[propName]
            });
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

    _doneCallback: function () {
        this._tracks = new Map();
        this._timelineList.length = 0;
        var doneList = this._doneList;
        var len = doneList.length;
        for (var i = 0; i < len; i++) {
            doneList[i].call(this);
        }
    },

    isFinished: function () {
        return !this._timelineList.length;
    },

    /**
     * 开始执行动画
     * @param  {string|Function} [easing]
     *         动画缓动函数，详见{@link module:zrender/animation/easing}
     * @param  {boolean} forceAnimate
     * @return {module:zrender/animation/AnimationProcess}
     */
    start: function (easing, forceAnimate) {
        var self = this;
        var clipCount = 0;

        var oneTrackDone = function () {
            clipCount--;
            if (!clipCount) {
                self._doneCallback();
            }
        };
        
        //为 Element 上的每一种属性创建一个 Timeline 
        [...this._tracks.keys()].forEach((propName,index)=>{
            if (!this._tracks.get(propName)) {
                return;
            }
            var timeline = new Timeline(
                this,
                easing, 
                oneTrackDone,
                this._tracks.get(propName),
                propName, 
                forceAnimate
            );
            if (timeline) {
                this._timelineList.push(timeline);
            }
        });

        // Add during callback on the last timeline
        let lastTimeline=this._timelineList[this._timelineList.length-1];
        if (lastTimeline&&dataUtil.isFunction(lastTimeline.onframe)) {
            var oldOnFrame = lastTimeline.onframe;
            lastTimeline.onframe = function (target, percent) {
                oldOnFrame(target, percent);
                for (var i = 0; i < self._onframeList.length; i++) {
                    self._onframeList[i](target, percent);
                }
            };
        }

        // This optimization will help the case that in the upper application
        // the view may be refreshed frequently, where animation will be
        // called repeatly but nothing changed.
        if (!this._timelineList.length) {
            this._doneCallback();
        }
        return this;
    },

    /**
     * 停止动画
     * @param {boolean} forwardToLast If move to last frame before stop
     */
    stop: function (forwardToLast) {
        for (var i = 0; i < this._timelineList.length; i++) {
            var timeline = this._timelineList[i];
            if (forwardToLast) {
                // Move to last frame before stop
                timeline.onframe(this._target, 1);
            }
        }
        this._timelineList.length = 0;
    },

    nextFrame:function(time,delta){
        var len = this._timelineList.length;
        var deferredEvents = [];
        var deferredTimelines = [];
        for (var i = 0; i < len; i++) {
            var timeline = this._timelineList[i];
            var e = timeline.step(time, delta);
            // Throw out the events need to be called after
            // stage.update, like destroy
            if (e) {
                deferredEvents.push(e);
                deferredTimelines.push(timeline);
            }
        }

        len = deferredEvents.length;
        for (var i = 0; i < len; i++) {
            deferredTimelines[i].fire(deferredEvents[i]);
        }
    },

    pause: function () {
        for (var i = 0; i < this._timelineList.length; i++) {
            this._timelineList[i].pause();
        }
        this._paused = true;
    },

    resume: function () {
        for (var i = 0; i < this._timelineList.length; i++) {
            this._timelineList[i].resume();
        }
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
    },

    /**
     * @return {Array.<module:zrender/animation/Timeline>}
     */
    getClips: function () {
        return this._timelineList;
    }
};

export default AnimationProcess;