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
        this.host=options.el;
        this.x = 0;
        this.y = 0;
        this.width = 20;
        this.height = 20;
        this.hasControls = false;
        this.shape = 'square'; //square, circle
        this.action = 'scale'; //scale, rotate
        this.fillStyle = '#0000ff';
        this.strokeStyle = '#000000';
        this.lineWidth = 2;
        this.position = 'TL';   //TL, T, TR, L, R, BL, B, BR, TT
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

    _calcCoordinate(){
        let globalScale = this.host.getGlobalScale();
        this.width=this.width/globalScale[0];
        this.height=this.height/globalScale[1];

        let boundingRect = this.host.getBoundingRect();
        switch(this.position){
            case 'TL':
                this.x = -this.width/2;
                this.y = -this.height/2;
                break;
            case 'T':
                this.x = boundingRect.width/2-this.width/2;
                this.y = -this.height/2;
                break;
            case 'TR':
                this.x = boundingRect.width-this.width/2;
                this.y = -this.height/2;
                break;
            case 'L':
                this.x = -this.width/2;
                this.y = boundingRect.height/2-this.height/2;
                break;
            case 'R':
                this.x = boundingRect.width-this.width/2;
                this.y = boundingRect.height/2-this.height/2;
                break;
            case 'BL':
                this.x = -this.width/2;
                this.y = boundingRect.height-this.height/2;
                break;
            case 'B':
                this.x = boundingRect.width/2-this.width/2;
                this.y = boundingRect.height-this.height/2;
                break;
            case 'BR':
                this.x = boundingRect.width-this.width/2;
                this.y = boundingRect.height-this.height/2;
                break;
            case 'TT':// rotation control
                this.x = boundingRect.width/2-this.width/2;
                this.y = -50;
                break;
            default:
                this.x = -this.width/2;
                this.y = -this.height/2;
                break;
        }
        return [this.x,this.y,this.width,this.height];
    }
    
    _renderSquareControl(ctx,prevEl){
        let globalScale = this.host.getGlobalScale();
        ctx.lineWidth = this.lineWidth/globalScale[0];
        ctx.fillStyle = this.fillStyle;
        ctx.strokeStyle = this.strokeStyle;
        ctx.strokeRect(...this._calcCoordinate());
        ctx.closePath();
    }

    _renderCircleControl(ctx,prevEl){
        ctx.arc(0,0,10,0,PI2,true);
    }
    
    _actionHandler(event){

    }
}