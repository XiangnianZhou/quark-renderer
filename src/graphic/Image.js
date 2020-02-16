import Displayable from './Displayable';
import BoundingRect from '../graphic/BoundingRect';
import * as dataUtil from '../core/utils/dataStructureUtil';
import * as imageHelper from './utils/image';

/**
 * @class qrenderer.graphic.ZImage 
 * @docauthor 大漠穷秋 <damoqiongqiu@126.com>
 */
export default class ZImage extends Displayable{
    /**
     * @method constructor ZImage
     * @param {Object} options
     */
    constructor(options){
        super(options);
        /**
         * @property {String}
         */
        this.type='image';
    }

    /**
     * @method brush
     * @param {Object} ctx 
     * @param {Element} prevEl 
     */
    brush(ctx, prevEl) {
        let style = this.style;
        let src = style.image;

        // Must bind each time
        style.bind(ctx, this, prevEl);

        let image = this._image = imageHelper.createOrUpdateImage(
            src,
            this._image,
            this,
            this.onload
        );

        if (!image || !imageHelper.isImageReady(image)) {
            return;
        }

        let x = style.x || 0;
        let y = style.y || 0;
        let width = style.width;
        let height = style.height;
        let aspect = image.width / image.height;
        if (width == null && height != null) {
            // Keep image/height ratio
            width = height * aspect;
        }else if (height == null && width != null) {
            height = width / aspect;
        }else if (width == null && height == null) {
            width = image.width;
            height = image.height;
        }

        // 设置transform
        this.setTransform(ctx);

        if (style.sWidth && style.sHeight) {
            let sx = style.sx || 0;
            let sy = style.sy || 0;
            ctx.drawImage(
                image,
                sx, sy, style.sWidth, style.sHeight,
                x, y, width, height
            );
        }else if (style.sx && style.sy) {
            let sx = style.sx;
            let sy = style.sy;
            let sWidth = width - sx;
            let sHeight = height - sy;
            ctx.drawImage(
                image,
                sx, sy, sWidth, sHeight,
                x, y, width, height
            );
        }else {
            ctx.drawImage(image, x, y, width, height);
        }

        // Draw rect text
        if (style.text != null) {
            // Only restore transform when needs draw text.
            this.restoreTransform(ctx);
            this.drawRectText(ctx, this.getBoundingRect());
        }
    }

    /**
     * @method getBoundingRect
     */
    getBoundingRect() {
        let style = this.style;
        if (!this._rect) {
            this._rect = new BoundingRect(
                style.x || 0, style.y || 0, style.width || 0, style.height || 0
            );
        }
        return this._rect;
    }
}