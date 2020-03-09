import {EPSILON,mathAbs} from '../constants';
import * as matrixUtil from '../../core/utils/affine_matrix_util';

/**
 * @class qrenderer.graphic.TransformMgr
 * 
 * Global transform manager. When user drag the transform control and begin dragging, this manager will handle the events
 * and transform parameters for the selected element.
 * 
 * 全局变换管理器。当用户选中元素，开始拖动变换控制器时，此管理器负责处理事件、重新计算选中元素上的各项参数。
 */
export default class TransformMgr{
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
        //cache center point of bounding rect
        this._center=[0,0];
        //cache cursor type
        this._cursor='default';
        //cache original draggable flag of element
        this._elDraggable=false;
        //whether this.el has controls
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
        this._cursor=el.cursor;
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
        let mouseX=e.offsetX;    //x position of mouse in global space
        let mouseY=e.offsetY;    //y position of mouse in global space
        let name=this.lastHoveredControl.name;
        if(name==='SPIN'){
            this.handleRotate(mouseX,mouseY);
        }else{
            this.handleScale(mouseX,mouseY);
        }
    }

    handleRotate(mouseX,mouseY){
        console.log("rotate...");
    }

    handleScale(mouseX,mouseY){
        let bps=this.getTransformedBoundingRect();
        let [tmx,tmy]=this.transformMousePoint(mouseX,mouseY);
        let width=this.selectedEl.shape.width;              //original width without transforming
        let height=this.selectedEl.shape.height;            //original height without transforming
        let [sx,sy]=this.selectedEl.scale;
        let newSx=mathAbs(tmx/(width/2));
        let newSy=mathAbs(tmy/(height/2));

        let name=this.lastHoveredControl.name;
        if(name.indexOf("T")!=-1){
            newSy=(tmy>=0?-newSy:newSy);
        }else if(name.indexOf("B")!=-1){
            newSy=(tmy>=0?newSy:-newSy);
        }else{
            newSy=sy;
        }

        if(name.indexOf("L")!=-1){
            newSx=(tmx>=0?-newSx:newSx);
        }else if(name.indexOf("R")!=-1){
            newSx=(tmx>=0?newSx:-newSx);
        }else{
            newSx=sx;
        }

        let position=bps[0];
        if(name.indexOf("R")!=-1){
            position[0]=-tmx;
        }else if(name.indexOf("L")!=-1){
            position[0]=tmx;
        }
        if(name.indexOf("B")!=-1){
            position[1]=-tmy;
        }else if(name.indexOf("T")!=-1){
            position[1]=tmy;
        }

        let rotation=this.selectedEl.rotation;
        position=matrixUtil.rotateVector(position,rotation);
        position=matrixUtil.addVector(position,this._center);
        this.selectedEl.position=position;
        this.selectedEl.scale=[newSx,newSy];
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

    /**
     * @private
     * @method getControlMatrix
     * Get the transform matrix of control, controls will not be skewed, so the skew parameters are not considered.
     * 
     * 
     * 获取变换控制器的转换矩阵，变换控制器不会发生斜切，所以这里在计算是不考虑 skew 相关的参数。
     * 
     * TODO:把 skew 参数计算进来，补偿给 scale，从而获得更佳的变换控制器。
     */
    getControlMatrix(){
        let scale=this.selectedEl.scale;
        let rotation=this.selectedEl.rotation;
        let position=this.selectedEl.position;
        let m=matrixUtil.create();
        m=matrixUtil.scale(m,scale);
        m=matrixUtil.rotate(m,rotation);
        m=matrixUtil.translate(m,position);
        return m;
    }

    /**
     * @private
     * @method getTransformedBoundingRect
     * Get transformed bouding rect of selected element, including four corner points, center point of original bounding rect, 
     * and rotate control point. The coordinates returned by this method are in global space.
     * 
     * 
     * 获取变换之后的边界矩形坐标，包括：4个角落上的坐标点、中心坐标点、旋转控制器的坐标点。此方法返回的坐标位于全局空间中。
     */
    getTransformedBoundingRect(){
        let transform=this.getControlMatrix();
        let width=this.selectedEl.shape.width;              //original width without transforming
        let height=this.selectedEl.shape.height;            //original height without transforming
        let rotation=this.selectedEl.rotation;
        this._center=[width/2,height/2];
        this._center=matrixUtil.transformVector(this._center,transform);
        
        let p0=[0,0];
        let p1=[width,0];
        let p2=[width,height];
        let p3=[0,height];
        let p4=[width/2,-50];
        
        // covert coordinate to global space
        p0=matrixUtil.transformVector(p0,transform);
        p1=matrixUtil.transformVector(p1,transform);
        p2=matrixUtil.transformVector(p2,transform);
        p3=matrixUtil.transformVector(p3,transform);
        p4=matrixUtil.transformVector(p4,transform);

        // move origin to this._center point
        p0=matrixUtil.minusVector(p0,this._center);
        p1=matrixUtil.minusVector(p1,this._center);
        p2=matrixUtil.minusVector(p2,this._center);
        p3=matrixUtil.minusVector(p3,this._center);
        p4=matrixUtil.minusVector(p4,this._center);

        // rotate with element's rotation
        p0=matrixUtil.rotateVector(p0,-rotation);
        p1=matrixUtil.rotateVector(p1,-rotation);
        p2=matrixUtil.rotateVector(p2,-rotation);
        p3=matrixUtil.rotateVector(p3,-rotation);
        p4=matrixUtil.rotateVector(p4,-rotation);

        return [p0,p1,p2,p3,p4,this._center];
    }

    /**
     * @private
     * @method transformMousePoint
     * Transform the cursor origin to the center point of bounding rect, then rotate the same angel as the element does.
     * 
     * 
     * 把光标的原点变换到边界矩形的中心点，并与元素保持相同的旋转角。
     * 
     * @param {*} x 
     * @param {*} y 
     */
    transformMousePoint(x,y){
        let rotation=this.selectedEl.rotation;
        [x,y]=matrixUtil.minusVector([x,y],this._center);
        [x,y]=matrixUtil.rotateVector([x,y],-rotation);//为什么这里的旋转是反向的？
        return [x,y];
    }
}