

export default class TransformEventMgr{
    constructor(dispatcher){
        this.dispatcher=dispatcher;
        this.startListen();
    }
    
    startListen(){
        //incase there was a selected element
        this._restoreSelection();
        //cache x axis
        this._x=0;
        //cache y axis
        this._y=0;
        this._originCursor='default';
        //cache original draggable flag of element
        this._elDraggable=false;
        this._hasControls=false;
        //remove all event listeners
        this.dispatcher.off("mousedown",this.mouseDownHandler1);
        this.dispatcher.off("mousedown",this.mouseDownHandler2);
        this.dispatcher.off("mousemove",this.mouseMoveHandler1);
        this.dispatcher.off("pagemousemove",this.mouseMoveHandler2);
        this.dispatcher.off("pagemouseup",this.mouseUpHandler);
        //just keep one mousedown listener
        this.dispatcher.on("mousedown",this.mouseDownHandler1,this);
    }

    mouseDownHandler1(e){
        let el=e.target;
        if(el&&el.transformable){//click on an element
            this._clickElement(el);
        }else{//no element is clicked
            this.startListen();
        }
    }

    _clickElement(el){
        this._restoreSelection();
        this.selectedEl=el;
        this._originCursor=el.cursor;
        this._elDraggable=el.draggable;//cache original draggable flag
        this._hasControls=el.hasControls=true;
        el.dirty();
    }

    _restoreSelection(){
        if(this.selectedEl){
            //restore original draggable flag
            this.selectedEl.draggable=this._elDraggable;
            this.selectedEl.hasControls=this._hasControls;
            this.selectedEl.dirty();
        }else{
            //remove mousedown listener first, then start listen to mousemove 
            //and the second mousedown event
            this.dispatcher.off("mousedown",this.mouseDownHandler1);
            this.dispatcher.on("mousemove",this.mouseMoveHandler1,this);
            this.dispatcher.on("mousedown",this.mouseDownHandler2,this);
        }
        this.selectedEl=null;
        this.lastHoveredControl=null;
    }

    mouseMoveHandler1(e){
        let qrX = e.event.qrX;
        let qrY = e.event.qrY;
        this.lastHoveredControl=null;
        this.selectedEl.controls.forEach((control,index)=>{
            if(control.isHover(qrX,qrY)){
                this.lastHoveredControl=control;
                this.dispatcher.interceptor.setCursor(control.cursor);
            }
        });
    }

    mouseDownHandler2(e){
        let target=e.target;
        if(this.lastHoveredControl){//click on a transform control
            this.selectedEl.draggable=false;
            this._x=e.offsetX;
            this._y=e.offsetY;
            this.dispatcher.off("mousemove",this.mouseMoveHandler1);//lockdown current clicked control, do not look for hovered control
            this.dispatcher.on("pagemousemove",this.mouseMoveHandler2,this);
            this.dispatcher.on("pagemouseup",this.mouseUpHandler,this);
        }else if(target&&target.id&&target.id.indexOf("el-")!=-1){//click on an element, FIXME:how to decide target is an element?
            this._clickElement(target);
        }else{//click on anywhere else
            this._hasControls=false;
            this.startListen();
        }
    }

    mouseMoveHandler2(e){
        let x=e.offsetX;
        let y=e.offsetY;
        console.log(`offsetX=${x}---offsetY=${y}`);
        let dx=x-this._x;
        let dy=y-this._y;
        //let rect=this.selectedEl.getBoundingRect();
        let dsx=dx/this._x;
        let dsy=dy/this._y;
        console.log(`dsx=${dsx}---dsy=${dsy}`);
        this._x=x;
        this._y=y;
        let sx=this.selectedEl.scale[0];
        let sy=this.selectedEl.scale[1];
        let newSx=sx+dsx;
        let newSy=sy+dsy;
        console.log(`${newSx}---${newSy}`);
        let position=this.lastHoveredControl.position;
        if(position==='T'||position==='B'){
            this.selectedEl.scale=[sx,newSy];
        }else if(position==='L'||position==='R'){
            this.selectedEl.scale=[newSx,sy];
        }else if(position==='TL'||position==='TR'||position==='BL'||position==='BR'){
            this.selectedEl.scale=[newSx,newSy];
        }
        // this.selectedEl.origin=[0,0];
        this.selectedEl.dirty();
    }

    mouseUpHandler(e){
        console.log("control mouse up...");
        this.startListen();
    }
}