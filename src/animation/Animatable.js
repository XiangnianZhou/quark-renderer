import AnimationProcess from './AnimationProcess';
import * as dataUtil from '../core/utils/dataStructureUtil';

/**
 * @class zrender.animation.Animatable
 * 
 * 动画接口类，在 Element 类中 mixin 此类提供的功能，为图元提供动画功能。
 * 
 * @docauthor 大漠穷秋 <damoqiongqiu@126.com>
 */

/**
 * @abstract
 * @method constructor Animatable
 */
let Animatable = function () {
    /**
     * @property {zrender.animation.AnimationProcess}
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
     * @return {zrender.animation.AnimationProcess}
     * @example
     * el.animate('style', false)
     *   .when(1000, {x: 10} )
     *   .done(function(){ // Animation done })
     *   .start()
     */
    animate: function (path, loop) {
        let target;
        let animatingShape = false;
        let animatable = this;
        if (path) {
            let pathSplitted = path.split('.');
            let prop = animatable;
            // If animating shape
            animatingShape = pathSplitted[0] === 'shape';
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
            console.log(
                'Property "'
                + path
                + '" is not existed in element '
                + animatable.id
            );
            return;
        }

        let animationProcess = new AnimationProcess(target, loop);
        animationProcess.during(function (target) {
            animatable.dirty(animatingShape);
        })
        .done(function () {
            // FIXME AnimationProcess will not be removed if use `AnimationProcess#stop` to stop animation
            animatable.animationProcessList.splice(dataUtil.indexOf(animatable.animationProcessList, animationProcess), 1);
        });
        animatable.animationProcessList.push(animationProcess);

        // If animate after added to the zrender
        if (this.__zr) {
            this.__zr.globalAnimationMgr.addAnimationProcess(animationProcess);
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
    },

    /**
     * @method
     * Caution: this method will stop previous animation.
     * So do not use this method to one element twice before
     * animation starts, unless you know what you are doing.
     * @param {Object} [target]
     * @param {Number} [time=500] Time in ms
     * @param {String} [easing='linear']
     * @param {Number} [delay=0]
     * @param {Function} [callback]
     * @param {Function} [forceAnimate] Prevent stop animation and callbackm immediently when target values are the same as current values.
     *
     * @example
     *  // Animate position
     *  el.animateTo({
     *      position: [10, 10]
     *  }, function () { // done })
     *
     *  // Animate shape, style and position in 100ms, delayed 100ms, with cubicOut easing
     *  el.animateTo({
     *      shape: {
     *          width: 500
     *      },
     *      style: {
     *          fill: 'red'
     *      }
     *      position: [10, 10]
     *  }, 100, 100, 'cubicOut', function () { // done })
     */
    animateTo: function (target, time, delay, easing, callback, forceAnimate) {
        _doAnimation(this, target, time, delay, easing, callback, forceAnimate);
    },

    /**
     * @method
     * Animate from the target state to current state.
     * The params and the return value are the same as `this.animateTo`.
     * @param {Object} [target]
     * @param {Number} [time=500] Time in ms
     * @param {String} [easing='linear']
     * @param {Number} [delay=0]
     * @param {Function} [callback]
     * @param {Function} [forceAnimate] Prevent stop animation and callbackm immediently when target values are the same as current values.
     *
     */
    animateFrom: function (target, time, delay, easing, callback, forceAnimate) {
        _doAnimation(this, target, time, delay, easing, callback, forceAnimate, true);
    }
};

/**
 * @private
 * @method
 * @param {Element} animatable 
 * @param {Element} target 
 * @param {Number} time 
 * @param {Number} delay 
 * @param {String} easing 
 * @param {Function} callback 
 * @param {Boolean} forceAnimate 
 * @param {Boolean} reverse 
 */
function _doAnimation(animatable, target, time, delay, easing, callback, forceAnimate, reverse) {
    // animateTo(target, time, easing, callback);
    if (dataUtil.isString(delay)) {
        callback = easing;
        easing = delay;
        delay = 0;
    }
    // animateTo(target, time, delay, callback);
    else if (dataUtil.isFunction(easing)) {
        callback = easing;
        easing = 'linear';
        delay = 0;
    }
    // animateTo(target, time, callback);
    else if (dataUtil.isFunction(delay)) {
        callback = delay;
        delay = 0;
    }
    // animateTo(target, callback)
    else if (dataUtil.isFunction(time)) {
        callback = time;
        time = 500;
    }
    // animateTo(target)
    else if (!time) {
        time = 500;
    }
    // Stop all previous animations
    animatable.stopAnimation();
    animateToShallow(animatable, '', animatable, target, time, delay, reverse);

    // AnimationProcess may be removed immediately after start
    // if there is nothing to animate
    let animationProcessList = animatable.animationProcessList.slice();
    let count = animationProcessList.length;
    function done() {
        count--;
        if (!count) {
            callback && callback();
        }
    }

    // No animationProcessList. This should be checked before animationProcessList[i].start(),
    // because 'done' may be executed immediately if no need to animate.
    if (!count) {
        callback && callback();
    }
    // Start after all animationProcessList created
    // Incase any animationProcess is done immediately when all animation properties are not changed
    for (let i = 0; i < animationProcessList.length; i++) {
        animationProcessList[i]
            .done(done)
            .start(easing, forceAnimate);
    }
}

/**
 * @private
 * @method
 * 
 * @param {Element} animatable
 * @param {String} path=''
 * @param {Object} source=animatable
 * @param {Object} target
 * @param {Number} [time=500]
 * @param {Number} [delay=0]
 * @param {Boolean} [reverse] If `true`, animate
 *        from the `target` to current state.
 *
 * @example
 *  // Animate position
 *  el._animateToShallow({
 *      position: [10, 10]
 *  })
 *
 *  // Animate shape, style and position in 100ms, delayed 100ms
 *  el._animateToShallow({
 *      shape: {
 *          width: 500
 *      },
 *      style: {
 *          fill: 'red'
 *      }
 *      position: [10, 10]
 *  }, 100, 100)
 */
function animateToShallow(animatable, path, source, target, time, delay, reverse) {
    let objShallow = {};
    let propertyCount = 0;
    for (let prop in target) {
        if (!target.hasOwnProperty(prop)) {
            continue;
        }

        if (source[prop] != null) {
            if (dataUtil.isObject(target[prop]) && !dataUtil.isArrayLike(target[prop])) {
                animateToShallow(
                    animatable,
                    path ? path + '.' + prop : prop,
                    source[prop],
                    target[prop],
                    time,
                    delay,
                    reverse
                );
            }else {
                if (reverse) {
                    objShallow[prop] = source[prop];
                    setAttrByPath(animatable, path, prop, target[prop]);
                }else {
                    objShallow[prop] = target[prop];
                }
                propertyCount++;
            }
        }else if (target[prop] != null && !reverse) {
            setAttrByPath(animatable, path, prop, target[prop]);
        }
    }

    if (propertyCount > 0) {
        animatable.animate(path, false)
            .when(time == null ? 500 : time, objShallow)
            .delay(delay || 0);
    }
}

function setAttrByPath(el, path, prop, value) {
    // Attr directly if not has property
    // FIXME, if some property not needed for element ?
    if (!path) {
        el.attr(prop, value);
    }else {
        // Only support set shape or style
        let props = {};
        props[path] = {};
        props[path][prop] = value;
        el.attr(props);
    }
}

export default Animatable;