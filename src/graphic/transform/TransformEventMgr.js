import {EPSILON,mathAbs} from '../constants';

/**
 * @class qrenderer.graphic.TransformEventMgr
 * 
 * Transform event manager. When use select the transform control and begin dragging, the manager will manage the events for this process.
 * 
 * 变换事件管理器。当用户选中元素，开始拖动变换控制杆时，此管理器负责分发事件。
 */
export default class TransformEventMgr{
    constructor(dispatcher){
        this.dispatcher=dispatcher;
        this.startListen();
    }
    
    startListen(){
        //incase there was a selected element
        this._restoreSelection();
        this.selectedEl=null;
        this.lastHoveredControl=null;
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
        }else if(target&&target.id&&target.id.indexOf("el-")!=-1){//click on an element, FIXME:better way to determine whether the target is an element?
            this._clickElement(target);
        }else{//click on anywhere else
            this._hasControls=false;
            this.startListen();
        }
    }

    mouseMoveHandler2(e){
        let x=e.offsetX;    //x position of mouse
        let y=e.offsetY;    //y position of mouse
        let width=this.selectedEl.shape.width;      //original width without transforming
        let height=this.selectedEl.shape.height;    //original height without transforming
        let p0=this.selectedEl.position[0];         //current x position in global space
        let p1=this.selectedEl.position[1];         //current y position in global space
        
        //calculate newSx and newSy
        let newSx=(x-p0)/width;
        let newSy=(y-p1)/height;
        if(mathAbs(newSx)<EPSILON){
            newSx=0;
        }
        if(mathAbs(newSy)<EPSILON){
            newSy=0;
        }

        let sx=this.selectedEl.scale[0];
        let sy=this.selectedEl.scale[1];

        let name=this.lastHoveredControl.name;
        if(name==='T'){
            this.selectedEl.scale=[sx,newSy];
        }else if(name==='B'){
            this.selectedEl.scale=[sx,newSy];
        }else if(name==='R'){
            this.selectedEl.scale=[newSx,sy];
        }else if(name==='L'){
            this.selectedEl.scale=[newSx,sy];
        }else if(name==='BR'){
            this.selectedEl.scale=[newSx,newSy];
        }else if(name==='TL'){
            this.selectedEl.scale=[newSx,newSy];
        }else if(name==='TR'){
            this.selectedEl.scale=[newSx,newSy];
        }else if(name==='BL'){
            this.selectedEl.scale=[newSx,newSy];
        }
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