import LinkSlot from './LinkSlot';
import LinkMgr from './LinkMgr';
import Line from '../line/Line';
import * as vectorUtil from '../../utils/vector_util';

/**
 * @abstract
 * @class qrenderer.graphic.link.Linkable
 * 
 * 
 * 
 * 提供连接功能，所有需要用线连起来的类都可以混入此实现。
 * @author 大漠穷秋 <damoqiongqiu@126.com>
 * @docauthor 大漠穷秋 <damoqiongqiu@126.com>
 */
function Linkable(){
    this.linkable=false;
    this.showLinkSlots = false;
    this.linkSlots=new Map();

    this.on("afterRender",this.afterRenderHandler,this);
    this.on('linkControlShowed', this.showSlots, this); //FIXME:remove these event listeners when destroy
    this.on('linkControlHid', this.hideSlots, this);
    this.on('linkControlDragging', this.linkControlDragging, this);
    this.on('linkControlMouseUp', this.linkControlMouseUp, this);

    LinkMgr.registerLinkable(this);
}

Linkable.prototype={
    constructor:Linkable,

    afterRenderHandler:function(){
        if(!this.linkable){
            return;
        }
        this.createLinkSlots(this.ctx, this.prevEl);
        this.linkSlots.forEach((slot,key,map)=>{
            slot.calcParameters();
            slot.trigger("afterRender",slot);
        });
    },

    createLinkSlots:function(ctx, prevEl){
        ['T','R','B','L'].forEach((name,index)=>{
            let slot = this.linkSlots.get(name);
            if(!slot){
                slot=new LinkSlot({
                    el:this,
                    name:name
                });
                this.linkSlots.set(name,slot);
            }
            if(this.showLinkSlots){
                slot.render(ctx, prevEl);
            }
        });
        this.trigger("afterSlotRender",this);
    },

    showSlots:function(){
        this.showLinkSlots = true;
        this.dirty();
    },
    
    hideSlots:function(){
        this.showLinkSlots = false;
        this.dirty();
    },
    
    linkControlDragging:function(scope,control){
        let param=this.getOverlap(control);
        if(param.isOverlap){
            //TODO:add some highlight feature here...
        }
    },

    linkControlMouseUp:function(scope,control){
        let param=this.getOverlap(control);
        if(param.isOverlap){
            control.setSlot(param.slot);
        }
    },

    //Two circles are colliding if the centers are closer than the sum of the circle’s radii.
    //@see http://www.dyn4j.org/2010/01/sat/
    getOverlap:function(control){
        let slots=[...this.linkSlots.values()];
        for(let i=0;i<slots.length;i++){
            let slot=slots[i];
            let p1=slot.getGlobalPosition();
            let p2=control.getGlobalPosition();
            let distance=vectorUtil.distance(p1,p2);
            let radiusSum=slot.radius+control.radius;
            if(distance<radiusSum){
                return {isOverlap:true,slot:slot,control:control};
            }
        }
        return {isOverlap:false};;
    },

    /**
     * @method createLink
     * Link two linkables programmaticly.
     * 
     * 
     * 用程序的方式把两个 linkable 元素连接起来。
     * 
     * @param {*} linkable1 
     * @param {*} linkable2 
     * @param {*} position1 
     * @param {*} position2 
     */
    createLink(linkable1, linkable2, position1='R', position2='L'){
        let line=new Line({
            position: [0, 0],
            draggable: true,
            isCable:true,
            style: {
                stroke: 'rgba(220, 20, 60, 0.8)',
                lineWidth: 2
            },
            shape: {
                x1: 0,
                y1: 0,
                x2: 10,
                y2: 0,
                percent: 1
            }
        });
        this.__qr.add(line);

        this.__qr.eventDispatcher.one("rendered",()=>{
            let slot1=this.linkSlots.get(position1);
            let slot2=linkable2.linkSlots.get(position2);

            let control1=line.startControl;
            let control2=line.endControl;
    
            control1.setSlot(slot1);
            control2.setSlot(slot2);
        },this);
    }
}

export default Linkable;