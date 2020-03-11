export default class LinkControl {
    constructor(options={}){
        this.el=null;
        this.x1 = 0;
        this.y1 = 0;
        this.x2 = 0;
        this.y2 = 0;
        this.width = 20;
        this.height = 20;
        this.hasControls = false;
        this.lineWidth = 2;
        this.name = 'START';   //START, END
        this.cursor = 'corsshair';
        
        classUtil.copyOwnProperties(this,options);
        this.fillStyle = colorUtil.parse(this.fillStyle);
        this.strokeStyle = colorUtil.parse(this.strokeStyle);
    }
}