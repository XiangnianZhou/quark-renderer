/**
 * 动画片段
 * 图元上存在很多种属性，在动画过程中，可能会有多种属性同时发生变化，
 * 每一种属性天然成为一条动画轨道，把这些轨道上的变化过程封装在很多 Timeline 实例中。
 * 
 * @config target 动画对象，可以是数组，如果是数组的话会批量分发onframe等事件
 * @config life(1000) 动画时长
 * @config delay(0) 动画延迟时间
 * @config loop(true)
 * @config gap(0) 循环的间隔时间
 * @config onframe
 * @config easing(optional)
 * @config ondestroy(optional)
 * @config onrestart(optional)
 *
 */

import easingFuncs from './utils/easing';
import * as colorUtil from '../core/colorUtil';
import * as dataUtil from '../core/dataStructureUtil';

function Timeline(animationProcess, easing, oneTrackDone, keyframes, propName, forceAnimate) {
    let options=this._calculateParams(animationProcess, easing, oneTrackDone, keyframes, propName, forceAnimate);
    //如果传入的参数不正确，则无法构造实例
    if(!options){
        return null;
    }

    this._target = options.target;
    this._lifeTime = options.lifeTime || 1000;
    this._delay = options.delay || 0;
    this._initialized = false;
    this.loop = options.loop == null ? false : options.loop;
    this.gap = options.gap || 0;
    this.easing = options.easing || 'Linear';
    this.onframe = options.onframe;
    this.ondestroy = options.ondestroy;
    this.onrestart = options.onrestart;

    this._pausedTime = 0;
    this._paused = false;
}

Timeline.prototype = {

    constructor: Timeline,

    step: function (globalTime, deltaTime) {
        // Set startTime on first step, or _startTime may has milleseconds different between clips
        // PENDING
        if (!this._initialized) {
            this._startTime = globalTime + this._delay;
            this._initialized = true;
        }

        if (this._paused) {
            this._pausedTime += deltaTime;
            return;
        }

        let percent = (globalTime - this._startTime - this._pausedTime) / this._lifeTime;
        // 还没开始
        if (percent < 0) {
            return;
        }
        percent = Math.min(percent, 1);

        let easing = this.easing;
        let easingFunc = typeof easing === 'string' ? easingFuncs[easing] : easing;
        let schedule = typeof easingFunc === 'function'
            ? easingFunc(percent)
            : percent;

        this.fire('frame', schedule);

        // 结束或者重新开始周期
        // 抛出而不是直接调用事件直到 stage.update 后再统一调用这些事件
        // why?
        if (percent === 1) {
            if (this.loop) {
                this.restart(globalTime);
                return 'restart';
            }
            return 'destroy';
        }
        return null;
    },

    restart: function (globalTime) {
        let remainder = (globalTime - this._startTime - this._pausedTime) % this._lifeTime;
        this._startTime = globalTime - remainder + this.gap;
        this._pausedTime = 0;
    },

    fire: function (eventType, arg) {
        eventType = 'on' + eventType;
        if (this[eventType]) {
            this[eventType](this._target, arg);
        }
    },

    pause: function () {
        this._paused = true;
    },

    resume: function () {
        this._paused = false;
    },

    /**
     * 创建片段
     * @param {*} animationProcess 
     * @param {*} easing 
     * @param {*} oneTrackDone 
     * @param {*} keyframes 
     * @param {*} propName 
     * @param {*} forceAnimate 
     */
    _calculateParams:function(animationProcess, easing, oneTrackDone, keyframes, propName, forceAnimate) {
        let getter = animationProcess._getter;
        let setter = animationProcess._setter;
        let useSpline = easing === 'spline';

        let kfLength = keyframes.length;
        if (!kfLength) {
            return;
        }
        
        // Guess data type
        let firstVal = keyframes[0].value;
        let isValueArray = dataUtil.isArrayLike(firstVal);
        let isValueColor = false;
        let isValueString = false;

        // For vertices morphing
        let arrDim = isValueArray ? dataUtil.getArrayDim(keyframes) : 0;

        keyframes.sort((a, b)=>{
            return a.time - b.time;
        });

        let trackMaxTime = keyframes[kfLength - 1].time;
        let kfPercents = [];
        let kfValues = [];
        let prevValue = keyframes[0].value;
        let isAllValueEqual = true;

        for (let i = 0; i < kfLength; i++) {
            kfPercents.push(keyframes[i].time / trackMaxTime);
            // Assume value is a color when it is a string
            let value = keyframes[i].value;

            // Check if value is equal, deep check if value is array
            if (!((isValueArray && dataUtil.isArraySame(value, prevValue, arrDim))
                || (!isValueArray && value === prevValue))) {
                isAllValueEqual = false;
            }
            prevValue = value;

            // Try converting a string to a color array
            if (typeof value === 'string') {
                let colorArray = colorUtil.parse(value);
                if (colorArray) {
                    value = colorArray;
                    isValueColor = true;
                }else {
                    isValueString = true;
                }
            }
            kfValues.push(value);
        }
        if (!forceAnimate && isAllValueEqual) {
            return;
        }

        let lastValue = kfValues[kfLength - 1];
        // Polyfill array and NaN value
        for (let i = 0; i < kfLength - 1; i++) {
            if (isValueArray) {
                dataUtil.fillArr(kfValues[i], lastValue, arrDim);
            }else {
                if (isNaN(kfValues[i]) && !isNaN(lastValue) && !isValueString && !isValueColor) {
                    kfValues[i] = lastValue;
                }
            }
        }
        isValueArray && dataUtil.fillArr(getter(animationProcess._target, propName), lastValue, arrDim);

        // Cache the key of last frame to speed up when
        // animation playback is sequency
        let lastFrame = 0;
        let lastFramePercent = 0;
        let start;
        let w;
        let p0;
        let p1;
        let p2;
        let p3;
        let rgba = [0, 0, 0, 0];

        let onframe = function (target, percent) {
            // Find the range keyframes
            // kf1-----kf2---------current--------kf3
            // find kf2 and kf3 and do interpolation
            let frame;
            // In the easing function like elasticOut, percent may less than 0
            if (percent < 0) {
                frame = 0;
            }else if (percent < lastFramePercent) {
                // Start from next key
                // PENDING start from lastFrame ?
                start = Math.min(lastFrame + 1, kfLength - 1);
                for (frame = start; frame >= 0; frame--) {
                    if (kfPercents[frame] <= percent) {
                        break;
                    }
                }
                // PENDING really need to do this ?
                frame = Math.min(frame, kfLength - 2);
            }else {
                for (frame = lastFrame; frame < kfLength; frame++) {
                    if (kfPercents[frame] > percent) {
                        break;
                    }
                }
                frame = Math.min(frame - 1, kfLength - 2);
            }
            lastFrame = frame;
            lastFramePercent = percent;

            let range = (kfPercents[frame + 1] - kfPercents[frame]);
            if (range === 0) {
                return;
            }else {
                w = (percent - kfPercents[frame]) / range;
            }
            
            if (useSpline) {
                p1 = kfValues[frame];
                p0 = kfValues[frame === 0 ? frame : frame - 1];
                p2 = kfValues[frame > kfLength - 2 ? kfLength - 1 : frame + 1];
                p3 = kfValues[frame > kfLength - 3 ? kfLength - 1 : frame + 2];
                if (isValueArray) {
                    dataUtil.catmullRomInterpolateArray(
                        p0, p1, p2, p3, w, w * w, w * w * w,
                        getter(target, propName),
                        arrDim
                    );
                }else {
                    let value;
                    if (isValueColor) {
                        value = dataUtil.catmullRomInterpolateArray(
                            p0, p1, p2, p3, w, w * w, w * w * w,
                            rgba, 1
                        );
                        value = dataUtil.rgba2String(rgba);
                    }else if (isValueString) {
                        // String is step(0.5)
                        return dataUtil.interpolateString(p1, p2, w);
                    }else {
                        value = dataUtil.catmullRomInterpolate(
                            p0, p1, p2, p3, w, w * w, w * w * w
                        );
                    }
                    setter(
                        target,
                        propName,
                        value
                    );
                }
            }else {
                if (isValueArray) {
                    dataUtil.interpolateArray(
                        kfValues[frame], kfValues[frame + 1], w,
                        getter(target, propName),
                        arrDim
                    );
                }else {
                    let value;
                    if (isValueColor) {
                        dataUtil.interpolateArray(
                            kfValues[frame], kfValues[frame + 1], w,
                            rgba, 1
                        );
                        value = dataUtil.rgba2String(rgba);
                    }else if (isValueString) {
                        // String is step(0.5)
                        return dataUtil.interpolateString(kfValues[frame], kfValues[frame + 1], w);
                    }else {
                        value = dataUtil.interpolateNumber(kfValues[frame], kfValues[frame + 1], w);
                    }
                    setter(
                        target,
                        propName,
                        value
                    );
                }
            }
        };
        
        let options={
            target: animationProcess._target,
            lifeTime: trackMaxTime,
            loop: animationProcess._loop,
            delay: animationProcess._delay,
            onframe: onframe,
            ondestroy: oneTrackDone,
            easing: (easing && easing !== 'spline')?easing:'Linear'
        };
        return options;
    }
};

export default Timeline;