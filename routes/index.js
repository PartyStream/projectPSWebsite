
/*
 * GET home page.
 */

exports.index = function(req, res){
  res.render('index', { title: 'Party Stream' })
};

/**
+   \brief register
+
+       This function will register a user and save their information
+
+   \author Salvatore D'Agostino
+   \date  2013-01-01 23:45
+   \param email   The email address
+   \param response   The result to be returned
**/
function register(email,headers,response,client)
{
  console.log('Register user:');
  console.dir(email);
  var query;

  query = client.query({
    name: 'register user',
    text: "INSERT INTO registeredUsers(email, host,user-agent,date) values($1, $2,$3,current_timestamp)",
    values: [email, header.host, header.user-agent]
  });

  query.on('error',function(err) { console.log('Unable to register user: '+ err); } );
  
  // Send response to client
  response.writeHead(200,{"Content-Type":"text/plain"});
  // response.write("Create User! ");
  response.end();
    
}// END function register
exports.register = register;