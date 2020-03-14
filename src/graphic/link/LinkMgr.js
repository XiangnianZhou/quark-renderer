export default class LinkMgr{
    constructor(dispatcher){
        this.dispatcher = dispatcher;
        this.selectedEl=null;
        this.lastHoveredControl=null;
        this._cursor="crosshair";
        this._elDraggable=false;
        this._hasLinkControls=false;
    }

    startListen(){
        this.dispatcher.on("mousedown",this.mouseDownHandler1,this);
        return this;
    }

    stopListen(){
        this.selectedEl=null;
        this.lastHoveredControl=null;
        this._cursor="crosshair";
        this._elDraggable=false;
        this._hasLinkControls=false;
        this.dispatcher.off("mousedown",this.mouseDownHandler1);
        this.dispatcher.off("mousedown",this.mouseDownHandler2);
        this.dispatcher.off("mousemove",this.mouseMoveHandler1);
        this.dispatcher.off("pagemousemove",this.mouseMoveHandler2);
        this.dispatcher.off("pagemouseup",this.mouseUpHandler);
        return this;
    }

    restoreSelection(){
        if(this.selectedEl){
            this.selectedEl.hasLinkControls=false;
            this.selectedEl.draggable=this._elDraggable;
            this.selectedEl.dirty();
        }
    }

    mouseDownHandler1(e){
        let el=e.target;
        if(el&&el.isCable){
            this._clickElement(el);
        }else{
            this.restoreSelection();
            this.stopListen();
            this.startListen();
        }
    }

    _clickElement(el){
        this.restoreSelection();
        this.selectedEl=el;
        this._cursor=el.cursor;
        this._elDraggable=el.draggable;             //cache original draggable flag
        this._hasLinkControls=el.hasLinkControls=true;
        el.dirty();

        //remove mousedown listener first, then start listen to mousemove 
        //and the second mousedown event
        this.dispatcher.off("mousedown",this.mouseDownHandler1);
        this.dispatcher.on("mousemove",this.mouseMoveHandler1,this);
        this.dispatcher.on("mousedown",this.mouseDownHandler2,this);
    }

    mouseMoveHandler1(e){
        if(!this.selectedEl.isCable){
            return;
        }
        let qrX = e.event.qrX;
        let qrY = e.event.qrY;
        this.lastHoveredControl=null;
        this.selectedEl.linkControls.forEach((control,index)=>{
            if(control.isHover(qrX,qrY)){
                this.lastHoveredControl=control;
                this.selectedEl.draggable=false;
                this.dispatcher.interceptor.setCursor(control.cursor);
            }else{
                this.selectedEl.draggable=true;
            }
        });
    }

    mouseDownHandler2(e){
        let target=e.target;
        if(this.lastHoveredControl){                                            //click on a link control
            this._x=e.offsetX;
            this._y=e.offsetY;
            this.dispatcher.off("mousemove",this.mouseMoveHandler1);            //lockdown current clicked control, do not look for hovered control
            this.dispatcher.on("pagemousemove",this.mouseMoveHandler2,this);
            this.dispatcher.on("pagemouseup",this.mouseUpHandler,this);
        }else if(target&&target.id&&target.id.indexOf("el-")!=-1){              //click on an element, FIXME:better way to determine whether the target is an element?
            this._clickElement(target);
        }else{                                                                  //click on anywhere else
            this.restoreSelection();
            this.stopListen();
            this.startListen();
        }
    }

    mouseMoveHandler2(e){
        let mouseX=e.offsetX;    //x position of mouse in global space
        let mouseY=e.offsetY;    //y position of mouse in global space
        let name=this.lastHoveredControl.name;
        if(name==='START'){
            this.handleStartPoint(mouseX,mouseY);
        }else{
            this.handleEndPoint(mouseX,mouseY);
        }
    }

    handleStartPoint(mouseX,mouseY){
        let position=this.selectedEl.position;
        [mouseX,mouseY]=[mouseX-position[0],mouseY-position[1]];
        
        this.selectedEl.setStartPoint(mouseX,mouseY);
        this.selectedEl.dirty();
    }
    
    handleEndPoint(mouseX,mouseY){
        let position=this.selectedEl.position;
        [mouseX,mouseY]=[mouseX-position[0],mouseY-position[1]];

        this.selectedEl.setEndPoint(mouseX,mouseY);
        this.selectedEl.dirty();
    }

    mouseUpHandler(e){
        this.selectedEl.draggable=this._elDraggable;
        this.dispatcher.off("mousedown",this.mouseDownHandler1);
        this.dispatcher.off("pagemousemove",this.mouseMoveHandler2);
        this.dispatcher.off("pagemouseup",this.mouseUpHandler);
        this.dispatcher.on("mousemove",this.mouseMoveHandler1,this);
        this.dispatcher.on("mousedown",this.mouseDownHandler2,this);
    }
}