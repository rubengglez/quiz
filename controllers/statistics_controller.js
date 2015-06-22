// Importamos modelos
var models = require('../models/models.js');

// GET /quizes/statistics
exports.show = function(req, res){
	var obj_datos = {};

	// Obtenemos num_preguntas
	models.Quiz.findAndCountAll()
		.then(function(result){
			obj_datos.num_preguntas = result.count;

			// Obtenemos num comentarios totales
			models.Comment.findAndCountAll()
				.then(function(result){
					obj_datos.num_comentarios_totales = result.count;

					models.Comment.findAndCountAll({ where: {publicado : 1}})
						.then(function(result){
							obj_datos.num_comentarios_aprobados = result.count;

							// Calculamos número medio de comentarios por pregunta
							obj_datos.num_coment_medios = obj_datos.num_comentarios_totales / obj_datos.num_preguntas;

							// Número de preguntas con comentarios
							models.Comment.findAll({group: 'QuizId'})
								.then(function(result){
									
									obj_datos.num_con_comentarios = result.length;

									// Número de preguntas sin comentarios
									obj_datos.num_sin_comentarios = obj_datos.num_preguntas - obj_datos.num_con_comentarios;

									obj_datos.errors = [];

									res.render('statistics/show', obj_datos);

								});

						});
				});

		});
	
}