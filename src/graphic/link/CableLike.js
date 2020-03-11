/**
 * @abstract
 * @class qrenderer.graphic.link.CableLike
 * 
 * 连接线抽象类，需要成为连接线的类都可以混入此抽象类的实现。
 */
function CableLike(){
    this.isCable = true;
    
}

CableLike.prototype={
    constructor:CableLike
}

export default CableLike;