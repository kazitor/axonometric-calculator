var canvas = document.getElementById('axotool');
var inputs = {
	angle: [
		document.getElementById('angle_left'),
		document.getElementById('angle_right')
	],
	ratio: [
		document.getElementById('ratio_left'),
		document.getElementById('ratio_right'),
		document.getElementById('ratio_top'),
	]
}
var data = {
	angles: {
		left: 100 * Math.PI/180,
		right: 120 * Math.PI/180
	},
	ratio: {
		top: 0.947733,
		left:0.888742,
		right:0.558517
	}
};
var axis=null;

if (canvas.getContext) {
	var ctx = canvas.getContext('2d');
	extendContext(ctx);

	drawAxes();
} else {
	console.log("no canvas support");
}

canvas.addEventListener('mousemove', handleMouse);
canvas.addEventListener('mousedown', handleMouse);
canvas.addEventListener('mouseup',   handleMouse);

for (var i = 0; i < inputs.angle.length; i++) {
	inputs.angle[i].addEventListener('change', updateRatio);
	inputs.angle[i].addEventListener('keydown', function () {
		setTimeout(updateRatio, 0);
	});
}

function draw(mouse) {
	if (mouse.b & 1) {
		if (axis===null) {
			axis = (mouse.x>100) ? 1 : -1;
		}
		var angle = Math.atan2(100-mouse.y,mouse.x-100);
		angle = axis * (Math.PI/2 - angle);
		if (angle<0) angle+= 2*Math.PI;

		inputs.angle[(axis == 1) ? 1 : 0].value = Math.deg(angle);

		updateRatio();
	} else {
		axis = null
	}
}

function drawAxes() {
	ctx.clearRect(0, 0, 200, 200);

	ctx.beginPath();
	ctx.arc(100,100,5,0,2*Math.PI,true);
	ctx.fill();

	ctx.drawAxis(data.ratio.top, Math.PI/2);
	ctx.drawAxis(data.ratio.left, data.angles.left +Math.PI/2);
	ctx.drawAxis(data.ratio.right,Math.PI/2 - data.angles.right);
}

function handleMouse(e) {
	draw({
		x: e.offsetX,
		y: e.offsetY,
		b: e.buttons
	});
}

function updateRatio() {
	data.angles.left  = Math.rad(inputs.angle[0].value);
	data.angles.right = Math.rad(inputs.angle[1].value);

	data.ratio = calcRatio(data.angles.left, data.angles.right);

	inputs.ratio[0].value = data.ratio.left;
	inputs.ratio[1].value = data.ratio.right;
	inputs.ratio[2].value = data.ratio.top;

	drawAxes();
}

function calcRatio(left, right) {
	var LT = Math.tan(right - Math.PI/2);
	var RT = Math.tan(left  - Math.PI/2);
	var CT = Math.tan(3*Math.PI/2 - left - right);
	
	return {
		right:  Math.sqrt(1 - CT*LT),
		top:   Math.sqrt(1 - LT*RT),
		left: Math.sqrt(1 - RT*CT)
	};
}

// Adds functionality to a canvas context
function extendContext(ctx) {
	// draws a line from centre with length r and angle t
	ctx.drawAxis=function (r, t) {
		length=100*r;
		this.beginPath();
		this.moveTo(100,100);
		this.lineTo(100 + length * Math.cos(t), 100 + length * -Math.sin(t));
		this.stroke();
	}
}

Math.deg=function (angle) {
	return angle*180/this.PI;
}
Math.rad=function (angle) {
	return angle*this.PI/180;
}