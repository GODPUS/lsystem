var canvas = document.getElementById('canvas');
canvas.width = Math.round(document.body.clientWidth);
canvas.height = Math.round(document.body.clientHeight);
var ctx = canvas.getContext('2d');

var lsystem = new LSystem(12);
lsystem.generateRandomAxiomAndRules(2, 4, 2, 4);
lsystem.generate();

var colors = {};

for(var i = 0; i < lsystem.keys.length; i++)
{
	colors[lsystem.keys[i]] = [Math.round(Math.random()*255), Math.round(Math.random()*255), Math.round(Math.random()*255)];
}

var imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
var index = 0;
var currentChar;

for(var x = 0; x < canvas.width; x++)
{
	for(var y = 0; y < canvas.height; y++)
	{
		currentChar = lsystem.string.charAt(index);

		//color pixel
		imageDataIndex = (x + y * canvas.width)*4; //*4 for rgba
		imageData.data[imageDataIndex] = colors[currentChar][0];
		imageData.data[imageDataIndex+1] = colors[currentChar][1];
		imageData.data[imageDataIndex+2] = colors[currentChar][2];
		imageData.data[imageDataIndex+3] = 255;
		//loop index
		if(index >= lsystem.string.length-1)
		{
			index = 0;
		}else{
			index++;
		}
		
	}
}

ctx.putImageData(imageData, 0, 0);

$(document).keypress(function(e) {
	if (e.keyCode == 32) {
	  window.open(canvas.toDataURLHD(), 'new_window');
	}
});

