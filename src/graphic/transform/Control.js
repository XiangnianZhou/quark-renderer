/**
 * @class qrenderer.graphic.transform.Control
 * 
 * Transform control.
 * 
 * 变换控制点。
 * 
 * @docauthor 大漠穷秋 <damoqiongqiu@126.com>
 */
export default class Control{
    constructor(options){
        this.visible=true;
        this.x=0;
        this.y=0;
        this.offsetX=0;
        this.offsetY=0;
        this.visible=false;
    }

    render(){

    }

    positionHandler(){

    }
    
    renderCircleControl(){

    }

    renderSquareControl(){

    }

    getVisibility(){
        return this.visible;
    }

    setVisibility(visibility){
        this.visible = visibility;
    }

}