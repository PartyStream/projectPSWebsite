
/*
 * GET home page.
 */

exports.index = function(req, res){
  res.render('index', { title: 'Party Stream' });
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
  console.dir(headers);
  var query;

  query = client.query({
    name: 'register user',
    text: "INSERT INTO registeredUsers(email, host,user_agent,date) values($1, $2,$3,current_timestamp)",
    values: [email, headers.host, headers['user-agent']]
  });

  query.on('error',function(err) {
   console.log('Unable to register user: '+ err);
  });

  query.on('end', function() {
    response.render('thankyou', { title: 'Party Stream'});
  });
}// END function register
exports.register = register;