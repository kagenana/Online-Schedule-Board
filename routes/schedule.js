var model = require('../models/db.js');
    User = model.User,
    Server = model.Server,
    Schedule = model.Schedule;

var TITLE = 'CV-MailForm Schedule';

exports.index = function(req, res){
  Schedule.find({
    author_id: req.session._id
  },
  function(err, schedules){
    if(err){
      console.log(err);
    };
    var session = req.session;
    res.render('schedule/schedule', { title: TITLE, session: session, schedules: schedules });
  });
};

exports.input = function(req, res){
  Schedule.findOne({
    _id: req.body._id
  },
  function(err, schedules){
    if(err){
      console.log(err);
    };
    if (schedules) {
        //edit
      var session = req.session;
      res.render('schedule/input', { title: TITLE, session: session ,schedules: schedules });
    }
    else {
        //new
      var schedules = new Schedule();
      var session = req.session;
      res.render('schedule/input', { title: TITLE, session: session ,schedules: schedules });
    };
  });
};

exports.input_post = function(req, res){
  Schedule.findOne({
    _id: req.body._id
  },
  function(err, schedules){
    if(err){
      console.log(err);
    };
    if(schedules){
        //update
      schedules.author_id = req.session._id;
      schedules.subject = req.body.subject;
      schedules.author = req.session.id;
        //schedules.timeSubmit = Date.now;
      schedules.timeRequest = req.body.timeRequest;
      schedules.timeReturn = req.body.timeReturn;
      schedules.isState = req.body,isState;
      schedules.Description = req.body.Description;
        //schedules.mailBody = "";
      schedules.save();
    }
    else {
        //new
      var schedules = new Schedule();
      schedules.author_id = req.session._id;
      schedules.subject = req.body.subject;
      schedules.author = req.session.id;
        //schedules.timeSubmit = Date.now;
      schedules.timeRequest = req.body.timeRequest;
      schedules.timeReturn = req.body.timeReturn;
      schedules.isState = "que";
      schedules.Description = req.body.Description;
        //schedules.mailBody = "";
      schedules.save();
    };
    
    res.redirect('schedule/');
  });
};

exports.archives = function(req, res){
  Schedule.find({
    author_id: req.session._id
  },
  function(err, schedules){
    if(err){
      console.log(err);
    };
    var session = req.session;
    res.render('schedule/archives', { title: TITLE, session: session, schedules: schedules });
  });
};

