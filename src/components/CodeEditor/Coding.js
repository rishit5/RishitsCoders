var HackerEarthAPI = require('node-hackerearth');
 
var clientSecretKey = 'a5c76cc2ad3f842de75958c0ed8fecfbad5ee26f';
 
var api = new HackerEarthAPI(clientSecretKey);
 
var data = "print 'Hello World'";
 
api.compile({ source: data, lang: 'PYTHON' }, function (err, data) {
  if (err) {
    console.log(err.message);
  } else {
    console.log(JSON.stringify(data)); // Do something with your data
  }
});
 
api.run({ source: data, lang: 'PYTHON', time_limit: 1 }, function (err, data) {
  if (err) {
    console.log(err.message);
  } else {
    console.log(JSON.stringify(data)); // Do something with your data
  }
});