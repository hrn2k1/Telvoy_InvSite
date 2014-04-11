var fs = require('fs');
var config = require('./config.js');
var dao=require('./dataaccess.js');
var utility=require('./utility.js');
var querystring = require("querystring");
var mongo = require('mongodb');
var http = require("http");
var url = require("url");

var debug = config.IS_DEBUG_MODE;




process.on('uncaughtException', function (err) {
    //fs.writeFile("test.txt",  err, "utf8");   
     fs.appendFile("invsiteerrorlog.txt", (new Date()).toISOString()+'>>'+ err+"   ", "utf8");   
});

mongo.MongoClient.connect(config.MONGO_CONNECTION_STRING, function(err, connection) {
   if(err) {
      utility.log('database connection error: '+err,'ERROR');
    
  }
else{

http.createServer(function(request, response) {
    var uri = url.parse(request.url).pathname;

   
    utility.log('Requested URL: '+request.url +' '+ url.parse(request.url).query);
      

    
     if(RightString(uri,4).toLowerCase()==".log"){
         //console.log(RightString(uri,3));
         fs.readFile(__dirname+uri  ,function(error,data){
       if(error){
           response.writeHead(404,{"Content-type":"text/plain"});
           response.end("Sorry the page was not found"+error);
       }else{
           response.writeHead(202,{"Content-type":"text/plain"});
           response.end(data);

       }
        });
    }
    
    else if (uri.toLowerCase() === "/conf") {
        //utility.log('I am in /conf');
        var query = url.parse(request.url).query;
        var params=querystring.parse(query);
          dao.getInvitations(response,connection,utility.Nullify(params['userID']),utility.Nullify(params['id']));
         
    }
    
    else if(uri.toLowerCase()=="/log")
    {
        fs.readFile("../../LogFiles/Application/index.html" ,function(error,data){
            if(error){
               response.writeHead(404,{"Content-type":"text/plain"});
               response.end("Sorry the page was not found"+error);
            }else{
               response.writeHead(202,{"Content-type":"text/html"});
               response.end(data);

            }
        });
    }
    
    else if(RightString(uri,3).toLowerCase()=="txt"){
         //console.log(RightString(uri,3));
         fs.readFile("../../LogFiles/Application"+uri ,function(error,data){
       if(error){
           response.writeHead(404,{"Content-type":"text/plain"});
           response.end("Sorry the page was not found"+error);
       }else{
           response.writeHead(202,{"Content-type":"text/plain"});
           response.end(data);

       }
        });
    }
    
    else {
        response.setHeader("content-type", "text/plain");
        response.write(JSON.stringify(url.parse(request.url)));
        response.end();
    }
   
}).listen(process.env.port || 8282);
}
});

function RightString(str, n){
        if (n <= 0)
        return "";
        else if (n > String(str).length)
        return str;
        else {
        var intLen = String(str).length;
        return String(str).substring(intLen, intLen - n);
            }
}

function replaceAll(find, replace, str) {
  return str.replace(new RegExp(find, 'g'), replace);
}

