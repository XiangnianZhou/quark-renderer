import Path from './Path';
/**
 * @class zrender.graphic.CompoundPath 
 * 
 * CompoundPath to improve performance.
 * 
 * 复合路径，用来提升性能。
 * 
 * @docauthor 大漠穷秋 <damoqiongqiu@126.com>
 */
export default Path.extend({

    /**
     * @property {String} type
     */
    type: 'compound',

    shape: {

        paths: null
    },

    /**
     * @private
     * @method _updatePathDirty
     */
    _updatePathDirty: function () {
        let dirtyPath = this.__dirtyPath;
        let paths = this.shape.paths;
        for (let i = 0; i < paths.length; i++) {
            // Mark as dirty if any subpath is dirty
            dirtyPath = dirtyPath || paths[i].__dirtyPath;
        }
        this.__dirtyPath = dirtyPath;
        this.__dirty = this.__dirty || dirtyPath;
    },

    /**
     * @private
     * @method beforeBrush
     */
    beforeBrush: function () {
        this._updatePathDirty();
        let paths = this.shape.paths || [];
        let scale = this.getGlobalScale();
        // Update path scale
        for (let i = 0; i < paths.length; i++) {
            if (!paths[i].path) {
                paths[i].createPathProxy();
            }
            paths[i].path.setScale(scale[0], scale[1], paths[i].segmentIgnoreThreshold);
        }
    },

    /**
     * @method buildPath
     * 绘制图元路径
     * @param {Object} ctx 
     * @param {String} shape 
     */
    buildPath: function (ctx, shape) {
        let paths = shape.paths || [];
        for (let i = 0; i < paths.length; i++) {
            paths[i].buildPath(ctx, paths[i].shape, true);
        }
    },

    /**
     * @private
     * @method afterBrush
     */
    afterBrush: function () {
        let paths = this.shape.paths || [];
        for (let i = 0; i < paths.length; i++) {
            paths[i].__dirtyPath = false;
        }
    },

    /**
     * @private
     * @method getBoundingRect
     */
    getBoundingRect: function () {
        this._updatePathDirty();
        return Path.prototype.getBoundingRect.call(this);
    }
});