var http = require('http');
var url = require('url');
var path = require('path');
var fs = require('fs');
var querystring = require('querystring');

var server = http.createServer();

server.on('error', function(err) {
	console.log(err);
});

server.on('listening', function() {
	console.log('listening...');
});

server.on('request', function(req, res) {
	
	var mimeType = {
		'html': 'text/html',
		'css': 'text/css',
		'js': 'application/x-javascript',
		'jpg': 'application/x-jpg',
		'jpeg': 'image/jpeg',
		'png': 'application/x-png',
		'icon': 'image/x-icon',
		'gif': 'image/gif',
		'txt': 'text/plain'
	}

	var urlObj = url.parse(req.url);
	if(urlObj.pathname == '/') {
		urlObj.pathname += 'index.html';
	}
	var staticPath = path.join(__dirname, 'static', urlObj.pathname);
	
	switch(urlObj.pathname) {
		case '/a':
			res.end('a');
			break;

		case '/b':
			res.end('b');
			break;

		case '/login/check':
			if(req.method.toUpperCase() == 'POST') {
				var str = '';
				req.on('data', function(chunk) {
					str += chunk;
				});
				req.on('end', function() {
					var qsObj = querystring.parse(str);
					for(x in qsObj) {
						res.write(x + ':' + qsObj[x] + '   ');
					}
					res.end();
				});
			} else if(req.method.toUpperCase() == 'GET') {
				var qsObj = querystring.parse(urlObj.query);
				/*for(x in qsObj) {
					res.write(x + ':' + qsObj[x] + '   ');
				}*/
				var qsObjStr = JSON.stringify(qsObj);
				res.end(qsObjStr);
			}
			break;

		default:
			fs.readFile(staticPath, function(err, data) {
				if(err) {
					res.end('404 not found');
				} else {
					var fileType = urlObj.pathname.split('.')[1];
					res.writeHead(200, {'Content-Type': mimeType[fileType]});
					res.end(data);
				}
			});
	}
});

server.listen('3000');