
var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');

//initialize mongoose
mongoose.connect('mongodb://localhost/todo_development');
var Schema = mongoose.Schema;
var ObjectId = Schema.ObjectId;

var Task = new Schema({
  task: String
});

var Task = mongoose.model('Task', Task);

/* GET home page. */
router.get('/', function(req, res){
  res.render('index', { title: 'Express' })
});

/* GET tasks page. */
router.get('/tasks', function(req, res){
    Task.find({}, function (err, docs) {    
    res.render('tasks/index', {
      title: 'Todos index view',
      docs: docs
    });
  });
});


/* GET new task page. */
router.get('/tasks/new', function(req, res){
  res.render('tasks/new.jade', {
    title: 'New Task'
  });
});

// back to tasks page
router.post('/tasks',function(req, res){
  var task = new Task(req.body.task);
  task.save(function (err) {
    if (!err) {
        
      
      console.log(req.flash('info', 'Task created'));
      res.redirect('/tasks');
      
    }
    else {
      
      res.redirect('/tasks/new');
    }
  });
});


router.get('/tasks/:id/edit', function(req, res){
  Task.findById(req.params.id, function (err, doc){
    res.render('tasks/edit', {
      title: 'Edit Task View',
      task: doc
    });
  });
});

//update tasks 
router.route('/tasks/:id').put(function(req, res){
    console.log("enter into put");
  Task.findById(req.params.id, function (err, doc){
      console.log("enter into put");
    doc.updated_at = new Date();
    doc.task = req.body.task.task;
    doc.save(function(err) {
      if (!err){
        res.redirect('/tasks');
      }
      else {
        console.err(err);
      }
    });
  });
});

//delete tasks
router.delete('/tasks/:id', function(req, res){
  Task.findOne({ _id: req.params.id }, function(err, doc) {
    doc.remove(function() {
      res.redirect('/tasks');
    });
  });
});

module.exports = router;
