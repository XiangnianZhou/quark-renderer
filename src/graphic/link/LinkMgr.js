export default class LinkMgr{
    constructor(dispatcher){
        this.dispatcher = dispatcher;
    }

    startListen(){
        this.stopListen();
        this.dispatcher.on("mousedown",this.mouseDownHandler1,this);
        return this;
    }

    stopListen(){
        this.selectedEl=null;
        this.dispatcher.off("mousedown",this.mouseDownHandler1);
        return this;
    }

    mouseDownHandler1(e){
        this._restoreSelection();
        
        let el=e.target;
        if(el&&el.isCable){
            this.selectedEl=el;
            console.log(el);
            el.hasLinkControls=true;
            el.dirty();
        }
    }

    _restoreSelection(){
        if(this.selectedEl){
            this.selectedEl.hasLinkControls=false;
            this.selectedEl.dirty();
        }
    }
}