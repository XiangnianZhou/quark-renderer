import LinkSlot from './LinkSlot';
import LinkMgr from './LinkMgr';
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
    this.isLinkable=false;
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
        if(!this.isLinkable){
            return;
        }
        if(this.showLinkSlots){
            this.renderLinkSlots(this.ctx, this.prevEl);
        }
        this.linkSlots.forEach((slot,key,map)=>{
            slot.calcParameters();
            slot.trigger("afterRender",slot);
        });
    },

    renderLinkSlots:function(ctx, prevEl){
        ['T','R','B','L'].forEach((name,index)=>{
            let slot = this.linkSlots.get(name);
            if(!slot){
                slot=new LinkSlot({
                    el:this,
                    name:name
                });
                this.linkSlots.set(name,slot);
            }
            slot.render(ctx, prevEl);
        });
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
            let p1=slot.getPosition();
            let p2=control.getPosition();
            let distance=vectorUtil.distance(p1,p2);
            let radiusSum=slot.radius+control.radius;
            if(distance<radiusSum){
                return {isOverlap:true,slot:slot,control:control};
            }
        }
        return {isOverlap:false};;
    }
}

export default Linkable;