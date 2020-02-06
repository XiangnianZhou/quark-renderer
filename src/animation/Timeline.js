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

function Timeline(options) {
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
        return percent;
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
    }
};

export default Timeline;