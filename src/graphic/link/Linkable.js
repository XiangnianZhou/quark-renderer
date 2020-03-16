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
    this.isLinkable=true;
    this.hasLinkSlots = false;
    this.showLinkSlots = false;
    this.linkSlots=[];

    this.on("afterRender",()=>{
        if(this.hasLinkSlots&&this.showLinkSlots){
            this.renderLinkSlots(this.ctx, this.prevEl);
        }
    });
    this.on('linkControlShowed',this.showSlots);//FIXME:remove these event listeners when destroy
    this.on('linkControlHid',this.hideSlots);
    this.on('linkControlDragging',this.linkControlDragging);

    LinkMgr.registerLinkable(this);
}

Linkable.prototype={
    constructor:Linkable,

    renderLinkSlots:function(ctx, prevEl){
        this.linkSlots = [];
        ['T','R','B','L'].forEach((name,index)=>{
            let slot = new LinkSlot({
                el:this,
                name:name
            }).render(ctx, prevEl);
            this.linkSlots.push(slot);
        });
    },

    showSlots:function(){
        this.hasLinkSlots = true;
        this.showLinkSlots = true;
        this.dirty();
    },
    
    hideSlots:function(){
        this.hasLinkSlots = false;
        this.showLinkSlots = false;
        this.dirty();
    },
    
    linkControlDragging:function(scope,control){
        //Two circles are colliding if the centers are closer than the sum of the circle’s radii.
        //@see http://www.dyn4j.org/2010/01/sat/
        for(let i=0;i<this.linkSlots.length;i++){
            let slot=this.linkSlots[i];
            let p1=slot.getPosition();
            let p2=control.getPosition();
            let distance=vectorUtil.distance(p1,p2);
            let radiusSum=slot.radius+control.radius;
            if(distance<radiusSum){
                console.log(distance);
                
                return;
            }
        }
    }
}

export default Linkable;