var models = require('../models/models');

exports.load = function(req, res, next, quizId) {
  models.Quiz.find(quizId).then(function(quiz) {
      if (quiz) {
        req.quiz = quiz;
        next();
      } else{next(new Error('No existe quizId=' + quizId));}
    }
  ).catch(function(error){next(error)});
};

exports.new = function (req,res) {
  var quiz = models.Quiz.build(
    {pregunta:'Pregunta',respuesta:'Respuesta'}
  );
  res.render('quizes/new',{quiz:quiz,errors:[]});
};
exports.create = function(req, res) {
	var quiz = models.Quiz.build(req.body.quiz);

	var errors = quiz.validate();

	if (errors) {
		var i=0; var errores = new Array();//se convierte en [] con la propiedad message por compatibilidad con layout
		for (var prop in errors) {
			errores[i++] = { message: errors[prop] };
		}
		res.render('quizes/new', {quiz: quiz, errors: errores});
	} else {
		quiz.save({fields: ["pregunta", "respuesta","tema"]}).then( function() {
			res.redirect('/quizes');
		});
	}
};

exports.edit = function(req, res) {
	var quiz = req.quiz;
	res.render('quizes/edit', {quiz: quiz, errors: []});
};

exports.update = function(req, res) {
	req.quiz.pregunta = req.body.quiz.pregunta;
	req.quiz.respuesta = req.body.quiz.respuesta;
	req.quiz.tema = req.body.quiz.respuesta;

	var errors = req.quiz.validate();

	if (errors) {
		var i=0; var errores = new Array();//se convierte en [] con la propiedad message por compatibilidad con layout
		for (var prop in errors) {
			errores[i++] = { message: errors[prop] };
		}
		res.render('quizes/edit', {quiz: req.quiz, errors: errores});
	} else {
		req.quiz.save({fields: ["pregunta", "respuesta", "tema"]}).then( function() {
			res.redirect('/quizes');
		});
	}
};

exports.index = function(req, res) {
  if (req.query.search) {
        var busqueda = "%"+req.query.search+"%";
        models.Quiz.findAll({where: ["pregunta like ?",busqueda]}).then(function (e) {
            res.render('quizes/busqueda',{resultado:e,errors:[]});
        });
  }else {
      models.Quiz.findAll().then(
      function(quizes) {
        res.render('quizes/index.ejs', {quizes: quizes,errors:[] });
      })
  }
};
exports.destroy = function(req, res) {
	req.quiz.destroy().then( function() {
		res.redirect('/quizes');
	}).catch(function(error){ next(error)});
};
// GET /quizes/:id
exports.show = function(req, res) {
  models.Quiz.find(req.params.quizId).then(function (quiz) {
      res.render('quizes/show', { quiz: req.quiz,errors:[]});
  })
};

exports.answer = function(req, res) {
  models.Quiz.find(req.params.quizId).then(function (quiz) {

    if (req.query.respuesta === req.quiz.respuesta) {
      res.render('quizes/answer',{
         quiz: req.quiz, respuesta: 'Correcto',errors:[]})
      }else {
        res.render('quizes/answer',{
          quiz: req.quiz, respuesta:'Incorrecto',errors:[]
        });
      }
    })
  };
