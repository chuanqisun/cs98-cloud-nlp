var fs = require('fs');

var AlchemyAPI = require('alchemy_mini');
var alchemyapi = new AlchemyAPI('9cb0f3b96861912dea72ef3ba3b358d98722da43');

var test_url = 'http://dartmouth.smartcatalogiq.com/en/2014/orc/Departments-Programs-Undergraduate/Computer-Science/COSC-Computer-Science-Undergraduate/COSC-60';




var input = fs.createReadStream('./data/urls.txt');
readLines(input, func);

concepts();


//Taxonomy
function concepts() {
	console.log('Checking concepts . . . ');

	alchemyapi.concepts('url', test_url, null, function(response) {
   	console.dir(response);
	});
}


function readLines(input, func) {
  var remaining = '';

  input.on('data', function(data) {
    remaining += data;
    var index = remaining.indexOf('\n');
    while (index > -1) {
      var line = remaining.substring(0, index);
      remaining = remaining.substring(index + 1);
      func(line);
      index = remaining.indexOf('\n');
    }
  });

  input.on('end', function() {
    if (remaining.length > 0) {
      func(remaining);
    }
  });
}

function func(data) {
  console.log('Line: ' + data);
}

