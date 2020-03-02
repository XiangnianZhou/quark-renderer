

export default class TransformEventMgr{
    constructor(dispatcher){
        this.dispatcher=dispatcher;

        this.dispatcher.on("mousemove",this.mouseMoveHandler);
    }

    mouseMoveHandler(e){
        console.log(e);
    }
}