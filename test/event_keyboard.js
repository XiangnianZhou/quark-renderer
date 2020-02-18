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

var circle2 = new QuarkRenderer.Circle({
    shape: {
        cx: 60,
        cy: 60,
        r: 30
    },
    style: {
        fill: 'blue'
    },
    draggable: true
});

circle1.on('mouseover', function () {
    qr.host.style.cursor = 'move';
});
circle1.on('mouseout', function () {
    qr.host.style.cursor = 'default';
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

// qr.on("pagekeydown",function(event){
//     console.log("qr pagekeydown...");
// });

qr.add(circle1);
qr.add(circle2);