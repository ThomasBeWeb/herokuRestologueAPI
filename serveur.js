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

//Vérifie que les informations reçues correspondent à l’utilisateur
application.post('/verify',
        function (request, response) {

            response.header('Access-Control-Allow-Origin', '*');

            //Recupere les infos à tester
            var userTest = request.body;

            console.log(request.body);

            if ((userTest.username === user.username) && (userTest.password === user.password)) {
                response.status(200).send();
                user.connected = true;
            } else {
                response.status(401).send();
            }
        }
);

//Retourne un status 200 si l’utilisateur est connecté et 401 sinon

application.get('/connected',
        function (request, response) {

            response.header('Access-Control-Allow-Origin', '*');

            if (user.connected === true) {
                response.status(200).send();

            } else {
                response.status(401).send();
            }
        }
);

var user = {
    username: "administrateur",
    password: "1234",
    connected: false
};

//*********************************************************************************************************************
//RECUPERATION DATAS

// Retourne toutes les cartes
application.get("/cartes/get", function (request, response) {

    response.setHeader('Access-Control-Allow-Origin', '*');
    response.setHeader("content-Type", "application/json");
    response.status(200).json(listeDeCartes);
});

// Retourne une carte par son id
application.get("/cartes/:id/get", function (request, response) {

    response.setHeader('Access-Control-Allow-Origin', '*');
    let idCarte = parseInt(request.params.id);
    let aCarte;
    for (var i = 0; i < listeDeCartes.length; i++) {
        aCarte = listeDeCartes[i];
        if (idCarte === listeDeCartes[i].id) {
            response.setHeader("content-Type", "application/json");
            response.status(200).json(aCarte);
        } else {
            response.status(404).send("carte inconnue");
        }
    }

});



//*********************************************************************************************************************
//FONCTIONS
//
// génération de l'id d'une Carte
function generateIdCarte() {
    var idMax = 0;
    for (var i in listeDeCartes) {
        if (listeDeCartes[i].id > idMax) {
            idMax = listeDeCartes[i].id;
        }
    }
    return idMax + 1;
}

//*********************************************************************************************************************
//DATAS

var listeDeMenus = [
    {
        id: 1,
        nom: "menu A",
        entree: {
            nom: "entrée A",
            prix: 0.00
        },
        plat: {
            nom: "plat A",
            prix: 0.00
        },
        dessert: {
            nom: "dessert A",
            prix: 0.00
        }
    },
    {
        id: 2,
        nom: "menu B",
        entree: {
            nom: "entrée B",
            prix: 0.00
        },
        plat: {
            nom: "plat B",
            prix: 0.00
        },
        dessert: {
            nom: "dessert B",
            prix: 0.00
        }
    },
    {
        id: 3,
        nom: "menu C",
        entree: {
            nom: "entrée C",
            prix: 0.00
        },
        plat: {
            nom: "plat C",
            prix: 0.00
        },
        dessert: {
            nom: "dessert C",
            prix: 0.00
        }
    }

];

var listeDeCartes = [
    {
        id: 1,
        nom: "carte 1",
        menu: [1, 2]
    },
    {
        id: 2,
        nom: "carte 2",
        menu: [3, 2]
    },
    {
        id: 3,
        nom: "carte 2",
        menu: [1]
    }

];


