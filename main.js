var canvas = document.getElementById('canvas');
canvas.width = Math.round(document.body.clientWidth);
canvas.height = Math.round(document.body.clientHeight);
var ctx = canvas.getContext('2d');

var lsystem = new LSystem(13);
lsystem.generateRandomAxiomAndRules(2, 4, 2, 4);

var startTime = new Date().getTime();

$(lsystem).on('COMPLETE', function(){
	var endTime = new Date().getTime();
	console.log('TIME ELAPSED', (endTime-startTime));

	var colors = {};

	for(var i = 0; i < lsystem.keys.length; i++)
	{
		colors[lsystem.keys[i]] = [Math.round(Math.random()*255), Math.round(Math.random()*255), Math.round(Math.random()*255)];
	}

	var imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
	var currentChar;
	var charIndex = 0;

	console.log('COLORING', (canvas.width*canvas.height), 'PIXELS WITH', lsystem.string.length, 'CHARACTERS');

	var CENTERX = Math.round(canvas.width/2);
	var CENTERY = Math.round(canvas.height/2);
	var x = CENTERX, y = CENTERY, totalInLayer;
	var numLayers = 500;

	for(var i = 0; i <= numLayers; i++)
	{
		totalInLayer = i*8;

		for(var j = 0; j <= totalInLayer; j++)
		{
			if(i >= 2)
			{	
				if(j === 0){ y++; x--; } //start again at bottom left
				else if(j <= (totalInLayer/4)*1){ x++; }
				else if(j <= (totalInLayer/4)*2){ y--; }
				else if(j <= (totalInLayer/4)*3){ x--; }
				else { y++; }

			}else if(i === 1){
				console.log(j)
				if(j === 1){ y++; }
				if(j === 2){ x++; }
				if(j === 3){ y--; }
				if(j === 4){ y--; }
				if(j === 5){ x--; }
				if(j === 6){ x--; }
				if(j === 7){ y++; }
				if(j === 8){ y++; }
			}

			currentChar = lsystem.string.charAt(charIndex);
			//color pixel
			imageDataIndex = (x + y * canvas.width)*4; //*4 for rgba
			imageData.data[imageDataIndex] = colors[currentChar][0];
			imageData.data[imageDataIndex+1] = colors[currentChar][1];
			imageData.data[imageDataIndex+2] = colors[currentChar][2];
			imageData.data[imageDataIndex+3] = 255;

			//loop charIndex
			if(charIndex >= lsystem.string.length-1)
			{
				charIndex = 0;
			}else{
				charIndex++;
			} 
		}
	}

	/*
	for(var x = 0; x < canvas.width; x++)
	{
		for(var y = 0; y < canvas.height; y++)
		{
			currentChar = lsystem.string.charAt(charIndex);

			//color pixel
			imageDataIndex = (x + y * canvas.width)*4; //*4 for rgba
			imageData.data[imageDataIndex] = colors[currentChar][0];
			imageData.data[imageDataIndex+1] = colors[currentChar][1];
			imageData.data[imageDataIndex+2] = colors[currentChar][2];
			imageData.data[imageDataIndex+3] = 255;
			//loop charIndex
			if(charIndex >= lsystem.string.length-1)
			{
				charIndex = 0;
			}else{
				charIndex++;
			}
			
		}
	}
	*/

	ctx.putImageData(imageData, 0, 0);
});

lsystem.generate();

$(document).keypress(function(e) {
	if (e.keyCode == 32) {
	  window.open(canvas.toDataURL(), 'new_window');
	}
});