
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
function register(email,headers,response)
{
    console.log(email);
    console.log(headers);

    // Send response to client
    response.writeHead(200,{"Content-Type":"text/plain"});
    response.write("true");
    response.end();
    
}// END function register
exports.register = register;