import * as classUtil from '../../core/utils/class_util';

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
        this.fillStyle = '#0000ff';
        this.strokeStyle = '#000000';
        this.lineWidth = 2;
        this.position = 'TL';   //TL, T, TR, L, R, BL, B, BR, TT
        this.cursor = 'corsshair';
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
        let globalScale = this.el.getGlobalScale();
        ctx.lineWidth = this.lineWidth/globalScale[0];
        ctx.fillStyle = this.fillStyle;
        ctx.strokeStyle = this.strokeStyle;
        ctx.strokeRect(...this._calcCoordinate());
        ctx.closePath();
    }

    _calcCoordinate(){
        let globalScale = this.el.getGlobalScale();
        this.width=this.width/globalScale[0];
        this.height=this.height/globalScale[1];

        let boundingRect = this.el.getBoundingRect();
        switch(this.position){
            case 'TL':
                this.cursor = 'nwse-resize';
                this.xMin = -this.width/2;
                this.yMin = -this.height/2;
                this.xMax = this.width/2;
                this.yMax = this.height/2;
                break;
            case 'T':
                this.cursor = 'ns-resize';
                this.xMin = boundingRect.width/2-this.width/2;
                this.yMin = -this.height/2;
                this.xMax = boundingRect.width/2+this.width/2;
                this.yMax = this.height/2;
                break;
            case 'TR':
                this.cursor = 'nesw-resize';
                this.xMin = boundingRect.width-this.width/2;
                this.yMin = -this.height/2;
                this.xMax = boundingRect.width+this.width/2;
                this.yMax = this.height/2;
                break;
            case 'L':
                this.cursor = 'ew-resize';
                this.xMin = -this.width/2;
                this.yMin = boundingRect.height/2-this.height/2;
                this.xMax = this.width/2;
                this.yMax = boundingRect.height/2+this.height/2;
                break;
            case 'R':
                this.cursor = 'ew-resize';
                this.xMin = boundingRect.width-this.width/2;
                this.yMin = boundingRect.height/2-this.height/2;
                this.xMax = boundingRect.width+this.width/2;
                this.yMax = boundingRect.height/2+this.height/2;
                break;
            case 'BL':
                this.cursor = 'nesw-resize';
                this.xMin = -this.width/2;
                this.yMin = boundingRect.height-this.height/2;
                this.xMax = this.width/2;
                this.yMax = boundingRect.height+this.height/2;
                break;
            case 'B':
                this.cursor = 'ns-resize';
                this.xMin = boundingRect.width/2-this.width/2;
                this.yMin = boundingRect.height-this.height/2;
                this.xMax = boundingRect.width/2+this.width/2;
                this.yMax = boundingRect.height+this.height/2;
                break;
            case 'BR':
                this.cursor = 'nwse-resize';
                this.xMin = boundingRect.width-this.width/2;
                this.yMin = boundingRect.height-this.height/2;
                this.xMax = boundingRect.width+this.width/2;
                this.yMax = boundingRect.height+this.height/2;
                break;
            case 'TT':// rotation control
                this.cursor = 'crosshair';
                this.xMin = boundingRect.width/2-this.width/2;
                this.yMin = -50;
                this.xMax = boundingRect.width/2+this.width/2;
                this.yMax = -50+this.height/2;
                break;
            default:
                this.xMin = -this.width/2;
                this.yMin = -this.height/2;
                this.xMax = this.width/2;
                this.yMax = this.height/2;
                break;
        }
        return [this.xMin,this.yMin,this.width,this.height];
    }

    isHover(x,y){
        let p0 = [this.xMin,this.yMin];
        let p1 = [this.xMax,this.yMax];
        p0 = this.el.localToGlobal(...p0);
        p1 = this.el.localToGlobal(...p1);

        if(x>p0[0]&&x<p1[0]&&y>p0[1]&&y<p1[1]){
            return true;
        }
        return false;
    }

    _renderCircleControl(ctx,prevEl){
        ctx.arc(0,0,10,0,PI2,true);
    }
}