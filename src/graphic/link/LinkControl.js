import * as classUtil from '../../utils/class_util';
import * as matrixUtil from '../../utils/affine_matrix_util';
import * as vectorUtil from '../../utils/vector_util';
import * as colorUtil from '../../utils/color_util';
import {mathSin} from '../../utils/constants';

export default class LinkControl {
    constructor(options={}){
        this.el=null;
        
        // four corner points
        this.x1 = 0;
        this.y1 = 0;
        this.x2 = 0;
        this.y2 = 0;
        this.x3 = 0;
        this.y3 = 0;
        this.x4 = 0;
        this.y4 = 0;

        this.width = 20;
        this.height = 20;
        this.hasTransformControls = false;
        this.lineWidth = 2;
        this.name = 'START';   //START, END
        this.cursor = 'corsshair';

        classUtil.copyOwnProperties(this,options);
        this.fillStyle = colorUtil.parse(this.fillStyle);
        this.strokeStyle = colorUtil.parse(this.strokeStyle);
    }

    render(ctx,prevEl){
        this._renderSquareControl(ctx,prevEl);
        return this;
    }

    _renderSquareControl(ctx,prevEl){
        let param=this._calcParameters();
        ctx.save();
        ctx.setTransform(1, 0, 0, 1, 0, 0);
        ctx.lineWidth = this.lineWidth;
        ctx.fillStyle = this.fillStyle;
        ctx.strokeStyle = this.strokeStyle;
        ctx.strokeRect(...[...param,this.width,this.height]);
        console.log(...[...param,this.width,this.height]);
        ctx.closePath();
        ctx.restore();
    }

    _calcParameters(){
        if(this.name==='START'){
            return this.el.pointAt(0);
        }else if(this.name==='END'){
            return this.el.pointAt(1);
        }
        return [0,0];
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