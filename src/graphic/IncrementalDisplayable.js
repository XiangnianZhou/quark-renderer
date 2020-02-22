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
    this.elements = [];
    this._temporaryDisplayables = [];
    this._cursor = 0;
    this.notClear = true;
}

let m = [];

IncrementalDisplayble.prototype={
    constructor:IncrementalDisplayble,
    incremental:true,
    clearDisplaybles:function () {
        this.elements = [];
        this._temporaryDisplayables = [];
        this._cursor = 0;
        this.dirty();
        this.notClear = false;
    },
    addDisplayable:function (element, notPersistent) {
        if (notPersistent) {
            this._temporaryDisplayables.push(element);
        }else {
            this.elements.push(element);
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
        for (let i = this._cursor; i < this.elements.length; i++) {
            cb && cb(this.elements[i]);
        }
        for (let i = 0; i < this._temporaryDisplayables.length; i++) {
            cb && cb(this._temporaryDisplayables[i]);
        }
    },
    composeLocalTransform:function () {
        Element.prototype.composeLocalTransform.call(this);
        for (let i = this._cursor; i < this.elements.length; i++) {
            let element = this.elements[i];
            // PENDING
            element.parent = this;
            element.composeLocalTransform();
            element.parent = null;
        }
        for (let i = 0; i < this._temporaryDisplayables.length; i++) {
            let element = this._temporaryDisplayables[i];
            // PENDING
            element.parent = this;
            element.composeLocalTransform();
            element.parent = null;
        }
    },
    brush:function (ctx, prevEl) {
        // Render persistant displayables.
        let i = this._cursor;
        for (; i < this.elements.length; i++) {
            let element = this.elements[i];
            element.beforeBrush && element.beforeBrush(ctx);
            element.brush(ctx, i === this._cursor ? null : this.elements[i - 1]);
            element.afterBrush && element.afterBrush(ctx);
        }
        this._cursor = i;
        // Render temporary displayables.
        for (let i = 0; i < this._temporaryDisplayables.length; i++) {
            let element = this._temporaryDisplayables[i];
            element.beforeBrush && element.beforeBrush(ctx);
            element.brush(ctx, i === 0 ? null : this._temporaryDisplayables[i - 1]);
            element.afterBrush && element.afterBrush(ctx);
        }
        this._temporaryDisplayables = [];
        this.notClear = true;
    },
    getBoundingRect:function () {
        if (!this._rect) {
            let rect = new BoundingRect(Infinity, Infinity, -Infinity, -Infinity);
            for (let i = 0; i < this.elements.length; i++) {
                let element = this.elements[i];
                let childRect = element.getBoundingRect().clone();
                if (element.needLocalTransform()) {
                    childRect.applyTransform(element.getLocalTransform());
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
            for (let i = 0; i < this.elements.length; i++) {
                let element = this.elements[i];
                if (element.contain(x, y)) {
                    return true;
                }
            }
        }
        return false;
    }
}

classUtil.inherits(IncrementalDisplayble, Element);

export default IncrementalDisplayble;