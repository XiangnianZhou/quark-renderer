import * as classUtil from '../core/utils/class_util';
import Element from './Element';
import BoundingRect from './transform/BoundingRect';

/**
 * @class qrenderer.graphic.IncrementalDisplayble 
 * Displayable for incremental rendering. It will be rendered in a separate layer
 * IncrementalDisplay have two main methods. `clearDisplayables` and `addDisplayables`
 * addDisplayables will render the added displayables incremetally.
 *
 * It use a not clearFlag to tell the painter don't clear the layer if it's the first element.
 * @docauthor 大漠穷秋 <damoqiongqiu@126.com>
 */

/**
 * @method constructor IncrementalDisplayble
 * @param {Object} opts 
 */
// TODO Style override ?
function IncrementalDisplayble(opts) {
    classUtil.inheritProperties(this,Element,opts);
    this._displayables = [];
    this._temporaryDisplayables = [];
    this._cursor = 0;
    this.notClear = true;
}

let m = [];

IncrementalDisplayble.prototype={
    constructor:IncrementalDisplayble,
    incremental:true,
    clearDisplaybles:function () {
        this._displayables = [];
        this._temporaryDisplayables = [];
        this._cursor = 0;
        this.dirty();
        this.notClear = false;
    },
    addDisplayable:function (displayable, notPersistent) {
        if (notPersistent) {
            this._temporaryDisplayables.push(displayable);
        }else {
            this._displayables.push(displayable);
        }
        this.dirty();
    },
    addDisplayables:function (displayables, notPersistent) {
        notPersistent = notPersistent || false;
        for (let i = 0; i < displayables.length; i++) {
            this.addDisplayable(displayables[i], notPersistent);
        }
    },
    eachPendingDisplayable:function (cb) {
        for (let i = this._cursor; i < this._displayables.length; i++) {
            cb && cb(this._displayables[i]);
        }
        for (let i = 0; i < this._temporaryDisplayables.length; i++) {
            cb && cb(this._temporaryDisplayables[i]);
        }
    },
    update:function () {
        this.composeLocalTransform();
        for (let i = this._cursor; i < this._displayables.length; i++) {
            let displayable = this._displayables[i];
            // PENDING
            displayable.parent = this;
            displayable.update();
            displayable.parent = null;
        }
        for (let i = 0; i < this._temporaryDisplayables.length; i++) {
            let displayable = this._temporaryDisplayables[i];
            // PENDING
            displayable.parent = this;
            displayable.update();
            displayable.parent = null;
        }
    },
    brush:function (ctx, prevEl) {
        // Render persistant displayables.
        let i = this._cursor;
        for (; i < this._displayables.length; i++) {
            let displayable = this._displayables[i];
            displayable.beforeBrush && displayable.beforeBrush(ctx);
            displayable.brush(ctx, i === this._cursor ? null : this._displayables[i - 1]);
            displayable.afterBrush && displayable.afterBrush(ctx);
        }
        this._cursor = i;
        // Render temporary displayables.
        for (let i = 0; i < this._temporaryDisplayables.length; i++) {
            let displayable = this._temporaryDisplayables[i];
            displayable.beforeBrush && displayable.beforeBrush(ctx);
            displayable.brush(ctx, i === 0 ? null : this._temporaryDisplayables[i - 1]);
            displayable.afterBrush && displayable.afterBrush(ctx);
        }
        this._temporaryDisplayables = [];
        this.notClear = true;
    },
    getBoundingRect:function () {
        if (!this._rect) {
            let rect = new BoundingRect(Infinity, Infinity, -Infinity, -Infinity);
            for (let i = 0; i < this._displayables.length; i++) {
                let displayable = this._displayables[i];
                let childRect = displayable.getBoundingRect().clone();
                if (displayable.needLocalTransform()) {
                    childRect.applyTransform(displayable.getLocalTransform(m));
                }
                rect.union(childRect);
            }
            this._rect = rect;
        }
        return this._rect;
    },
    contain:function (x, y) {
        let localPos = this.globalToLocal(x, y);
        let rect = this.getBoundingRect();
        if (rect.contain(localPos[0], localPos[1])) {
            for (let i = 0; i < this._displayables.length; i++) {
                let displayable = this._displayables[i];
                if (displayable.contain(x, y)) {
                    return true;
                }
            }
        }
        return false;
    }
}

classUtil.inherits(IncrementalDisplayble, Element);

export default IncrementalDisplayble;