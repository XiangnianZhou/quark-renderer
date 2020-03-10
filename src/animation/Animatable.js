import AnimationProcess from './AnimationProcess';
import * as dataUtil from '../utils/data_structure_util';

/**
 * @class qrenderer.animation.Animatable
 * 
 * 动画接口类，在 Element 类中 mixin 此类提供的功能，为元素提供动画功能。
 * 混入 Animatable 的类必须同时混入 Eventful ，因为动画过程中需要使用事件机制。
 * 
 * @docauthor 大漠穷秋 <damoqiongqiu@126.com>
 */

/**
 * @abstract
 * @method constructor Animatable
 */
let Animatable = function () {
    /**
     * @property {qrenderer.animation.AnimationProcess}
     * @readOnly
     */
    this.animationProcessList = [];
};

Animatable.prototype = {

    constructor: Animatable,

    /**
     * @method 
     * 创建动画实例
     * @param {String} path The path to fetch value from object, like 'a.b.c'.
     * @param {Boolean} [loop=false] Whether to loop animation.
     * @return {qrenderer.animation.AnimationProcess}
     */
    animate: function () {
        let animatable=this;
        let animationProcess = new AnimationProcess(animatable);
        animationProcess.on('done',()=>{
            animatable.removeAnimationProcess(animationProcess);
        });
        animationProcess.on('stop',()=>{
            animatable.removeAnimationProcess(animationProcess);
        });
        animatable.animationProcessList.push(animationProcess);
        if (animatable.__qr) {// If animate after added to the qrenderer
            animatable.__qr.globalAnimationMgr.addAnimatable(animatable);
        }
        return animationProcess;
    },
    
    /**
     * @method
     * 停止动画
     * @param {Boolean} forwardToLast If move to last frame before stop
     */
    stopAnimation: function (forwardToLast=false) {
        this.animationProcessList.forEach((ap,index)=>{
            ap.stop(forwardToLast);
        });
        this.animationProcessList.length=0;
        return this;
    },

    /**
     * @method removeAnimationProcess
     * 删除动画片段
     * @param {AnimationProcess} animationProcess
     */
    removeAnimationProcess(animationProcess) {
        let index=this.animationProcessList.indexOf(animationProcess);
        if(index>=0){
            this.animationProcessList.splice(index,1);
        }
    }
};

export default Animatable;