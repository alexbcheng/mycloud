const request = require('request');

request('https://jsonplaceholder.typicode.com/users/2', function (error, response, body) {
  	console.error('error:', error); // Print the error if one occurred
  	console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received
	// eval(require('locus')); like a debug mode. freezes code at this point and you can sout variables = npm i -D locus
	if (!error && response.statusCode == 200 ) {
		var parsedData = JSON.parse(body);
 		console.log(`${parsedData.username} lives in ${parsedData.address.city}`);
	}
});

const rp = require('request-promise');

rp('https://jsonplaceholder.typicode.com/posts?userId=2&id=12')
 .then((body) => {
	var parsedData = JSON.parse(body);
	for (var i=0; i< parsedData.length; i++) {
		console.log(`TITLE: ${parsedData[i].title} ; BODY = ${parsedData[i].body}`);
	}	
 })
 .catch((err) => {
	console.error('error: ', err);
 });

rp('https://jsonplaceholder.typicode.com/posts', {
    method: 'POST',
    body: JSON.stringify({
      title: 'test title',
      body: 'test body',
      userId: 10
    }),
    headers: {
      "Content-type": "application/json; charset=UTF-8"
    }
  })
 .then(json => console.log(json))
 .catch((err) => {
	console.error('error: ', err);
 });

