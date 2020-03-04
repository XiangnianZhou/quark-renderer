import * as classUtil from '../../core/utils/class_util';
import * as matrixUtil from '../../core/utils/affine_matrix_util';
import * as colorUtil from '../../core/utils/color_util';

/**
 * @class qrenderer.graphic.Control
 * 
 * Transform control.
 * 
 * 变换控制点。
 * 
 * @docauthor 大漠穷秋 <damoqiongqiu@126.com>
 */
export default class TransformControl {
    constructor(options={}){
        this.el=null;
        this.xMin = 0;
        this.yMin = 0;
        this.xMax = 0;
        this.yMax = 0;
        this.width = 20;
        this.height = 20;
        this.hasControls = false;
        this.shape = 'square'; //square, circle
        this.action = 'scale'; //scale, rotate
        this.fillStyle = colorUtil.parse("#ff0000");
        this.strokeStyle = colorUtil.parse("#ff0000");
        this.lineWidth = 2;
        this.name = 'TL';   //TL, T, TR, L, R, BL, B, BR, TT
        this.cursor = 'corsshair';
        this.pointCache = new Map();
        this.rotation=0;
        this.translate=[0,0];
        
        classUtil.copyOwnProperties(this,options);
    }

    render(ctx,prevEl){
        if(this.shape == 'square'){
            this._renderSquareControl(ctx,prevEl);
        }else if(this.shape == 'circle'){
            this._renderCircleControl(ctx,prevEl);
        }
        return this;
    }
    
    _renderSquareControl(ctx,prevEl){
        let param=this._calcParameters();
        ctx.save();
        ctx.setTransform(1, 0, 0, 1, 0, 0);
        ctx.lineWidth = this.lineWidth;
        ctx.fillStyle = this.fillStyle;
        ctx.strokeStyle = this.strokeStyle;
        ctx.translate(this.translate[0],this.translate[1]);
        ctx.rotate(this.rotation);
        ctx.strokeRect(...[...param.position,this.width,this.height]);
        ctx.closePath();
        ctx.restore();
    }

    _calcParameters(){
        let transform=this.el.getLocalTransform();
        let globalScale=this.el.getGlobalScale();
        let boundingRect = this.el.getBoundingRect();
        let x=boundingRect.x;
        let y=boundingRect.y;
        let w=boundingRect.width;
        let h=boundingRect.height;
        let c=[x+w/2,y+w/2];//center point of bounding rect

        //1.cache 9 points of boundingrect
        this.pointCache.set("TL",{position:[0,0],cursor:'nwse-resize'});
        this.pointCache.set("T",{position:[w/2,0],cursor:'ns-resize'});
        this.pointCache.set("TR",{position:[w,0],cursor:'nesw-resize'});
        this.pointCache.set("R",{position:[w,h/2],cursor:'ew-resize'});
        this.pointCache.set("BR",{position:[w,h],cursor:'nwse-resize'});
        this.pointCache.set("B",{position:[w/2,h],cursor:'ns-resize'});
        this.pointCache.set("BL",{position:[0,h],cursor:'nesw-resize'});
        this.pointCache.set("L",{position:[0,h/2],cursor:'ew-resize'});
        this.pointCache.set("TT",{position:[w/2,-50],cursor:'crosshair'});

        //2.calc coordinates of this control, apply transform matrix
        let sinp=0;
        let cosp=0;
        let p=null;
        let height=this.height;
        let width=this.width;
        let halfH=height/2;
        let halfW=width/2;
        let rotation=0;
        let point=null;

        this.pointCache.forEach((point,key,map)=>{
            p=point.position;
            //apply transform
            p[0]=p[0]*globalScale[0];
            p[1]=p[1]*globalScale[1];
            
            //move origin to the center point of boundingrect
            p[0]=p[0]-c[0];
            p[1]=p[1]-c[1];
            
            //translate, minus this.width or this.height
            sinp=matrixUtil.sinx(p[0],p[1]);
            cosp=matrixUtil.cosx(p[0],p[1]);
            if(cosp<0){
                p[0]=p[0]-width;
            }else if(cosp==0){
                p[0]=p[0]-halfW;
            }
            if(sinp<0){
                p[1]=p[1]-height;
            }else if(sinp==0){
                p[1]=p[1]-halfH;
            }

            //move origin back
            p[0]=p[0]+c[0];
            p[1]=p[1]+c[1];
        });

        //3.calc rotation
        rotation=matrixUtil.atanx(transform[0],transform[1]);
        this.rotation=rotation;
        this.translate=[this.el.position[0],this.el.position[1]];

        //4.return result object
        point=this.pointCache.get(this.name);
        this.xMin=point.position[0];
        this.xMax=this.xMin+this.width;
        this.yMin=point.position[1];
        this.yMax=this.yMin+this.height;
        this.cursor=point.cursor;

        return point;
    }

    isHover(x,y){
        let p0 = [this.xMin,this.yMin];
        let p1 = [this.xMax,this.yMax];
        // p0 = this.el.localToGlobal(...p0);
        // p1 = this.el.localToGlobal(...p1);

        if(x>p0[0]&&x<p1[0]&&y>p0[1]&&y<p1[1]){
            return true;
        }
        return false;
    }

    _renderCircleControl(ctx,prevEl){
        ctx.arc(0,0,10,0,PI2,true);
    }
}