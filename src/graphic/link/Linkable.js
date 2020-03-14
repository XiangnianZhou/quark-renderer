import LinkSlot from './LinkSlot';

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
    this.hasLinkSlots = true;
    this.showLinkSlots = true;

    this.linkSlots=[];

    this.on("afterRender",()=>{
        if(this.hasLinkSlots&&this.showLinkSlots){
            this.renderLinkSlots(this.ctx, this.prevEl);
        }
    });
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
    }
}

export default Linkable;