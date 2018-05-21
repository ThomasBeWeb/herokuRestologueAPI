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

//Test API
application.get('/',
        function (request, response) {
            response.send("le git url très fort" + listeDeMenus[0].id);
        }
);

application.use(bodyparser.json());
application.use(bodyparser.urlencoded({
    extended: true
}));

//********************************************************************************************************************
//CONNEXION

//Ajoute un user
application.post('/users/add',
    function (request, response) {

        response.header('Access-Control-Allow-Origin', '*');

        //Recupere les infos du user
        var newUser = request.body;

        //Ajout new ID
        newUser.id = generateIdUser();

        //Ajout dans la liste de Users

        listeUsers.push(newUser);

        response.status(200).send();
        
    }
);

//Supprime un user
application.get("/users/:id/remove", function (request, response) {

    response.header('Access-Control-Allow-Origin', '*');
    let idUser = parseInt(request.params.id);

    for (var i = 0; i < listeUsers.length; i++) {

        if (idUser === listeUsers[i].id) {
            listeUsers.splice(i, 1);
            response.status(200).send();
            break;
        }
    }
});

//Check si un nom d'utilisateur est déjà pris
application.get("/users/checkname/:login", function (request, response) {

    response.header('Access-Control-Allow-Origin', '*');
    let loginToTest = request.params.login;

    var flag = "true";

    for (var i = 0; i < listeUsers.length; i++) {

        if (loginToTest === listeUsers[i].username) {
            flag = "false";
            break;
        }
    }

    response.status(200).send(flag);
});

//*********************************************************************************************************************

// génération de l'id d'un User
function generateIdUser() {
    var idMax = 0;
    for (var i in listeUsers) {
        if (listeUsers[i].id > idMax) {
            idMax = listeUsers[i].id;
        }
    }
    return idMax + 1;
};

//*********************************************************************************************************************

//USERS
var listeUsers = [
    {
    id: 1,
    username: "administrateur",
    },
    {
    id: 2,
    username: "cuisto",
    },
    {
    id: 3,
    username: "jean",
    },
    {
    id: 4,
    username: "jeanne",
    }
];
