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

//Retourne un status "admin" si l’utilisateur est administrateur et "user" sinon

application.get('/use/:login',
    function (request, response) {

        //Recup login
        var loginUser = request.params.login;

        response.header('Access-Control-Allow-Origin', '*');

        var flag = false;

        for(var i = 0 ; i < user.length ; i++){

            if (user[i].username === loginUser) {
                flag = true;
                break;
            }
        }

        if (flag) {
            response.status(200).send("admin");
        } else {
            response.status(200).send("user");
        }
    }
);

//Vérifie que les informations reçues correspondent à l’utilisateur
application.post('/verify',
    function (request, response) {

        response.header('Access-Control-Allow-Origin', '*');

        //Recupere les infos à tester
        var userTest = request.body;

        //Check dans la liste de Users

        var flag = false;

        for(var i = 0 ; i < user.length ; i++){

            if ((userTest.username === user[i].username) && (userTest.password === user[i].password)) {
                flag = true;
                break;
            }
        }

        if (flag) {
            response.status(200).send(true);
        } else {
            response.status(200).send(false);
        }
    }
);

var user = [
    {
    username: "administrateur",
    password: "1234",
    connected: false
    }
];

//*********************************************************************************************************************
//RECUPERATION DATAS

// Retourne toutes les cartes
application.get("/cartes/get", function (request, response) {

    response.header('Access-Control-Allow-Origin', '*');
    response.setHeader("content-Type", "application/json");
    response.status(200).json(listeDeCartes);
});

// Retourne la liste des ID de toutes les cartes ayant le statut online
application.get("/cartes/getonline", function (request, response) {

    response.header('Access-Control-Allow-Origin', '*');

    var listeOnline = [];

    for (var i = 0; i < listeDeCartes.length; i++) {
        if (listeDeCartes[i].online === "true") {
            listeOnline.push(listeDeCartes[i].id)
        }
    }
    response.status(200).send(listeOnline);
});

// Retourne une carte par son id, les menus sont renvoyes avec tous les plats au format json
application.get("/cartes/:id/get", function (request, response) {

    response.header('Access-Control-Allow-Origin', '*');
    //Recup ID
    let idCarte = parseInt(request.params.id);

    //Creation d'une carte à retourner
    var carteEnCours = {
        id: idCarte,
        nom: "",
        online: "",
        menu: []
    };

    //Recup du nom et de la liste d'ID des menus
    var listeID;

    for (var i = 0; i < listeDeCartes.length; i++) {
        if (idCarte === listeDeCartes[i].id) {
            carteEnCours.nom = listeDeCartes[i].nom;
            carteEnCours.online = listeDeCartes[i].online;
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

// Ajoute une nouvelle carte. Recoit juste le nom, cree l'ID et la liste de menu vide et retourne l'ID créé
application.get("/cartes/add/:nom", function (req, res) {
    
    res.setHeader('Access-Control-Allow-Origin', '*');
    
    let nomCarte = req.params.nom;
    
    var newID =  generateIdCarte();
    
    var newCard = {
        id: newID,
        nom: nomCarte,
        online: "false",
        menu: []
    };

    listeDeCartes.push(newCard);
    res.header("content-Type", "application/json");
    res.status(200).send(newCard);
    
});

// Supprime la carte sélectionnée
application.get("/cartes/:id/remove", function (request, response) {

    response.header('Access-Control-Allow-Origin', '*');
    let idCarte = parseInt(request.params.id);

    for (var i = 0; i < listeDeCartes.length; i++) {

        if (idCarte === listeDeCartes[i].id) {
            listeDeCartes.splice(i, 1);
            response.status(200).send();
            break;
        }
    }
});

// Modifie le statut Online de la carte sélectionnée
application.get("/cartes/:id/online", function (request, response) {

    response.header('Access-Control-Allow-Origin', '*');
    let idCarte = parseInt(request.params.id);

    for (var i = 0; i < listeDeCartes.length; i++) {

        if (idCarte === listeDeCartes[i].id) {
            if(listeDeCartes[i].online === "true"){
                listeDeCartes[i].online = "false";
            }else{
                listeDeCartes[i].online = "true";
            }
            response.status(200).send(listeDeCartes[i].online);
            break;
        }
    }
});

// Retourne tous les menus de toutes les cartes
application.get("/menus/get", function (request, response) {
    response.setHeader('Access-Control-Allow-Origin', '*');
    response.setHeader("content-Type", "application/json");
    response.status(200).json(listeDeMenus);
});

//Verifie si un menu est present dans une carte
application.get("/cartes/:id/check/:idmenu", function (request, response) {

    response.header('Access-Control-Allow-Origin', '*');
    let idCarte = parseInt(request.params.id);
    let idMenu = parseInt(request.params.idmenu);

    var reponse = false;

    for (var i = 0; i < listeDeCartes.length; i++) {

        if (idCarte === listeDeCartes[i].id) {
            
            for(var j = 0 ; j < listeDeCartes[i].menu.length ; j++){

                if(idMenu === listeDeCartes[i].menu[j]){
                    reponse = true;
                    break;
                }
            }
        }
    }
    response.status(200).send(reponse);
});


//Ajoute un menu à une carte
application.get("/cartes/:id/add/:idmenu", function (request, response) {

    response.header('Access-Control-Allow-Origin', '*');
    let idCarte = parseInt(request.params.id);
    let idMenu = parseInt(request.params.idmenu);

    for (var i = 0; i < listeDeCartes.length; i++) {

        if (idCarte === listeDeCartes[i].id) {
            listeDeCartes[i].menu.push(idMenu);
            response.status(200).send();
            break;
        }
    }
});

//Retire un menu de la carte

application.get("/cartes/:id/remove/:idmenu", function (request, response) {

    response.header('Access-Control-Allow-Origin', '*');
    let idCarte = parseInt(request.params.id);
    let idMenu = parseInt(request.params.idmenu);

    for (var i = 0; i < listeDeCartes.length; i++) {

        if (idCarte === listeDeCartes[i].id) {

            for(var j = 0 ; j < listeDeCartes[i].menu.length ; j++){
                if(idMenu === listeDeCartes[i].menu[j]){
                    listeDeCartes[i].menu.splice(j,1);
                    break;
                }
            }
            response.status(200).send();
            break;
        }
    }
});

//Retourne un menu
application.get("/menus/:id/get", function (request, response) {

    let idMenu = parseInt(request.params.id);

    var menuSelect;

    for (var i = 0; i < listeDeMenus.length; i++) {

        if (idMenu === listeDeMenus[i].id) {
            menuSelect = listeDeMenus[i];
        }
    }

    response.setHeader('Access-Control-Allow-Origin', '*');
    response.setHeader("content-Type", "application/json");
    response.status(200).json(menuSelect);
});

// Supprime le menu sélectionné
application.get("/menus/:id/remove", function (request, response) {

    response.header('Access-Control-Allow-Origin', '*');
    
    let idMenu = parseInt(request.params.id);

    //Verif si menu appartient à une carte, si oui, il est retiré de la carte
    for (var i = 0; i < listeDeCartes.length; i++) { //Boucle sur les cartes
        for (var j = 0; j < listeDeCartes[i].menu.length; j++) {    //Boucle sur les menus de cette carte
            if (idMenu === listeDeCartes[i].menu[j]) {
                listeDeCartes[i].menu.splice(j,1);
            }
        }
    }

    //Suppression du menu de la liste des menus
    for (var i = 0; i < listeDeMenus.length; i++) {
        if (idMenu === listeDeMenus[i].id) {
            listeDeMenus.splice(i, 1);
            response.status(200).send();
            break;
        }
    }
});

//Ajoute un nouveau menu: Recoit le menu en json, determeine le nouvel ID et l'integre à listeDeMenus
//OU modifie un menu si existant
application.post("/menus/add/", function (req, res) {
    
    res.setHeader('Access-Control-Allow-Origin', '*');

    var flag = false;

    //Recupere les infos à tester
    var newMenu = req.body;

    var idMenuSelected = parseInt(newMenu.id);

    if(idMenuSelected === 0){ //New menu
        //Deteremine l'ID
        newMenu.id = generateIdMenu();

        //Ajoute le menu
        listeDeMenus.push(newMenu);

        flag = true;
    
    }else{  //Modif d'un menu existant
        //remplacement du menu par sa nouvelle version
        for (var i = 0; i < listeDeMenus.length; i++) {
            if (idMenuSelected === listeDeMenus[i].id) {
                newMenu.id = idMenuSelected;
                listeDeMenus.splice(i, 1,newMenu);
                flag = true;
                break;
            }
        }
    }
    if(flag){
        res.status(200).send();
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
};

// génération de l'id d'un Menu
function generateIdMenu() {
    var idMax = 0;
    for (var i in listeDeMenus) {
        if (listeDeMenus[i].id > idMax) {
            idMax = listeDeMenus[i].id;
        }
    }
    return idMax + 1;
};

//*********************************************************************************************************************
//DATAS

var listeDeMenus = [
    {
        id: 1,
        nom: "menu enfant",
        entree: {
            nom: "Salade",
            prix: 2.50
        },
        plat: {
            nom: "Steak frites",
            prix: 7.00
        },
        dessert: {
            nom: "Crême brulée",
            prix: 2.40
        }
    },
    {
        id: 2,
        nom: "menu végétarien",
        entree: {
            nom: "Soupe",
            prix: 2.00
        },
        plat: {
            nom: "Gratin de pates",
            prix: 3.90
        },
        dessert: {
            nom: "Crème au chocolat",
            prix: 2.00
        }
    },
    {
        id: 3,
        nom: "menu dégustation",
        entree: {
            nom: "Vérrine",
            prix: 1.90
        },
        plat: {
            nom: "Steak haricots",
            prix: 4.90
        },
        dessert: {
            nom: "Café gourmand",
            prix: 3.90
        }
    },
    {
        id: 4,
        nom: "menu découverte",
        entree: {
            nom: "Friand",
            prix: 1.90
        },
        plat: {
            nom: "Bavette",
            prix: 4.90
        },
        dessert: {
            nom: "glace",
            prix: 3.90
        }
    }

];

var listeDeCartes = [
    {
        id: 1,
        nom: "carte 1",
        online: "true",
        menu: [1, 2]
    },
    {
        id: 2,
        nom: "carte 2",
        online: "false",
        menu: [3, 2]
    },
    {
        id: 3,
        nom: "carte 3",
        online: "true",
        menu: [1,4]
    }

];


