window.NUM_WORKERS = 8;
window.parallel = new Parallel();

var canvas = document.getElementById('canvas');
canvas.width = Math.round(document.body.clientWidth);
canvas.height = Math.round(document.body.clientHeight);
var ctx = canvas.getContext('2d');

var lsystem = new LSystem(12);
lsystem.generateRandomAxiomAndRules(2, 4, 2, 4);
lsystem.generate();

$(lsystem).on('COMPLETE', function(){
	console.log('HANDLE COMPLETE');
	var colors = {};

	for(var i = 0; i < lsystem.keys.length; i++)
	{
		colors[lsystem.keys[i]] = [Math.round(Math.random()*255), Math.round(Math.random()*255), Math.round(Math.random()*255)];
	}

	var blockSize = canvas.height/window.NUM_WORKERS;
	var dataArray = [];

	for(var j = 0; j < window.NUM_WORKERS; j++)
	{
		var data = {};

		data.imageData = ctx.getImageData(0, blockSize*j, canvas.width, blockSize);
		data.colors = colors;
		data.string = lsystem.string;
		data.index = Math.floor((canvas.width*canvas.height)/NUM_WORKERS);

		console.log(data)
		dataArray.push(data);
		console.log(dataArray)
	}

	console.log(dataArray)

	window.parallel.data = dataArray;

	/*
	window.parallel.map(setPixels).then(function(){
		for(var i = 0; i < window.parallel.data; i++)
		{
			ctx.putImageData(window.parallel.data[i], 0, blockSize*i);
		}
	});
*/

});


function setPixels(data) {
	var currentChar, imageDataIndex;

	var index = data.index;

	for(var x = 0; x < data.imageData.width; x++)
	{
		for(var y = 0; y < data.imageData.height; y++)
		{
			currentChar = data.string.charAt(index);

			//color pixel
			imageDataIndex = (x + y * data.imageData.width)*4; //*4 for rgba
			data.imageData.data[imageDataIndex] = data.colors[currentChar][0];
			data.imageData.data[imageDataIndex+1] = data.colors[currentChar][1];
			data.imageData.data[imageDataIndex+2] = data.colors[currentChar][2];
			data.imageData.data[imageDataIndex+3] = 255;
			//loop index
			if(index >= data.string.length-1)
			{
				index = data.index;
			}else{
				index++;
			}
		}
	}

	return data.imageData;
}