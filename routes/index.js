
/*
 * GET home page.
 */

exports.index = function(req, res){
  res.render('index', { title: 'Party Stream' });
};

/**
+  \brief googleVerification
+
+      This function will just send the google verification file
+
+  \author Salvatore D'Agostino
+  \date  2013-03-24 21:30
+  \param req  The request
+  \param res  The result to pass back to client
+
+  \return NA
**/
exports.googleVerification = function (req,res){
  console.log('Google verification');
  res.writeHead(200,{"Content-Type":"text/plain"});
  res.write("google-site-verification: google572bca5588404eef.html");
  res.end();

};// END function googleVerification

/**
+   \brief siteMap
+
+       This function will echo the sitemap
+
+   \author Salvatore D'Agostino
+   \date  2013-03-24 22:03
+   \param req   The request
+   \param res   The result
+
+   \return NA
**/
function siteMap(req,res)
{
  console.log('SiteMap');
  // this is the source of the URLs on your site, in this case we use a simple array, actually it could come from the database
  var urls = ['index.html'];
  // the root of your website - the protocol and the domain name with a trailing slash
  var root_path = 'http://www.partystreamapp.com/';
  // XML sitemap generation starts here
  var priority = 0.5;
  var freq = 'monthly';
  var xml = '<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">';
  for (var i in urls) {
      xml += '<url>';
      xml += '<loc>'+ root_path + urls[i] + '</loc>';
      xml += '<changefreq>'+ freq +'</changefreq>';
      xml += '<priority>'+ priority +'</priority>';
      xml += '</url>';
      i++;
  }
  xml += '</urlset>';

  res.header('Content-Type', 'text/xml');
  res.send(xml);
}// END function siteMap
exports.siteMap = siteMap;


/**
+   \brief register
+
+       This function will register a user and save their information
+
+   \author Salvatore D'Agostino
+   \date  2013-01-01 23:45
+   \param email      The email address
+   \param headers    The HTTP headers from the request
+   \param ip         The remote IP of the client
+   \param response   The result to be returned
+   \param client     The DB client connection
+   \param mandrill   The Mandrill connection for email receipt
**/
function register(email,headers,ip,response,client,mandrill)
{
  console.log('Register user:');
  console.dir(email);
  console.dir(headers);
  var query;
  var emailMessage = {
    key: process.env.MANDRILL_APIKEY,
    template_name:"WelcomeToPartyStream",
    template_content: [{
    }],
    message: {
      to: [{
          "email": email,
          "name": "New Party Stream Member"
      }],
      headers: {
        "Reply-To":"partystreamapp@gmail.com"
      },
      track_opens: "true"
    },
    async: "true"
  };

    mandrill.messages.sendTemplate(emailMessage);
  query = client.query({
    name: 'register user',
    text: "INSERT INTO registeredUsers(email, host,user_agent,date) values($1, $2,$3,current_timestamp)",
    values: [email, ip, headers['user-agent']]
  });

  query.on('error',function(err) {
   console.log('Unable to register user: '+ err);
  });

  query.on('end', function() {
    response.render('thankyou', { title: 'Party Stream'});
  });
}// END function register
exports.register = register;