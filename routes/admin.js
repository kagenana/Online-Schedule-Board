var model = require('../models/db.js');
    User = model.User,
    Server = model.Server,
    Schedule = model.Schedule;

var TITLE = '株式会社コンバージョン　スケジュールボード　管理メニュー';

exports.index = function(req, res){
  res.render('admin/admin', { title: TITLE, session: session });
};

exports.account = function(req, res){
  User.find({}, function(err, users){
    if(err){
      console.log(err);
    };
    var session = req.session;
    res.render('admin/account', { title: TITLE, session: session, users: users });
  });
};

exports.account_edit = function(req, res){
  if (req.body._id == 'new') {
    var users = new User();
    var mode = "new";
    var duplicate = "";
    var session = req.session;
    res.render('admin/account_edit', { title: TITLE, session: session, users: users, mode: mode, duplicate: duplicate });
  }
  else {
    User.findOne({
      _id: req.body._id,
    },
    function(err, users){
      if(err){
        console.log(err);
      };
      var mode = "edit";
      var duplicate = "";
      var session = req.session;
      res.render('admin/account_edit', { title: TITLE, session: session, users: users, mode: mode, duplicate: duplicate });
    });
  }
};

exports.account_conf = function(req, res){
  User.findOne({
    _id: req.body._id,
  },
  function(err, users){
    if(err){
      console.log(err);
    };
    
    if (users) {
        //update
      var beforeAdmin = users.isAdmin;
      var beforeEnable = users.isEnable;
      users.id = users.id;
      users.mail = req.body.mail;
      users.name = req.body.name;
      users.name_short = req.body.name_short;
      users.password = req.body.password;
      users.isAdmin = req.body.isAdmin;
        if(!req.body.isAdmin){
          users.isAdmin = false
        };
      users.isEnable = req.body.isEnable;
        if(!req.body.isEnable){
          users.isEnable = false
        };
      users.isState = req.body.isState;
      users.Description = req.body.Description;
      users.save();
        //require relogin
      if (req.session._id == users._id) {
        if (beforeAdmin) {
          if (users.isAdmin) {
          }
          else {
            req.session.isAdmin = users.isAdmin;
          };
        };
      };
      
        //require logout
        //if (req.session._id == users._id) {
        //  if (beforeEnable) {
        //    if (users.isEneble) {
        //    }
        //    else {
        //      req.session.isEnable = users.isEnable;
        //      req.session.messages = ["このアカウントは無効にされています。"];
        //      res.redirect('/login');
        //    };
        //  };
        //};

      if (req.session.isAdmin) {
        res.redirect('admin/account');
      }
      else {
        res.redirect('/');
      };
    }
    else {
        //new
      var users = new User();
      users.id = req.body.id;
      users.mail = req.body.mail;
      users.name = req.body.name;
      users.name_short = req.body.name_short;
      users.password = req.body.password;
      users.isAdmin = req.body.isAdmin;
        if(!req.body.isAdmin){
          users.isAdmin = false
        };
      users.isEnable = req.body.isEnable;
        if(!req.body.isEnable){
          users.isEnable = false
        };
      users.isState = req.body.isState;
      users.Description = req.body.Description;
        //new id check
      User.findOne({
        id: req.body.id,
      },
      function(err,obj){
        if(err){
          console.log(err);
        };
        if(obj){
          var mode = "new";
          var duplicate = "同じユーザ名が既に使用されています。";
          var session = req.session;
          res.render('admin/account_edit', { title: TITLE, session: session, users: users, mode: mode, duplicate: duplicate });
        }
        else {
          users.save();
          if (users.isEnable == true){
            var schedules = new Schedule();
            schedules.author_id = users._id;
            schedules.subject = "exist";
            schedules.author = users.name;
            schedules.timeSubmit = Date.now();
            schedules.timeRequest = Date.now();
            schedules.timeReturn = null;
            schedules.isState = "archive";
            schedules.Description = "新規作成自動入力";
            schedules.mailBody = "";
            schedules.save();
          };
          res.redirect('admin/account');
        };
      });
    };
  });
};

exports.account_delete = function(req, res){
  User.findOne({
    _id: req.body._id,
  },
  function(err, users){
    if(err){
      console.log(err);
    };
    users.remove();
    res.redirect('admin/account');
  });
};

exports.server = function(req, res){
  Server.find({}, function(err, servers){
    if(err){
      console.log(err);
    };
    var session = req.session;
    res.render('admin/server', { title: TITLE, session: session ,servers: servers });
  });
};

exports.server_conf = function(req, res){
  Server.find({}, function(err, obj){
    if(err){
      console.log(err);
    };
    obj[0].domain = req.body.domain;
    obj[0].smtp_server = req.body.smtp_server;
    obj[0].smtp_port = req.body.smtp_port;
    obj[0].smtp_user = req.body.smtp_user;
    obj[0].smtp_pass = req.body.smtp_pass;
    obj[0].mail_from = req.body.mail_from;
    obj[0].mail_to = req.body.mail_to;
    obj[0].mail_bcc_user = req.body.mail_bcc_user;
      if(!req.body.mail_bcc_user){
        obj[0].mail_bcc_user = false
      };
    obj[0].mail_reply_to_user = req.body.mail_reply_to_user;
      if(!req.body.mail_reply_to_user){
        obj[0].mail_reply_to_user = false
      };
    obj[0].send_to_min_before = req.body.send_to_min_before;
    obj[0].archive_of_day = req.body.archive_of_day;
    obj[0].left_subject = req.body.left_subject;
    obj[0].left_template = req.body.left_template;
    obj[0].goout_subject = req.body.goout_subject;
    obj[0].goout_template = req.body.goout_template;
    obj[0].custom_subject = req.body.custom_subject;
    obj[0].custom_template = req.body.custom_template;
    obj[0].exist_subject = req.body.exist_subject;
    obj[0].exist_template = req.body.exist_template;
    obj[0].absence_subject = req.body.absence_subject;
    obj[0].absence_template = req.body.absence_template;

    obj[0].save();
    req.session.messages = ["サーバの設定を変更しました。"];
    res.redirect('admin/server');
    
  });
};

exports.archives = function(req, res){
  Schedule.find({
  },
  {},
  { sort: [['timeSubmit', -1]], limit: 500 },
  function(err, schedules){
    if(err){
      console.log(err);
    };
    var session = req.session;
    res.render('admin/archives', { title: TITLE, session: session, schedules: schedules });
  });
};

