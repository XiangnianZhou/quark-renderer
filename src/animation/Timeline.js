import easingFuncs from './utils/easing';
/**
 * @class zrender.animation.Timeline
 * Timeline，时间线，用来计算元素上的某个属性在指定时间点的数值。
 * @docauthor 大漠穷秋 <damoqiongqiu@126.com>
 */

export default class Timeline{
    /**
     * @method constructor Timeline
     * @param {Object} options 
     * @param {Element} options.target 动画对象，可以是数组，如果是数组的话会批量分发onframe等事件
     * @param {Number} options.life(1000) 动画时长
     * @param {Number} options.delay(0) 动画延迟时间
     * @param {Boolean} options.loop(true)
     * @param {Number} options.gap(0) 循环的间隔时间
     * @param {Function} options.onframe
     * @param {String} options.easing(optional)
     * @param {Function} options.ondestroy(optional)
     * @param {Function} options.onrestart(optional)
     */
    constructor(options){
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

    /**
     * @method nextFrame
     * 进入下一帧
     * @param {Number} globalTime 当前时间
     * @param {Number} deltaTime  时间偏移量
     * //TODO:try move this into webworker
     */
    nextFrame(globalTime, deltaTime) {
        // Set startTime on first frame, or _startTime may has milleseconds different between clips
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
        if (percent === 1) {
            if (this.loop) {
                this.restart(globalTime);
                return 'restart';
            }
            return 'destroy';
        }
        return percent;
    }

    /**
     * @method restart
     * 重新开始
     * @param {Number} globalTime 
     */
    restart(globalTime) {
        let remainder = (globalTime - this._startTime - this._pausedTime) % this._lifeTime;
        this._startTime = globalTime - remainder + this.gap;
        this._pausedTime = 0;
    }

    /**
     * @method fire
     * 触发事件
     * @param {String} eventType 
     * @param {Object} arg 
     */
    fire(eventType, arg) {
        eventType = 'on' + eventType;
        if (this[eventType]) {
            this[eventType](this._target, arg);
        }
    }

    /**
     * @method pause
     * 暂停
     */
    pause() {
        this._paused = true;
    }

    /**
     * @method resume
     * 恢复运行
     */
    resume() {
        this._paused = false;
    }
}