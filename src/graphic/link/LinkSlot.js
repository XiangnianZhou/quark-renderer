import * as classUtil from '../../utils/class_util';
import * as matrixUtil from '../../utils/affine_matrix_util';
import * as vectorUtil from '../../utils/vector_util';
import * as colorUtil from '../../utils/color_util';
import Eventful from '../../event/Eventful';
import guid from '../../utils/guid';

/**
 * @abstract
 * @class qrenderer.graphic.link.LinkSlot
 * 
 * 
 * 
 * 插槽用来为 Shape、Image、Text 类型的元素提供连线功能，它的基本特性是：
 * - 插槽不能独立存在的，因为独立存在的插槽没有意义，它必须附着在其它元素上。
 * - 一个插槽上面可以插入多跟连线，插槽和连线之间是一对多的关系。
 * - 插槽自身不能做几何变换，translate/rotate/skew 都不能。因为插槽是用来进行用户交互的，如果它自己做几何变换，那么交互起来就不方便。
 * 
 * @author 大漠穷秋 <damoqiongqiu@126.com>
 * @docauthor 大漠穷秋 <damoqiongqiu@126.com>
 */
class LinkSlot {
    constructor(options={}){
        this.id=guid();
        this.el=null;
        this.center = [0,0];
        this.radius = 8;
        this.name = 'T';                                //TOP, LEFT, RIGHT, BOTTOM
        this.cursor = 'crosshair';
        this.pointCache = new Map();
        this.translate=[0,0];
        this.hasTransformControls = false;
        this.lineWidth = 2;
        this.fillStyle = '#00ff00';
        this.strokeStyle = '#000000';

        this.linkControls=new Map();                  //The cables plugged in this slot, the relationship between slot and cable is one to many.

        classUtil.inheritProperties(this,Eventful,this.options);
        classUtil.copyOwnProperties(this,options);
    }

    render(ctx,prevEl){
        this.renderCircleControl(ctx,prevEl);
        return this;
    }
    
    renderCircleControl(ctx,prevEl){
        let param=this.calcParameters();
        ctx.save();
        ctx.setTransform(1, 0, 0, 1, 0, 0);
        ctx.lineWidth = this.lineWidth;
        ctx.fillStyle = this.fillStyle;
        ctx.strokeStyle = this.strokeStyle;
        ctx.translate(this.translate[0],this.translate[1]);
        ctx.rotate(-this.rotation);
        ctx.beginPath();
        ctx.arc(...[...param,this.radius, 0, 2 * Math.PI]);
        ctx.fill();
        ctx.stroke();
        ctx.restore();
    }

    calcParameters(){
        let transform=this.el.transform;
        let rotation=this.el.rotation;
        let scale=this.el.scale;
        let boundingRect = this.el.getBoundingRect();
        let x=boundingRect.x;
        let y=boundingRect.y;
        let w=boundingRect.width;
        let h=boundingRect.height;

        //step-1: cache 4 points of boundingrect
        this.pointCache.set("T",{position:[w/2,0],name:"T"});
        this.pointCache.set("R",{position:[w,h/2],name:"R"});
        this.pointCache.set("B",{position:[w/2,h],name:"B"});
        this.pointCache.set("L",{position:[0,h/2],name:"L"});

        //step-2: calc coordinates of this control
        let p=null;
        let point=null;
        this.pointCache.forEach((point,key,map)=>{
            p=point.position;
            p[0]=p[0]*scale[0];
            p[1]=p[1]*scale[1];
        });

        //step-3: cache rotation and translate of this.el
        this.rotation=rotation;
        this.translate=[this.el.position[0]+x,this.el.position[1]+y];

        //step-4: return result
        this.center=this.pointCache.get(this.name).position;
        return this.center;
    }

    isHover(x,y){
        let m, xMin, xMax, yMin, yMax;
        let [centerX,centerY]=this.center;
        let points=[
            [centerX-this.radius+this.translate[0],centerY-this.radius+this.translate[1]],
            [centerX+this.radius+this.translate[0],centerY-this.radius+this.translate[1]],
            [centerX+this.radius+this.translate[0],centerY+this.radius+this.translate[1]],
            [centerX-this.radius+this.translate[0],centerY+this.radius+this.translate[1]]
        ];

        let isInsideRect = vectorUtil.isInsideRect(...points,[x,y]);
        return isInsideRect;
    }

    getPosition(){
        return matrixUtil.addVector(this.center,this.translate);
    }

    /**
     * Plug a linkControl to this slot.
     * @param {*} linkControl 
     */
    plugLinkControl(linkControl){
        linkControl.setSlot(this);
        this.linkControls.set(linkControl.id,linkControl);
    }
    
    /**
     * Unplug a linkControl from this slot.
     * @param {*} linkControl
     */
    unPlugLinkControl(linkControl){
        this.linkControls.delete(linkControl.id);
        linkControl.deleteSlot(this);
    }

    linkControlAfterRenderHandler(){

    }
}

classUtil.mixin(LinkSlot,Eventful);
export default LinkSlot;