var zr = zrender.init(document.getElementById('main'));
var circle1 = new zrender.Circle({
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

var circle2 = new zrender.Circle({
    shape: {
        cx: 300,
        cy: 300,
        r: 100
    }
});

circle1.on('mouseover', function () {
    zr.dom.style.cursor = 'move';
});
circle1.on('mouseout', function () {
    zr.dom.style.cursor = 'default';
});

circle2.on('dragenter', function () {
    this.setStyle('fill', 'red');
}).on('dragleave', function () {
    this.setStyle('fill', 'black');
}).on('drop', function () {
    this.setStyle('fill', 'green');
});

zr.add(circle2);
zr.add(circle1);

circle2.attr('shape', {
    r: 50 
});

zr.on("click",function(event){
    console.log(event);
});

circle2.on("click",function(event){
    console.log(event);
})