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

    response.header('Access-Control-Allow-Origin', '*');
    response.setHeader("content-Type", "application/json");
    response.status(200).json(listeDeCartes);
});

// Retourne une carte par son id, les menus sont renvoyes au format json
application.get("/cartes/:id/get", function (request, response) {

    response.header('Access-Control-Allow-Origin', '*');
    //Recup ID
    let idCarte = parseInt(request.params.id);

    //Creation d'une carte à retourner
    var carteEnCours = {
        nom: "",
        menu: []
    };

    //Recup du nom et de la liste d'ID des menus
    var listeID;

    for (var i = 0; i < listeDeCartes.length; i++) {
        if (idCarte === listeDeCartes[i].id) {
            carteEnCours.nom = listeDeCartes[i].nom;
            listeID = listeDeCartes[i].menu;
            break;
        }
    }

    //Recup de la liste des menus complets si il y en a
    if (listeID.length > 0) {
        for (var i = 0; i < listeID.length; i++) {

            for (var j = 0; j < listeDeMenus.length; j++) {

                if (listeID[i] === listeDeMenus[j].id) {
                    carteEnCours.menu.push(listeDeMenus[j]);
                    break;
                }
            }
        }
    }

    response.header("content-Type", "application/json");
    response.status(200).json(carteEnCours);
    response.status(404).send("carte inconnue");
});

// Ajoute une nouvelle carte. Recoit juste le nom, cree l'ID et la liste de menu vide
application.get("/cartes/add/:nom", function (req, res) {
    
    res.setHeader('Access-Control-Allow-Origin', '*');
    
    let nomCarte = req.params.nom;
    
    var newID =  generateIdCarte();
    
    var newCard = {
        id: newID,
        nom: nomCarte,
        menu: []
    };

    listeDeCartes.push(newCard);
    res.status(200).json();
    res.status(404).send();
});

// Supprime la carte sélectionnée
application.get("/cartes/:id/remove", function (request, response) {

    response.header('Access-Control-Allow-Origin', '*');
    let idCarte = parseInt(request.params.id);
    let aCarte;
    for (var i = 0; i < listeDeCartes.length; i++) {
        aCarte = listeDeCartes[i];
        if (idCarte === listeDeCartes[i].id) {
            listeDeCartes.splice(i, 1);
            response.status(200).json(aCarte);
            response.header("content-Type", "application/json");
            break;
        }
    }
});

//*********************************************************************************************************************
//FONCTIONS

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
;

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


