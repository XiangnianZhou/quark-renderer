/**
 * Animator 是动画片段 Clip 的管理器，负责创建、维护 Clip，Animator 可以看成一组 Clip 的集合。
 * 
 * @module echarts/animation/Animator
 */
import Clip from './Clip';
import * as dataUtil from '../core/dataStructureUtil';

/**
 * @alias module:zrender/animation/Animator
 * @constructor
 * @param {Object} target 需要进行动画的图元
 * @param {boolean} loop 动画是否循环播放
 * @param {Function} getter
 * @param {Function} setter
 */
var Animator = function (target, loop, getter, setter) {
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
    this._clipList = [];
};

Animator.prototype = {
    /**
     * 设置动画关键帧
     * @param  {number} time 关键帧时间，单位是ms
     * @param  {Object} props 关键帧的属性值，key-value表示
     * @return {module:zrender/animation/Animator}
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
     * @return {module:zrender/animation/Animator}
     */
    during: function (callback) {
        this._onframeList.push(callback);
        return this;
    },

    pause: function () {
        for (var i = 0; i < this._clipList.length; i++) {
            this._clipList[i].pause();
        }
        this._paused = true;
    },

    resume: function () {
        for (var i = 0; i < this._clipList.length; i++) {
            this._clipList[i].resume();
        }
        this._paused = false;
    },

    isPaused: function () {
        return !!this._paused;
    },

    _doneCallback: function () {
        this._tracks = new Map();
        this._clipList.length = 0;
        var doneList = this._doneList;
        var len = doneList.length;
        for (var i = 0; i < len; i++) {
            doneList[i].call(this);
        }
    },

    isFinished: function () {
        return !this._clipList.length;
    },

    /**
     * 开始执行动画
     * @param  {string|Function} [easing]
     *         动画缓动函数，详见{@link module:zrender/animation/easing}
     * @param  {boolean} forceAnimate
     * @return {module:zrender/animation/Animator}
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
        
        //为 Element 上的每一种属性创建一个 Clip 
        [...this._tracks.keys()].forEach((propName,index)=>{
            if (!this._tracks.get(propName)) {
                return;
            }
            var clip = new Clip(
                this,
                easing, 
                oneTrackDone,
                this._tracks.get(propName),
                propName, 
                forceAnimate
            );
            if (clip) {
                this._clipList.push(clip);
            }
        });

        // Add during callback on the last clip
        let lastClip=this._clipList[this._clipList.length-1];
        if (lastClip&&dataUtil.isFunction(lastClip.onframe)) {
            var oldOnFrame = lastClip.onframe;
            lastClip.onframe = function (target, percent) {
                oldOnFrame(target, percent);
                for (var i = 0; i < self._onframeList.length; i++) {
                    self._onframeList[i](target, percent);
                }
            };
        }

        // This optimization will help the case that in the upper application
        // the view may be refreshed frequently, where animation will be
        // called repeatly but nothing changed.
        if (!this._clipList.length) {
            this._doneCallback();
        }
        return this;
    },

    /**
     * 停止动画
     * @param {boolean} forwardToLast If move to last frame before stop
     */
    stop: function (forwardToLast) {
        for (var i = 0; i < this._clipList.length; i++) {
            var clip = this._clipList[i];
            if (forwardToLast) {
                // Move to last frame before stop
                clip.onframe(this._target, 1);
            }
        }
        this._clipList.length = 0;
    },

    /**
     * 设置动画延迟开始的时间
     * @param  {number} time 单位ms
     * @return {module:zrender/animation/Animator}
     */
    delay: function (time) {
        this._delay = time;
        return this;
    },
    
    /**
     * 添加动画结束的回调
     * @param  {Function} cb
     * @return {module:zrender/animation/Animator}
     */
    done: function (cb) {
        if (cb) {
            this._doneList.push(cb);
        }
        return this;
    },

    /**
     * @return {Array.<module:zrender/animation/Clip>}
     */
    getClips: function () {
        return this._clipList;
    }
};

export default Animator;