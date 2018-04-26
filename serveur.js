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

application.get('/',
	function(request,response){
		response.send("le git url très fort");
	}
);

application.use(bodyparser.json());
application.use(bodyparser.urlencoded({
    extended: true
}));

//Liste de films
application.get('/films',
	function(request,response){
		response.header('Access-Control-Allow-Origin','*');//
		//Chainage reponse du serveur: status puis reponse
		response.header('Content-Type','application/json');
		response.status(200).json(listeDeFilms);
	}
);

//Recuperer un seul film
application.get('/films/:id',
    function(request,response){

            response.header('Access-Control-Allow-Origin','*');//

            let idFilm = parseInt(request.params.id);
            let film;
            var flag = false;

            for(var i = 0 ; i < listeDeFilms.length ; i++){
                    if(listeDeFilms[i].id === idFilm){
                        film = listeDeFilms[i];
                        flag = true;
                    }
            }

            //Chainage reponse du serveur: status puis reponse
            if(flag === true){
                response.header('Content-Type','application/json');
                response.status(200).json(film);
            }else{
            response.header('Content-Type','text/plain');
            response.status(404).send("Le film est inconnu");
        }
    }
);

//AJOUTER UN FILM

application.post('/films/',
    function(request,response){
        
        response.header('Access-Control-Allow-Origin','*');
        
        var film = request.body;
        
        film['id'] = generateID();
        
         listeDeFilms.push(film);

        response.header('Content-Type','application/json');   
        
        response.status(200).json(listeDeFilms);
    }
);

//Update un film

application.post('/films/up/:id', function(request,response){
         response.header('Access-Control-Allow-Origin','*');

            let idFilm = parseInt(request.params.id);
    
            var filmUp = request.body;
    
            filmUp.id = idFilm;
    
            var flag = false;

            for(var i = 0 ; i < listeDeFilms.length ; i++){
                    if(listeDeFilms[i].id === idFilm){
                       listeDeFilms.splice(i,1,filmUp);
                        flag = true;
                    }
            }

            //Chainage reponse du serveur: status puis reponse
            if(flag === true){
                response.header('Content-Type','application/json');
                response.status(200).json(listeDeFilms);
            }else{
            response.header('Content-Type','text/plain');
            response.status(404).send("Le film est inconnu");
        }
});

//Supprimer un film

application.post('/films/del/:id', function(request,response){
         response.header('Access-Control-Allow-Origin','*');

            let idFilm = parseInt(request.params.id);
            var flag = false;

            for(var i = 0 ; i < listeDeFilms.length ; i++){
                    if(listeDeFilms[i].id === idFilm){
                       listeDeFilms.splice(i,1);
                        flag = true;
                    }
            }

            //Chainage reponse du serveur: status puis reponse
            if(flag === true){
                response.header('Content-Type','application/json');
                response.status(200).json(listeDeFilms);
            }else{
            response.header('Content-Type','text/plain');
            response.status(404).send("Le film est inconnu");
        }
});
				 
function generateID(){
    var idMax = 0;
    for(var i in listeDeFilms){
        idMax = (listeDeFilms[i].id > idMax)?listeDeFilms[i].id : idMax;
    }
    
    return idMax + 1;
};	


				 
var listeDeFilms = [
	{
		id: 1,
		titre: "Abyss",
		genre: "Science-fiction",
		annee: "1998",
		realisateur: "James Cameron",
		image: "https://image.tmdb.org/t/p/w500/d1GSBJWUOuM2kDECThYfPk5ZIzr.jpg",
		acteurs: "Ed Harris, Mary Elizabeth Mastrantonio, Michael Biehn",
		synopsis: "Un commando de la Marine américaine débarque à bord de la station de forage sous-marine DeepCore, afin de porter secours à un sous-marin échoué dans les profondeurs. L'équipe de Bud Brigman accueille ces nouveaux arrivants, ainsi que Lindsey, future ex-femme de Bud. Alors que les travaux de récupération commencent autour du submersible naufragé, l'équipage de DeepCore doit faire face à des phénomènes inexpliqués. Et s'ils n'étaient pas seuls, dans les abysses ?",
		trailer: "https://www.youtube.com/embed/4zbpL3LeW7k"
	},
	{
		id: 2,
		titre: "Avengers: Infinity War",
		genre: "Action",
		annee: "2018",
		realisateur: "Joe Russo, Anthony Russo",
		image: "https://image.tmdb.org/t/p/w500/gBY1utFTs4AV6j4c4QVpEkM1Z29.jpg",
		acteurs: "Robert Downey Jr., Chris Hemsworth, Mark Ruffalo",
		synopsis: "Les Avengers et leurs alliés devront être prêts à tout sacrifier pour neutraliser le redoutable Thanos avant que son attaque éclair ne conduise à la destruction complète de l’univers.",
		trailer: "https://www.youtube.com/embed/QwievZ1Tx-8"
	},
	{
		id: 3,
		titre: "Carnivores",
		genre: "Thriller",
		annee: "2018",
		realisateur: "Jérémie Renier, Yannick Renier",
		image: "https://image.tmdb.org/t/p/w500/mTJ3EeRMGvSP0T3cCBtxLChLQeA.jpg",
		acteurs: "Leïla Bekhti, Zita Hanrot, Bastien Bouillon",
		synopsis: "Mona rêve depuis toujours d’être comédienne. Au sortir du Conservatoire, elle est promise à un avenir brillant mais c’est Sam, sa sœur cadette, qui se fait repérer et devient rapidement une actrice de renom. À l’aube de la trentaine, à court de ressources, Mona est contrainte d’emménager chez sa sœur qui, fragilisée par un tournage éprouvant, lui propose de devenir son assistante. Sam néglige peu à peu son rôle d'actrice, d'épouse, de mère et finit par perdre pied. Ces rôles que Sam délaisse, Mona comprend qu'elle doit s'en emparer.",
		trailer: "https://www.youtube.com/embed/mGRST9V1JNI"
	},
	{
		id: 4,
		titre: "Tomb Raider",
		genre: "Action",
		annee: "2018",
		realisateur: "Roar Uthaug",
		image: "https://image.tmdb.org/t/p/w500/ePyN2nX9t8SOl70eRW47Q29zUFO.jpg",
		acteurs: "Alicia Vikander, Walton Goggins, Dominic West, Daniel Wu",
		synopsis: "Rebelle et indépendante, Lara Croft, 21 ans, n'a jamais cru que son père était mort. Elle décide un jour de se rendre sur l'île mystérieuse où il a été vu pour la dernière fois. Un périple où le danger guette à chaque instant…",
		trailer: "https://www.youtube.com/embed/UmXKhK9YKZg"
	},
	{
		id: 5,
		titre: "Cube",
		genre: "Thriller",
		annee: "1997",
		realisateur: "Vincenzo Natali",
		image: "https://image.tmdb.org/t/p/w500/1mqCpSunNM0chtFa6EEPljqgb8O.jpg",
		acteurs: "Nicole de Boer, Nicky Guadagni, David Hewlett, Andrew Miller",
		synopsis: "Un groupe de personnes, sans savoir pourquoi, se retrouve enfermé dans une prison surréaliste, un labyrinthe sans fin constitué de pièces cubiques communicantes et équipées de pièges mortels. Le policier, l'architecte, l'étudiante en mathématiques, la psychologue et l'autiste captifs ne savent qu'une seule chose : chacun possède un don particulier qui, combiné aux autres, peut les aider à s'évader. Au fur et à mesure que la peur grandit, les conflits personnels et les luttes de pouvoir s'amplifient. Il leur faudrait pourtant réussir à s'associer pour échapper à une mort certaine.",
		trailer: "https://www.youtube.com/embed/YAWSkYqqkMA"
	},
	{
		id: 6,
		titre: "Alien: Covenant",
		genre: "Horreur",
		annee: "2017",
		realisateur: "Ridley Scott",
		image: "https://image.tmdb.org/t/p/w500/gJL4noFkpXHkNBX2MgzEo6PbYUy.jpg",
		acteurs: "Michael Fassbender, Katherine Waterston, Billy Crudup, Danny McBride",
		synopsis: "Les membres d’équipage du vaisseau Covenant, à destination d’une planète située au fin fond de notre galaxie, découvrent ce qu’ils pensent être un paradis encore intouché. Il s’agit en fait d’un monde sombre et dangereux, cachant une menace terrible. Ils vont tout tenter pour s’échapper.",
		trailer: "https://www.youtube.com/embed/mrhTYcz1yeQ"
	}
];