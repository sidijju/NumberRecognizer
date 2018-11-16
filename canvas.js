var clickX_simple = new Array();
var clickY_simple = new Array();
var clickDrag_simple = new Array();
var paint_simple;
var canvas_simple;
var context_simple;
var canvasWidth = 400;
var canvasHeight = 400;
var imageSubmit;
var model;
//
/**
* Creates a canvas element.
*/
async function prepareSimpleCanvas()
{
	// Create the canvas (Neccessary for IE because it doesn't know what a canvas element is)
	var canvasDiv = document.getElementById('canvasSimpleDiv');
	//var dataURL = canvas_simple.toDataURL();
	canvas_simple = document.createElement('canvas');
	model = await tf.loadModel('model.json');
	canvas_simple.fillStyle = "white";
	canvas_simple.setAttribute('width', canvasWidth);
	canvas_simple.setAttribute('height', canvasHeight);
	canvas_simple.setAttribute('id', 'canvasSimple');
	canvasDiv.appendChild(canvas_simple);
	if(typeof G_vmlCanvasManager != 'undefined') {
		canvas_simple = G_vmlCanvasManager.initElement(canvas_simple);
	}
	context_simple = canvas_simple.getContext("2d");
	context_simple.rect(0, 0, canvasWidth, canvasHeight);
	context_simple.stroke();
	// Add mouse events
	// ----------------
	$('#canvasSimple').mousedown(function(e)
	{
		// Mouse down location
		var mouseX = e.pageX - this.offsetLeft;
		var mouseY = e.pageY - this.offsetTop;

		paint_simple = true;
		addClickSimple(mouseX, mouseY, false);
		redrawSimple();
	});

	$('#canvasSimple').mousemove(function(e){
		if(paint_simple){
			addClickSimple(e.pageX - this.offsetLeft, e.pageY - this.offsetTop, true);
			redrawSimple();
		}
	});

	$('#canvasSimple').mouseup(function(e){
		paint_simple = false;
	  	redrawSimple();
	});

	$('#canvasSimple').mouseleave(function(e){
		paint_simple = false;
	});

	$('#clearCanvasSimple').mousedown(function(e)
	{
		clickX_simple = new Array();
		clickY_simple = new Array();
		clickDrag_simple = new Array();
		clearCanvas_simple();
	});

	$('#submit').mousedown(function(e)
	{
		document.getElementById("prediction").innerHTML = "Predicting . . .";
		clickX_simple = new Array();
		clickY_simple = new Array();
		clickDrag_simple = new Array();
		runML();
	});

	// Add touch event listeners to canvas element
	canvas_simple.addEventListener("touchstart", function(e)
	{
		// Mouse down location
		var mouseX = (e.changedTouches ? e.changedTouches[0].pageX : e.pageX) - this.offsetLeft,
			mouseY = (e.changedTouches ? e.changedTouches[0].pageY : e.pageY) - this.offsetTop;

		paint_simple = true;
		addClickSimple(mouseX, mouseY, false);
		redrawSimple();
	}, false);
	canvas_simple.addEventListener("touchmove", function(e){

		var mouseX = (e.changedTouches ? e.changedTouches[0].pageX : e.pageX) - this.offsetLeft,
			mouseY = (e.changedTouches ? e.changedTouches[0].pageY : e.pageY) - this.offsetTop;

		if(paint_simple){
			addClickSimple(mouseX, mouseY, true);
			redrawSimple();
		}
		e.preventDefault()
	}, false);
	canvas_simple.addEventListener("touchend", function(e){
		paint_simple = false;
	  	redrawSimple();
	}, false);
	canvas_simple.addEventListener("touchcancel", function(e){
		paint_simple = false;
	}, false);
}

function runML()
{
	fillCanvasBackgroundWithColor(canvas_simple, 'white');
	var image = canvas_simple.toDataURL("images/image.png");
	// RESIZE IMAGE
	console.log(image);
	var canvas_resize = document.createElement('canvas');
	ctx = canvas_resize.getContext("2d");
	fillCanvasBackgroundWithColor(canvas_resize, 'white');
	//CHANGE PNG BACKGROUND TO WHITE
	canvas_resize.width = 28;
	canvas_resize.height = 28;
	ctx.drawImage(canvas_simple, 0, 0, 28, 28);
	var data = tf.fromPixels(canvas_resize, 1);
	tf.fromPixels(canvas_resize, 1).print();
	console.log(canvas_resize.toDataURL("images/image.png"));
	//TENSORFLOW
	var input = data.reshape([1, 28, 28, 1]);
	var prediction = model.predict(input);
	document.getElementById("submission").src = canvas_resize.toDataURL("images/image.png");
	document.getElementById("prediction").innerHTML = "Prediction is " + prediction;
	return prediction;
}

function fillCanvasBackgroundWithColor(canvas, color) {
  const context = canvas.getContext('2d');
  context.save();
  context.globalCompositeOperation = 'destination-over';
  context.fillStyle = color;
  context.fillRect(0, 0, canvas.width, canvas.height);
  context.restore();
}

function addClickSimple(x, y, dragging)
{
	clickX_simple.push(x);
	clickY_simple.push(y);
	clickDrag_simple.push(dragging);
}

function clearCanvas_simple()
{
	context_simple.strokeStyle = "#000000";
	context_simple.lineJoin = "round";
	context_simple.lineWidth = 1;
	context_simple.clearRect(0, 0, canvasWidth, canvasHeight);
	context_simple.strokeRect(0, 0, canvasWidth, canvasHeight);
}

// Converts canvas to an image
function convertCanvasToImage() {
	var image = new Image();
	image = canvas_simple.toDataURL("images/image.png");
	var imageElement = document.getElementById("submission");
	imageSubmit = image;
  imageElement.src = imageSubmit;
	return image;
}

function redrawSimple()
{
	clearCanvas_simple();
	var radius = 75;
	context_simple.strokeStyle = "#000000";
	context_simple.lineJoin = "round";
	context_simple.lineWidth = radius;
	for(var i=0; i < clickX_simple.length; i++)
	{
		context_simple.beginPath();
		if(clickDrag_simple[i] && i){
			context_simple.moveTo(clickX_simple[i-1], clickY_simple[i-1]);
		}else{
			context_simple.moveTo(clickX_simple[i]-1, clickY_simple[i]);
		}
		context_simple.lineTo(clickX_simple[i], clickY_simple[i]);
		context_simple.closePath();
		context_simple.stroke();
	}
}
