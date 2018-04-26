//Import du framework express
const express = require("express");
//Creation d'un objet express
var application = express();

//Recup de bodyparser
var bodyparser = require("body-parser");


const path = require('path');

// process.env.PORT lets the port be set by Heroku
const port = process.env.PORT || 5000;

application.listen(port, () => console.log('Listening on ${ PORT}'));

//Import de la liste des menus
require('./data.js').listeDeMenus;

//Test API
application.get('/',
	function(request,response){
		response.send("le git url très fort" + listeDeMenus[0].id);
	}
);


