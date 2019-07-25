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
	inputs.angle[i].addEventListener('input', updateRatio);
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
	var ratios = calcRatio(angles);

	for (var i = 0; i < ratios.length; i++) {
		inputs.ratio[i].value = ratios[i];
	}

	ctx.clearRect(0, 0, 200, 200);

	ctx.beginPath();
	ctx.arc(100,100,5,0,2*Math.PI,true);
	ctx.fill();

	drawAxis('#ff0000', ratios[0], Math.PI/2 + angles[0]);
	drawAxis('#00ff00', ratios[1], Math.PI/2 - angles[1]);
	drawAxis('#0000ff', ratios[2], Math.PI/2);
}

function drawAxis(colour, r, angle) {
	length=100*r;
	ctx.strokeStyle = colour;

	ctx.globalAlpha = 0.3;
	ctx.beginPath();
	ctx.moveTo(100,100);
	ctx.lineTo(
		100 + length * Math.cos(angle + Math.PI),
		100 - length * Math.sin(angle + Math.PI)
	);
	ctx.stroke();

	ctx.globalAlpha = 1;
	ctx.beginPath();
	ctx.moveTo(100,100);
	ctx.lineTo(
		100 + length * Math.cos(angle),
		100 - length * Math.sin(angle)
	);
	ctx.stroke();
}

function calcRatio(angles) {
	var LT = Math.tan(angles[1] - Math.PI/2);
	var RT = Math.tan(angles[0] - Math.PI/2);
	var CT = Math.tan(3*Math.PI/2 - angles[0] - angles[1]);
	
	return [
		Math.sqrt(1 - RT*CT),
		Math.sqrt(1 - CT*LT),
		Math.sqrt(1 - LT*RT)
	];
}
