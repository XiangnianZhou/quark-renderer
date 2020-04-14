import Path from '../Path';
import Linkable from '../link/Linkable';
import * as classUtil from '../../utils/class_util';

/**
 * @class qrenderer.graphic.shape.Shape 
 * Base class of all the shapes.
 * 
 * 
 * 所有形状类的基类。
 * @docauthor 大漠穷秋 <damoqiongqiu@126.com>
 */
class Shape extends Path{
    constructor(options){
        super(options);

        classUtil.inheritProperties(this,Linkable,this.options);
        classUtil.copyOwnProperties(this,this.options,['style','shape']);
    }
}

classUtil.mixin(Shape, Linkable);
export default Shape;