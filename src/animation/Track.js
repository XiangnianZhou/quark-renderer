/**
 * Track, 轨道，与图元（Element）上可以用来进行动画的属性一一对应。
 * 图元上存在很多种属性，在动画过程中，可能会有多种属性同时发生变化，
 * 每一种属性天然成为一条动画轨道，把这些轨道上的变化过程封装在 Timeline 中。
 */
import Timeline from './Timeline';
import * as colorUtil from '../core/colorUtil';
import * as dataUtil from '../core/dataStructureUtil';

export default class Track{
    constructor(options){
        this._target=options._target;
        this._getter=options._getter;
        this._setter=options._setter;
        this._loop=options._loop;
        this._delay=options._delay;
        
        this.isFinished=false;
        this.keyframes=[];
        this.timeline;
    }

    addKeyFrame(kf){
        this.keyframes.push(kf);
    }

    nextFrame(time, delta){
        if(!this.timeline){//TODO:fix this, there is something wrong here.
            return;
        }
        let result=this.timeline.nextFrame(time,delta);
        if(dataUtil.isNumeric(result)&&result===1){
            this.isFinished=true;
        }
        return result;
    }

    fire(eventType, arg){
        this.timeline.fire(eventType, arg);
    }

    start(easing,propName, forceAnimate){
        let options=this._parseKeyFrames(
            easing, 
            propName, 
            forceAnimate
        );
    
        //如果传入的参数不正确，则无法构造实例
        if(!options){
            return null;
        }
        let timeline = new Timeline(options);
        this.timeline=timeline;
    }

    stop(forwardToLast){
        if (forwardToLast) {
            // Move to last frame before stop
            this.timeline.onframe(this._target, 1);
        }
    }

    pause(){
        this.timeline.pause();
    }

    resume(){
        this.timeline.resume();
    }

    _parseKeyFrames(easing,propName,forceAnimate) {
        let loop=this._loop;
        let delay=this._delay;
        let target=this._target;
        let getter=this._getter;
        let setter=this._setter;
        let useSpline = easing === 'spline';
    
        let kfLength = this.keyframes.length;
        if (!kfLength) {
            return;
        }
        
        // Guess data type
        let firstVal = this.keyframes[0].value;
        let isValueArray = dataUtil.isArrayLike(firstVal);
        let isValueColor = false;
        let isValueString = false;
    
        // For vertices morphing
        let arrDim = isValueArray ? dataUtil.getArrayDim(this.keyframes) : 0;
    
        this.keyframes.sort((a, b)=>{
            return a.time - b.time;
        });
    
        let trackMaxTime = this.keyframes[kfLength - 1].time;
        let kfPercents = [];
        let kfValues = [];
        let prevValue = this.keyframes[0].value;
        let isAllValueEqual = true;
    
        for (let i = 0; i < kfLength; i++) {
            kfPercents.push(this.keyframes[i].time / trackMaxTime);
            // Assume value is a color when it is a string
            let value = this.keyframes[i].value;
    
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
        isValueArray && dataUtil.fillArr(getter(target, propName), lastValue, arrDim);
    
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
            target:target,
            lifeTime: trackMaxTime,
            loop:loop,
            delay:delay,
            onframe: onframe,
            easing: (easing && easing !== 'spline')?easing:'Linear'
        };
        return options;
    }
}