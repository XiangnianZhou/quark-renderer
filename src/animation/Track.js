/**
 * Track, 轨道，与图元（Element）上可以用来进行动画的属性一一对应。
 */
import Timeline from './Timeline';
import * as dataUtil from '../core/dataStructureUtil';

export default class Track{
    constructor(options){
        this._target=options._target;
        this._getter=options._getter;
        this._setter=options._setter;
        
        this.isFinished=false;
        this.keyframes=[];
        this.timeline;
    }

    addKeyFrame(kf){
        this.keyframes.push(kf);
    }

    nextFrame(time, delta){
        let result=this.timeline.step(time,delta);
        if(dataUtil.isNumeric(result)&&result===1){
            this.isFinished=true;
        }
        return result;
    }

    fire(eventType, arg){
        this.timeline.fire(eventType, arg);
    }

    start(animationProcess, easing, ondestroy,  propName, forceAnimate){
        //createTimeline
        let timeline = new Timeline(animationProcess, easing, ondestroy, this.keyframes, propName, forceAnimate);
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
}