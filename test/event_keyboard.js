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

circle1.on('mouseover', function () {
    zr.dom.style.cursor = 'move';
});
circle1.on('mouseout', function () {
    zr.dom.style.cursor = 'default';
});
circle1.on('keydown', function (event) {
    console.log('keydown');
    console.log(event);
});
circle1.on('keyup', function (event) {
    console.log('keyup');
    console.log(event);
});
circle1.on('keypress', function (event) {
    console.log('keypress');
    console.log(event);
});

zr.on("pagekeydown",function(event){
    console.log("zr pagekeydown...");
});

zr.add(circle1);