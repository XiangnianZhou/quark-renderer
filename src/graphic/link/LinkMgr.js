export default class LinkMgr{
    constructor(dispatcher){
        this.dispatcher = dispatcher;
        this.selectedEl=null;
        this.lastHoveredControl=null;
    }

    startListen(){
        this.stopListen();
        this.dispatcher.on("mousedown",this.mouseDownHandler1,this);
        return this;
    }

    stopListen(){
        this._restoreSelection();
        this.selectedEl=null;
        this.lastHoveredControl=null;
        this.dispatcher.off("mousedown",this.mouseDownHandler1);
        return this;
    }

    mouseDownHandler1(e){
        let el=e.target;
        if(el&&el.isCable){
            this._clickElement(el);
        }else{
            this.startListen();
        }
    }

    _clickElement(el){
        console.log(el);
        this._restoreSelection();
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

    _restoreSelection(){
        if(this.selectedEl){
            this.selectedEl.hasLinkControls=false;
            this.selectedEl.dirty();
        }
    }

    mouseMoveHandler1(e){
        let qrX = e.event.qrX;
        let qrY = e.event.qrY;
        console.log(`qrX=${qrX},qrY=${qrY}`);
        this.lastHoveredControl=null;
        this.selectedEl.linkControls.forEach((control,index)=>{
            if(control.isHover(qrX,qrY)){
                this.lastHoveredControl=control;
                this.dispatcher.interceptor.setCursor(control.cursor);
            }
        });
    }

    mouseDownHandler2(e){
        let target=e.target;
        if(this.lastHoveredControl){                                    //click on a transform control
            this.selectedEl.draggable=false;
            this._x=e.offsetX;
            this._y=e.offsetY;
            this.dispatcher.off("mousemove",this.mouseMoveHandler1);    //lockdown current clicked control, do not look for hovered control
            this.dispatcher.on("pagemousemove",this.mouseMoveHandler2,this);
            this.dispatcher.on("pagemouseup",this.mouseUpHandler,this);
        }else if(target&&target.id&&target.id.indexOf("el-")!=-1){      //click on an element, FIXME:better way to determine whether the target is an element?
            this._clickElement(target);
        }else{                                                          //click on anywhere else
            this._hasLinkControls=false;
            this.startListen();
        }
    }

    mouseMoveHandler2(e){
        let mouseX=e.offsetX;    //x position of mouse in global space
        let mouseY=e.offsetY;    //y position of mouse in global space
        let name=this.lastHoveredControl.name;
        console.log(name);
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