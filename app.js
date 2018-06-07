const createError = require('http-errors');
const http = require('http');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const ejs = require('ejs');
const bodyParser = require('body-parser');
const db = require('./db.js');
const sha256 = require('sha256');
const session = require('express-session');
const multer = require('multer');
const crypto = require('crypto');
const app = express();
const secret_key = crypto.randomBytes(48);

function intervalFunc(){

let items = [];

  db.query('select * from item where bid_state = 1', (err, results) => {
				if (err){
					console.log(err);
					// res.render('error');
				}
        	 items = results;

            items.forEach(function(item, index){

            console.log('Each item #' + index + ' :',item.item_id);

            var sendData = { item_id : item.item_id };

         // 전달하고자 하는 데이터 생성
          var opts = {
              host: '127.0.0.1',
              port: 8080,
              method: 'POST',
              path: '/agent/findWinner',
              headers: {'Content-type': 'application/json'},
              body: sendData
          };

          var resData = '';

          var req = http.request(opts, function(res) {
              res.on('end', function() {
                  console.log(resData);
              });
          });

          opts.headers['Content-Type'] = 'application/x-www-form-urlencoded';
          req.data = opts ;
          opts.headers['Content-Length'] = req.data.length;

          req.on('error', function(err) {
              console.log("에러 발생 : " + err.message);
          });

          // 요청 전송
          req.write(JSON.stringify(req.data.body));

          console.log("요청");
          req.end();
        });
  });
  console.log("Can you kill me?");
}


setInterval(intervalFunc, 10000);

app.post('/getWinner', function (req, res) {
   //const body = req.body;
   // 요청 전송
   //var obj = JSON.parse(body);
   //var title = obj.get("userName");
   var user_id = req.body.user_id;
   var item_id = req.body.item_id;

   res.set('Content-Type', 'text/plain');
   console.log(user_id);
   console.log(item_id);

   db.query('update item set bid_state=2 where item_id = ?',[item_id], (err, results1) => {
         if (err){
           console.log(err);
         }
           db.query('update cart set is_winner=1 where user_id = ?',[user_id], (err, results2) => {
                 if (err){
                   console.log(err);
                 }
                   res.set('Content-Type', 'text/plain');
                   res.send(user_id +' is winner of '+ item_id);
           });
   });


   //req.session.testtitle = title;
   //res.redirect('/test_page');

});

app.use(session({
    secret: secret_key.toString('hex'),
    resave: false,
    saveUninitialized: true
}));

// view engine setup
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.engine('html', require('ejs').renderFile);

//bodyparser
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

/*
app.use('/', indexRouter);
app.use('/users', usersRouter);*/

const router = require('./routes/router.js')(app);

//for pretty print
app.locals.pretty = true;

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});
//
// java.classpath.push("./java/src/main/java");
// var Hello = java.import("agent.Block");
// app.get('/agent/Block', function(req, res) {
//     res.send(Hello.sayHello());
// });
// java.classpath.push("./src");
// var MyClass = java.import("com.nearinfinity.nodeJava.MyClass");
//
// var result = MyClass.addNumbersSync(1, 2);
// console.log(result);



const server = app.listen(8000, function () {
  console.log('Listening on port 8000');
});
