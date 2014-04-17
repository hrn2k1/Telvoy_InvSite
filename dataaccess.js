//var config=require('./config.js');
var utility=require('./utility.js');

function unSuccessJson(error){
  var msg={"Status":"Unsuccess","Error":error};
  return JSON.stringify(msg);
}
function getInvitations(response,connection,userID,id){

  if( userID == null ) userID = 'mmnitol@outlook.com';
  if( id == null ) id = 0;
//console.log(config.MONGO_CONNECTION_STRING);
 if(connection==null) {
      utility.log('database connection is null','ERROR');
      response.setHeader("content-type", "text/plain");
      //response.write('{\"Status\":\"Unsuccess\"}');
      response.write('{\"invitations\":[]}');
      response.end();
      return;
  }
    var Invitations = connection.collection('Invitations');

    Invitations.find({ EndTime : { $gte : new Date() }, Attendees : { $elemMatch : { UserID : userID } } }, { Attendees : 0 }).sort({InvTime:1}).toArray(
          function (error, result) {
          if(error)
          {
            utility.log("Invitations find error: " + error,'ERROR');
            response.setHeader("content-type", "text/plain");
            response.write(unSuccessJson(error));
            response.end();
            
          }
          else
          {
            utility.log(result);
            response.setHeader("content-type", "text/plain");
            response.write("{\"invitations\":"+JSON.stringify(result)+"}");
            response.end();
            
          }

          });




}

function getInvitations_back(response,connection,userID,id){

  if( userID == null ) userID = 'sumon@live.com';
  if( id == null ) id = 0;
//console.log(config.MONGO_CONNECTION_STRING);
 if(connection==null) {
      utility.log('database connection is null','ERROR');
      response.setHeader("content-type", "text/plain");
      //response.write('{\"Status\":\"Unsuccess\"}');
      response.write('{\"invitations\":[]}');
      response.end();
      return;
  }
    var Invitations = connection.collection('Invitations');
    var Invitees = connection.collection('Invitees');

    Invitees.find({ UserID: userID}).toArray(
    function (error, result) {
      if(error)
      {
        utility.log("Invitees find error: " + error,'ERROR');
        response.setHeader("content-type", "text/plain");
        response.write(unSuccessJson(error));
        response.end();
        
      }
      else
      {
        utility.log(result);
        /////

          var Invitations_ids = [];
          for (var i = 0; i < result.length; i++) {
            Invitations_ids.push(result[i].Invitations_id);
          };

          Invitations.find({ _id: {$in : Invitations_ids}, EndTime : {$gte : new Date()}}).toArray(
          function (error, result) {
          if(error)
          {
            utility.log("Invitations find error: " + error,'ERROR');
            response.setHeader("content-type", "text/plain");
            response.write(unSuccessJson(error));
            response.end();
            
          }
          else
          {
            utility.log(result);
            response.setHeader("content-type", "text/plain");
            response.write("{\"invitations\":"+JSON.stringify(result)+"}");
            response.end();
            
          }

          });

        /////
      }
    });

}


exports.getInvitations=getInvitations;
