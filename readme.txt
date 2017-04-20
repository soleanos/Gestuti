 ** DEMARRAGE **
1> télécharger node & mongo
2> lancer mongod en console, laisser tourner; lancer mongo en console, créer une base > use test
3> créer un dossier vide, s'y positionner avec une autre console :
4> npm install -g --save express express-generator
5> express -e
6> npm install --save express-session mongoose connect-mongo
7> npm install
8> npm start
9> vérifier sur nav: localhost:3000/ -> "Welcome to Express"

 ** GESTION UTILISATEURS **
10> créer le dossier models, contenant le fichier users_model.js :

var mongoose = require('mongoose');
var UserSchema = new Schema({
    	username: {type: String, unique: true},
	email: {type: String, unique: true}
	hashed_password: String,
    	date: Date
});
mongoose.model('User',UserSchema);

11> créer les routes (users.js / index.js) : signup, login, logout
12> modifier le fichier app.js à la racine pour y intégrer les besoins de notre gestion d'utilisateurs
13> ajouter utils.js à la racine
