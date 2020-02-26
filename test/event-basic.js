var qr = QuarkRenderer.init(document.getElementById('main'));
var circle1 = new QuarkRenderer.Circle({
    shape: {
        cx: 20,
        cy: 20,
        r: 30
    },
    style: {
        fill: 'blue'
    },
    draggable: true
});

var circle3 = new QuarkRenderer.Circle({
    shape: {
        cx: 70,
        cy: 70,
        r: 30
    },
    style: {
        fill: '#ccc'
    },
    draggable: true
});

var circle2 = new QuarkRenderer.Circle({
    shape: {
        cx: 300,
        cy: 300,
        r: 100
    },
    draggable: true
});

circle1.on('mouseover', function () {
    qr.host.style.cursor = 'move';
});
circle1.on('mouseout', function () {
    qr.host.style.cursor = 'default';
});

circle2.on('dragenter', function () {
    this.attr({style:{fill:'red'}});
}).on('dragleave', function () {
    this.attr({style:{fill:'black'}});
}).on('drop', function () {
    this.attr({style:{fill:'green'}});
});

qr.add(circle2);
qr.add(circle1);
qr.add(circle3);

qr.on("click",function(event){
    console.log(event);
});

circle2.on("click",function(event){
    console.log(event);
})