import * as classUtil from '../../utils/class_util';
import * as matrixUtil from '../../utils/affine_matrix_util';
import * as vectorUtil from '../../utils/vector_util';
import * as colorUtil from '../../utils/color_util';

export default class LinkControl {
    constructor(options={}){
        this.el=null;
        this.center = [0,0];
        this.radius = 8;
        this.name = 'T';                    //TOP, LEFT, RIGHT, BOTTOM
        this.cursor = 'crosshair';
        this.pointCache = new Map();
        this.translate=[0,0];
        this.hasTransformControls = false;
        this.lineWidth = 2;
        this.fillStyle = '#00ff00';
        this.strokeStyle = '#000000';
        this.cableMap=new Map();                  //The cables plugged in this slot.

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
        ctx.rotate(-this.rotation);
        ctx.beginPath();
        ctx.arc(...[...param.position,this.radius, 0, 2 * Math.PI]);
        ctx.fill();
        ctx.stroke();
        ctx.restore();
    }

    _calcParameters(){
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
        point=this.pointCache.get(this.name);
        this.center=point;
        return point;
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

    /**
     * Plug a cable to this slot.
     * @param {*} cable 
     */
    plugCable(cable){
        this.cableMap.set(cable.id,cable);
        cable.trigger('pluginSlot',cable,this);
    }
    
    /**
     * Unplug a cable from this slot.
     * @param {*} cable 
     */
    unPlugCable(cable){
        this.cableMap.delete(cable.id);
        cable.trigger('unplugSlot',cable,this);
    }
}