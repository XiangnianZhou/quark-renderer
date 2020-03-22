import * as classUtil from '../../utils/class_util';
import * as matrixUtil from '../../utils/affine_matrix_util';
import * as vectorUtil from '../../utils/vector_util';
import * as colorUtil from '../../utils/color_util';
import Eventful from '../../event/Eventful';
import {mathSin} from '../../utils/constants';
import guid from '../../utils/guid';

class LinkControl {
    constructor(options={}){
        this.id=guid();
        this.el = null;
        this.center = [0,0];
        this.radius = 8;
        this.name = 'START';            //START, END
        this.cursor = 'crosshair';
        this.translate=[0,0];
        this.hasTransformControls = false;
        this.lineWidth = 2;
        this.strokeStyle = '#000000';
        this.fillStyle = '#00ff00';
        this.slot=null;
        this.dragging=false;

        classUtil.inheritProperties(this,Eventful,this.options);
        classUtil.copyOwnProperties(this,options);
    }

    render(ctx,prevEl){
        let param=this.calcParameters();
        ctx.save();
        ctx.setTransform(1, 0, 0, 1, 0, 0);
        ctx.lineWidth = this.lineWidth;
        ctx.strokeStyle = this.strokeStyle;
        ctx.fillStyle = this.fillStyle;
        ctx.translate(this.translate[0],this.translate[1]);
        ctx.beginPath();
        ctx.arc(...[...param,this.radius, 0, 2 * Math.PI]);
        ctx.fill();
        ctx.stroke();
        ctx.restore();
        return this;
    }

    calcParameters(){
        this.translate=[this.el.position[0],this.el.position[1]];
        if(this.name==='START'){
            this.center=this.el.firstPoint();
        }else if(this.name==='END'){
            this.center=this.el.lastPoint();
        }
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

    setPosition(x,y){
        let position=this.el.position;
        position=[x-position[0],y-position[1]];
        if(this.name==='START'){
            this.el.setStartPoint(...position);
        }else{
            this.el.setEndPoint(...position);
        }
        this.el.dirty();
    }

    setSlot(slot){
        if(this.slot===slot){
            return;
        }
        this.slot=slot;
        this.updatePosition();
        slot.on("afterRender",this.updatePosition,this);
    }

    deleteSlot(){
        this.slot&&this.slot.off("afterRender",this.updatePosition,this);
        this.slot=null;
    }

    updatePosition(){
        if(this.dragging){
            return;
        }
        this.setPosition(...this.slot.getPosition());
    }
}

classUtil.mixin(LinkControl,Eventful);
export default LinkControl;