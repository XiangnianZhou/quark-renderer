import AnimationProcess from './AnimationProcess';
import * as dataUtil from '../core/utils/data_structure_util';

/**
 * @class qrenderer.animation.Animatable
 * 
 * 动画接口类，在 Element 类中 mixin 此类提供的功能，为元素提供动画功能。
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
     * @example
     * el.animate('style', false)
     *   .when(1000, {x: 10} )
     *   .done(function(){ // Animation done })
     *   .start()
     */
    animate: function (path, loop=false) {
        let target;
        let animatable = this;

        if (path) {
            let pathSplitted = path.split('.');
            let prop = animatable;
            for (let i = 0, l = pathSplitted.length; i < l; i++) {
                if (!prop) {
                    continue;
                }
                prop = prop[pathSplitted[i]];
            }
            if (prop) {
                target = prop;
            }
        }else {
            target = animatable;
        }

        if (!target) {
            console.log(`Property ${path} is not existed in element ${animatable.id}`);
            return;
        }

        let animationProcess = new AnimationProcess(target, loop);
        animationProcess.during(function (target) {
            animatable.dirty();
        })
        .done(function () {
            // FIXME AnimationProcess will not be removed if use `AnimationProcess#stop` to stop animation
            animatable.animationProcessList.splice(dataUtil.indexOf(animatable.animationProcessList, animationProcess), 1);
        });
        animatable.animationProcessList.push(animationProcess);

        // If animate after added to the qrenderer
        if (this.__qr) {
            this.__qr.globalAnimationMgr.addAnimationProcess(animationProcess);
        }

        return animationProcess;
    },

    /**
     * @method
     * 停止动画
     * @param {Boolean} forwardToLast If move to last frame before stop
     */
    stopAnimation: function (forwardToLast) {
        this.animationProcessList.forEach((ap,index)=>{
            ap.stop(forwardToLast);
        });
        this.animationProcessList.length=0;
        return this;
    }
};

export default Animatable;