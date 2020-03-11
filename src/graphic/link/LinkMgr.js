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
        this.dispatcher.off("mousedown",this.mouseDownHandler1);
        return this;
    }

    mouseDownHandler1(e){
        let el=e.target;
        if(el&&el.isCable){
            console.log(el);
            el.hasLinkControls=true;
            el.dirty();
        }
    }
}