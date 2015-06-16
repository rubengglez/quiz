var models = require('../models/models.js');

// Autoload - factoriza el código si ruta incluye :quizId
exports.load = function(req, res, next, quizId){
	models.Quiz.find(quizId).then(
		function(quiz){
			if (quiz){
				req.quiz = quiz;
				next();

			} else { next(new Error('No existe quizId=' + quizId));}
		}
	).catch(function(error){next(error);});
};

exports.index = function(req, res){
	var search = req.query.search;
	if ( search === undefined ) {
		models.Quiz.findAll().then(function(quizes){
			res.render('quizes/index', {quizes: quizes, errors: []});
		});

	}else{ // GET buscador de preguntas
		models.Quiz.findAll({where: ["UPPER(pregunta) like ?", '%' + search.toUpperCase().replace(/\s+/g, '%') + '%']})
		.then(function(quizes){
			res.render('quizes/index', {quizes:quizes, errors: []});
		});
	}
};

// GET /quizes/:id
exports.show = function(req, res){
	res.render('quizes/show', {quiz: req.quiz, errors: [] });
};

// GET /quizes/:id/answer
exports.answer = function(req, res){
	models.Quiz.find(req.params.quizId).then(function(quiz){
		var resultado = 'Incorrecto';
		if ( req.query.respuesta === req.quiz.respuesta ){
			resultado = 'Correcto';
		}
		res.render('quizes/answer', {quiz: req.quiz, respuesta : resultado, errors: []});
	});
};

// GET /quizes/new
exports.new = function(req, res){
	var quiz = models.Quiz.build( // crea objeto quiz
		{pregunta: "pregunta", respuesta: "Respuesta"}
	);
	res.render('quizes/new', {quiz: quiz, errors: []});
};

// POST /quizes/create
exports.create = function(req, res){
	var quiz = models.Quiz.build( req.body.quiz );

	quiz
	.validate()
	.then(
		function(err){
			if (err) {
				res.render('quizes/new', {quiz: quiz, errors: err.errors});

			} else {
				// save: guarda en DB campos pregunta y respuesta de quiz
				quiz.save({fields: ["pregunta", "respuesta"]})
				.then( function(){ res.redirect('/quizes')});
			}   // res.redirect: Redirección HTTp (URL relativo) lista de preguntas
		}
	);
};