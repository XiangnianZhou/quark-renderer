import * as classUtil from '../../utils/class_util';
import * as matrixUtil from '../../utils/affine_matrix_util';
import * as vectorUtil from '../../utils/vector_util';
import * as colorUtil from '../../utils/color_util';
import {mathSin} from '../../utils/constants';

export default class LinkControl {
    constructor(options={}){
        this.el=null;
        
        this.name = 'START';   //START, END
        this.cursor = 'corsshair';
        this.radius = 10;
        this.translate=[0,0];
        this.lineWidth = 2;
        this.hasTransformControls = false;

        // four corner points
        this.x1 = 0;
        this.y1 = 0;
        this.x2 = 0;
        this.y2 = 0;
        this.x3 = 0;
        this.y3 = 0;
        this.x4 = 0;
        this.y4 = 0;

        classUtil.copyOwnProperties(this,options);
        this.fillStyle = colorUtil.parse(this.fillStyle);
        this.strokeStyle = colorUtil.parse(this.strokeStyle);
    }

    render(ctx,prevEl){
        this._renderCircleControl(ctx,prevEl);
        return this;
    }

    _renderCircleControl(ctx,prevEl){
        let param=this._calcParameters();
        ctx.save();
        ctx.setTransform(1, 0, 0, 1, 0, 0);
        ctx.lineWidth = this.lineWidth;
        ctx.fillStyle = this.fillStyle;
        ctx.strokeStyle = this.strokeStyle;
        ctx.translate(this.translate[0],this.translate[1]);
        ctx.beginPath();
        ctx.arc(...[...param,this.radius, 0, 2 * Math.PI]);
        ctx.stroke();
        ctx.restore();
    }

    _calcParameters(){
        let point=[0,0];
        if(this.name==='START'){
            point = this.el.pointAt(0);
        }else if(this.name==='END'){
            point = this.el.pointAt(1);
        }
        point[0]=point[0]-this.radius;

        this.translate=[this.el.position[0],this.el.position[1]];
        return point;
    }

    isHover(x,y){
        let scale=this.el.scale;
        let m, xMin, xMax, yMin, yMax;
        let points=[[this.x1,this.y1],[this.x2,this.y2],[this.x3,this.y3],[this.x4,this.y4]];
        
        //reverse scale
        points.forEach((point,index)=>{
            point[0]=point[0]/scale[0];
            point[1]=point[1]/scale[1];
            point=this.el.localToGlobal(point[0],point[1]);
            points[index]=point;
        });

        return vectorUtil.isInsideRect(...points,[x,y]);
    }
}