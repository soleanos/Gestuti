var crypto = require('crypto');
var mongoose = require('mongoose');
var User = mongoose.model('User');
var util = require('util');
function Utils(){}

/* renvoie un mot de passe haché en sha256 à partir d'un mot de passe */
Utils.prototype.hashPW = function(pwd) {
	return crypto.createHash('sha256').update(pwd).digest('base64').toString();
}

/* Système d'écriture des messages "système" */
Utils.prototype.new_message = function(req,message){
  if ((req)&&(req.session)){
      if (!req.session.msgs){
          req.session.msgs = [];          
      }
      console.log('message <-',message);
      req.session.msgs.push(message);
  }
}

/* Système de lecture des messages à l'utilisateur */
Utils.prototype.read_messages= function(req){
    if ((req)&&(req.session)&&(req.session.msgs)){
        var temp = util._extend({},req.session.msgs);
        req.session.msgs.length = 0;
        console.log('message ->',temp);
        return temp;
    } else return [];
}

/* Vérifie que l'utilisateur est connecté, sinon, le redirige sur la page d'accueil */
Utils.prototype.HasToBeConnected= function(req,res,next){
    if(!req.user) {
        res.redirect('/'); 
        this.new_message(req,{type:'warning',msg:'No user logged in'});
        return;
    }
    next();
}

Utils.prototype.check = function(req,res,next){
	if (!req.query.username){
		res.status(401);
		res.send('Unauthorized');
		return;
	}  
	next();
};

/**
* Retourne une erreur 401 si l'utilisateur EST connecté, laisse passer la requête sinon.
* @param {Object} req
* @param {Object} res
* @param {Object} next
* @return {null}
*/
Utils.prototype.hasToBeDisconnected = function(req, res, next){
   if(Utils.prototype.connected(req)){
       res.status(401);
       res.send("Vous êtes déjà connecté");
       return;
   }
   next();
};

/**
* Retourne une erreur 401 si l'utilisateur N'EST PAS connecté, laisse passer la requête sinon.
* @param {Object} req
* @param {Object} res
* @param {Object} next
* @return {null}
*/
Utils.prototype.hasToBeConnected = function(req, res, next){
   if(!Utils.connected(req)){
       res.status(401);
       res.send("Vous n'êtes pas connecté");
       return;
   }
   next();
};

/**
* Retourne une erreur 401 si l'utilisateur N'est pas administrateur, laisse passer la requête sinon.
* @param {Object} req
* @param {Object} res
* @param {Object} next
* @return {null}
*/
Utils.prototype.isAdmin = function(req, res, next){
   if(req.user && req.user.attributions) {
       for (var i = 0; i < req.user.attributions.length; i++) {
           if (req.user.attributions[i].name == "ROLE_ADMIN" && Utils.isActive(req.user.attributions[i])) {
               next();
               return;
           }
       }
   }
   res.status(401);
   res.send("Vous n'avez pas les droits nécessaires");
};
 
/* Retourne l'objet échappé de ses caractères qui pourraient induire une faille XSS et/ou une injection MongoDB
* @param v
?* @returns {*?}
*/
Utils.prototype.sanitize = function(v, options) {
   options = options || [];

   if (v instanceof Object) {
       for (var key in v) {
           if (/^\$/.test(key)) {
               delete v[key];
           }
           else if(typeof v[key] === "string" && options.indexOf(key) < 0){
               v[key] = entities.encode(v[key]);
           }
           else {
               Utils.prototype.sanitize(v[key]);
           }
       }
   }
   else if(typeof v == "string"){
       return entities.encode(v);
   }
   return v;
};

module.exports = Utils;