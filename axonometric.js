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
var axis=null;

if(!Math.deg) {
	Math.deg=function deg(angle) {
		return angle*180/this.PI;
	}
}
if(!Math.rad) {
	Math.rad=function rad(angle) {
		return angle*this.PI/180;
	}
}

if (canvas.getContext) {
	var ctx = canvas.getContext('2d');

	updateRatio();
} else {
	console.warn("no canvas support");
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

function handleMouse(e) {
	if (e.buttons & 1) {
		if (axis===null) {
			axis = (e.offsetX>100) ? 1 : -1;
		}
		var angle = Math.atan2(100-e.offsetY,e.offsetX-100);
		angle = axis * (Math.PI/2 - angle);
		if (angle<0) angle+= 2*Math.PI;

		inputs.angle[(axis == 1) ? 1 : 0].value = Math.deg(angle);

		updateRatio();
	} else {
		axis = null
	}
}

function updateRatio() {
	var angles = inputs.angle.map(function(input) {
		return Math.rad(input.value);
	});
	var ratio = calcRatio(angles);

	inputs.ratio[0].value = ratio.left;
	inputs.ratio[1].value = ratio.right;
	inputs.ratio[2].value = ratio.top;

	ctx.clearRect(0, 0, 200, 200);

	ctx.beginPath();
	ctx.arc(100,100,5,0,2*Math.PI,true);
	ctx.fill();

	drawAxis(ratio.top, Math.PI/2);
	drawAxis(ratio.left, angles[0] +Math.PI/2);
	drawAxis(ratio.right,Math.PI/2 - angles[1]);
}

function drawAxis(r, t) {
	length=100*r;
	ctx.beginPath();
	ctx.moveTo(100,100);
	ctx.lineTo(100 + length * Math.cos(t), 100 + length * -Math.sin(t));
	ctx.stroke();
}

function calcRatio(angles) {
	var LT = Math.tan(angles[1] - Math.PI/2);
	var RT = Math.tan(angles[0] - Math.PI/2);
	var CT = Math.tan(3*Math.PI/2 - angles[0] - angles[1]);
	
	return {
		right: Math.sqrt(1 - CT*LT),
		top:   Math.sqrt(1 - LT*RT),
		left:  Math.sqrt(1 - RT*CT)
	};
}
