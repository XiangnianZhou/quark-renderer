import LinkSlot from './LinkSlot';
import LinkMgr from './LinkMgr';

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
        this.on('linkControlShowed',this.showSlots);//FIXME:remove these event listeners when destroy
        this.on('linkControlHid',this.hideSlots);
        this.on('linkControlDragging',this.linkControlDragging);
    });

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
        //判断两个圆圈是否交叉
        console.log(control);
        this.linkSlots.forEach((slot)=>{
            console.log(slot.center);
            console.log(slot.radius);
        });
    }
}

export default Linkable;