import * as classUtil from '../../utils/class_util';
import * as matrixUtil from '../../utils/affine_matrix_util';
import * as vectorUtil from '../../utils/vector_util';
import * as colorUtil from '../../utils/color_util';
import {mathSin} from '../../utils/constants';

export default class LinkControl {
    constructor(options={}){
        this.el=null;

        // four corner points
        this.center = [0,0];
        this.radius = 10;
        
        this.name = 'START';            //START, END
        this.cursor = 'crosshair';
        this.translate=[0,0];
        this.hasTransformControls = false;
        this.lineWidth = 2;
        this.fillStyle = '#00ff00';
        this.strokeStyle = '#000000';

        classUtil.copyOwnProperties(this,options);
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
        ctx.fill();
        ctx.stroke();
        ctx.restore();
    }

    _calcParameters(){
        let point0=[0,0];
        let point1=[0,0];

        if(this.name==='START'){
            point0 = this.el.pointAt(0);
            point1 = this.el.pointAt(0.1);
        }else if(this.name==='END'){
            point0 = this.el.pointAt(1);
            point1 = this.el.pointAt(0.9);
        }

        let cosp2=matrixUtil.cosp2(point0,point1);//FIXME: there are some errors here
        let sinp2=matrixUtil.sinp2(point0,point1);

        if(cosp2>0){
            point0[0]=point0[0]-this.radius/2;
        }else{
            point0[0]=point0[0]+this.radius/2;
        }

        if(sinp2>0){
            point0[1]=point0[1]-this.radius/2;
        }else{
            point0[1]=point0[1]+this.radius/2;
        }
        
        this.center=point0;
        this.translate=[this.el.position[0],this.el.position[1]];
        return point0;
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
}