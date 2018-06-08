module.exports = function(app){

   const http = require('http');
   const db = require('../db');
   const sha256 = require('sha256');
   const url = require('url');
   const nodemailer = require("nodemailer");
   const mailconfig = require('../config/mail-config.json');
   const multer = require('multer');
   const _storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'public/images/')
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  }
   })
const upload = multer({ storage: _storage })
//const java = require('java');
var fs = require('fs');

   var smtpTransport = nodemailer.createTransport({
    service: 'Gmail',
    auth: mailconfig
   });
   const rand = randomString();
   var mailOptions;

   function randomString() {
      var chars = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXTZabcdefghiklmnopqrstuvwxyz";
      var string_length = 5;
      var randomstr = '';
      for (var i=0; i<string_length; i++) {
      var rnum = Math.floor(Math.random() * chars.length);
      randomstr += chars.substring(rnum,rnum+1);
      }
      return randomstr;
   }

   /*java.classpath.push("./java/src/main/java");
   var Block = java.import("agent.Block");
   app.get('/agent/Block', function(req, res) {
       res.send(Block.sayHelloSync());
   });*/


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



//메인 홈 코드
   app.get('/', function (req, res) {

      const sess = req.session;
      let categorys = [];
      let item = [];
      let itemimage = [];

      const today = new Date()
      today.setMinutes(today.getMinutes() + 30); //After 30 minutes
      year = today.getFullYear();
     month = today.getMonth() + 1;
     day = today.getDate();
     min = today.getMinutes();
      hour = today.getHours();
     console.log( year + '-' + month + '-' + day + '-' + hour + '-' + min );
      //   console.log(final_time);

      db.query('SELECT cat_id, cat_name FROM category', (err, results) => {
               if (err){
                  console.log(err);
                  res.render('error');
               }
      categorys = results;
      //판매할 물품
      db.query('SELECT * FROM item ORDER BY item_id DESC LIMIT 8', (err, result_item) => {
            if (err){ console.log(err);}
            item = result_item;
      //이미지
      db.query('SELECT * FROM image',(err, result_image) => {
         if (err){ console.log(err);}
         itemimage = result_image;

            res.render('main_index', {
                  'categorys' : categorys,
                  'items' : item,
                  'itemimage':itemimage,
                  session : sess
               });
         });
      });
   });
});

//상품 카트
app.get('/cart', function (req, res) {
   const sess = req.session;
          if(!sess.user_info) {
               res.redirect('/');
          }
   const user_id = req.query.user_id;
   let categorys = [];
   let biddatas = [];
   let items = [];
   db.query('SELECT * FROM category', (err, results) => {
            if (err){
               console.log(err);
               res.render('error');
            }
   db.query('SELECT * FROM cart WHERE user_id = ? ORDER BY bidding_price DESC',[user_id], (err, result) => {
         if (err){ console.log(err);}
         biddatas = result;
         //console.log("입찰정보" + biddatas);
         db.query('SELECT * FROM item WHERE item_id IN (SELECT item_id FROM cart WHERE user_id = ?)',[user_id],(err, result_item) => {
               if (err){ console.log(err);}
                     console.log(result_item);
                     items = result_item;
                     //console.log("물품 정보" +items);

                     res.render('cart', {
                           'categorys' : categorys,
                           'items' : items,
                           'biddatas' : biddatas,
                           session : sess
                        });
            });
      });
});
});


   app.get('/error;', function (req, res) {
      res.render('error');
   });

   //로그아웃 코드
         app.get('/logout', (req, res) => {

           req.session.destroy(function (err) {
               if (err) throw err;
               res.redirect('/');
           });
       });



//카테고리별 상품보는 창
   app.get('/shop', function (req, res) {
      let cat_id = req.query.cat_id;
      const sess = req.session;
      let categorys = [];
      let items = [];
      let current_cat = [];
      let itemimages = []
      db.query('SELECT * FROM category', (err, results) => {
               if (err){
                  console.log(err);
                  res.render('error');
               }
      categorys = results;
      db.query('SELECT * FROM category WHERE cat_id = ?', [cat_id], (err, result) => {
               if (err){
                  console.log(err);
                  res.render('error');
               }
               current_cat = result;
            });
      db.query('SELECT * FROM item WHERE cat_id = ? ORDER BY item_id DESC LIMIT 10',[cat_id], (err, result_item) => {
            if (err){ console.log(err);}
            items = result_item;
      res.render('shop', {
            'categorys' : categorys,
            'items' : items,
            session : sess,
            'currentcategory':current_cat[0]
               });
      });
   });
});

app.get('/sendtospring', function (req, res) {
   var inputData = { data1 : 'node to tomcat data다', data2 : 'node to tomcat testdata2'};
    // 전달하고자 하는 데이터 생성
   var opts = {
       host: '127.0.0.1',
       port: 8080,
       method: 'POST',
       path: '/agent/do',
       headers: {'Content-type': 'application/json'},
       body: inputData
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

   app.get('/fromspring', function (req, res) {
      res.send("Success Data!");
   });


   // 요청 전송
   req.write(JSON.stringify(req.data.body));

   req.end();

   res.redirect('/');
});

//여기서 java에서 보낸걸 받으려고 노력중....
app.post('/kkk', function (req, res) {
   //const body = req.body;
   // 요청 전송
   //var obj = JSON.parse(body);
   //var title = obj.get("userName");
   var title = req.body.userid;
  res.set('Content-Type', 'text/plain');
  res.send(title + 'tt');
   req.session.testid = title;
   console.log(title);
   console.log(req.session.testid);
   //req.session.testtitle = title;
   //res.redirect('/test_page');

});

// app.post('/springdata', function(req,res){
//
//    //var inputData = { data1 : 'node to tomcat data다', data2 : 'node to tomcat testdata2'};
//     // 전달하고자 하는 데이터 생성
//    var opts = {
//          host: '127.0.0.1',
//          port: 8080,
//          method: 'POST',
//          path: '/agent/do',
//          headers: {'Content-type': 'application/json'},
//          body: inputData
//    };
//    var resData = '';
//    var req = http.request(opts, function(res) {
//          res.on('end', function() {
//                console.log(resData);
//          });
//    });
//    opts.headers['Content-Type'] = 'application/x-www-form-urlencoded';
//    req.data = opts ;
//    opts.headers['Content-Length'] = req.data.length;
//
//    req.on('error', function(err) {
//          console.log("에러 발생 : " + err.message);
//    });
//
//    // 요청 전송
//    req.write(JSON.stringify(req.data.body));
//
//    req.end();
//
// });

//받은거 보여주려고...시도..
app.get('/test_page', function (req, res) {
   const sess = req.session;
   const body = req.body;
   res.set('Content-Type', 'text/plain');
   var t = sess.testid;
  res.send('I got : '+t);

});


app.get('/data', function (req, res) {
   var inputData = {user_id : '1'};
   //var inputData = { data1 : 'node to tomcat data다', data2 : 'node to tomcat testdata2'};
    // 전달하고자 하는 데이터 생성
   var opts = {
       host: '127.0.0.1',
       port: 8080,
       method: 'POST',
       path: '/agent/data',
       headers: {'Content-type': 'application/json'},
       body: inputData
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

   req.end();


});


//이걸로 doA Mapping해서
app.get('/getspring', function (req, res) {
   //var inputData = { data1 : 'tomcat to node data다', data2 : 'node to tomcat testdata2'};
   //var inputData = {user_id : req.session.user_id}
   var inputData = {user_id : '1'};
    // 전달하고자 하는 데이터 생성
   var opts = {
         host: '127.0.0.1',
         port: 8080,
         method: 'POST',
         path: '/agent/do',
         headers: {'Content-type': 'application/json'},
         body: inputData
   };
   var resData = '';
   var req = http.request(opts, function(res) {
         res.on('end', function() {
               console.log(resData);
         });
   });
   //opts.headers['Content-Type'] = 'application/x-www-form-urlencoded';
//   req.data = opts ;
   //opts.headers['Content-Length'] = req.data.length;

   req.on('error', function(err) {
         console.log("에러 발생 : " + err.message);
   });

   // 요청 전송
//   req.write(JSON.stringify(req.data.body));

   req.end();
   //res.redirect('/test_page');
});

   app.get('/signin', function (req, res) {
      res.render('signin');
   });

   app.get('/registration', function (req, res) {
      //res.render('registration');
      res.render('registration', {
         pass:false
         });
   });

//물품등록 get화면 후에 post는 do_product_register에서 실행
app.get('/product_register', function (req, res) {
      const sess = req.session;
             if (!sess.user_info) {
                   res.redirect('/');
             }

      let categorys = [];
      db.query('SELECT cat_id, cat_name FROM category', (err, results) => {
               if (err){
                  console.log(err);
                  res.render('error');
               }
      categorys = results;
      res.render('product_register', {
            'categorys' : categorys,
            session : sess
      });
   });
});

//이용약관
   app.get('/user_rule', function (req, res) {
      const sess = req.session;
             if (!sess.user_info) {
                   res.redirect('/');
             }
      let categorys = [];
      db.query('SELECT cat_id, cat_name FROM category', (err, results) => {
               if (err){
                  console.log(err);
                  res.render('error');
               }
      categorys = results;
      res.render('user_rule', {
            'categorys' : categorys,
            session : sess
      });
   });
   });

//mypage
   app.get('/mypage', function (req, res) {
      const sess = req.session;
             if (!sess.user_info) {
                   res.redirect('/');
             }
      let categorys = [];
      let user_sell_items = [];
      //카테고리
      db.query('SELECT cat_id, cat_name FROM category', (err, results) => {
               if (err){
                  console.log(err);
                  res.render('error');
               }
      categorys = results;
      console.log('Item is ',categorys);
      //로그인한 유저가 등록한 물품
      db.query('SELECT * FROM item WHERE user_id = ?', [sess.user_info.user_id], (err, result_items) => {
            if (err) throw err;
            user_sell_items = result_items;
            res.render('mypage', {
                  'categorys' : categorys,
                  'user_sell_items' : user_sell_items,
                  session : sess
            });
      });
   });
});

//상품 보기
   app.get('/item', function (req, res) {
      let item_id = req.query.item_id;
      const sess = req.session;
      let categorys = [];
      let item = [];
      let itemimage = [];
      let selected_image = [];
      let biddata=[];
      var done = false;
      var item_user_id;
      db.query('SELECT * FROM category', (err, results) => {
               if (err){
                  console.log(err);
                  res.render('error');
               }
      categorys = results;
      //판매할 물품
      db.query('SELECT * FROM item WHERE item_id = ?', [item_id],(err, result_item) => {
            if (err){ console.log(err);}
            item = result_item;
      //이미지
      db.query('SELECT * FROM image WHERE item_id = ?', [item[0].item_id],(err, result_image) => {
         if (err){ console.log(err);}
         if(result_image.length != 0)
         {
            itemimage = result_image;
            selected_image = itemimage[0].img_name;
         }

      //카테고리이름
      db.query('SELECT cat_name FROM category WHERE cat_id = ?', [item[0].cat_id], (err, result_category) => {
            if (err){ console.log(err);}
            const itemcategory = result_category;
            //console.log('Category is ', itemcategory);

      //입찰정보
      db.query('SELECT * FROM cart WHERE item_id = ? AND user_id = ?', [item_id, sess.user_info.user_id], (err, result_data) => {
            if (err){ console.log(err);}
            biddata = result_data;
            console.log('Biddata is ', biddata);
           //  if(result_if.length != 0 && item[0].bid_type == 0)
           // {
           //        done = true;
           // }
            res.render('product', {
               'categorys' : categorys,
               'item' : item[0],
               'itemcategory': itemcategory[0],
               'itemimage':itemimage,
               'selectedimage': selected_image,
               'done' : done,
               'biddata' : biddata[0],
               session : sess
             });
           });
         });
        });
       });
   });
});

//입찰참여하기 누르면 여기로 가서 상품보여주고 입찰가 입력받는 페이지
app.get('/bidding', function (req, res) {
   let item_id = req.query.item_id;
   const sess = req.session;
   let categorys = [];
   let item = [];
   let itemimage = [];
   let selected_image = [];
   var item_user_id;
   db.query('SELECT * FROM category', (err, results) => {
            if (err){
               console.log(err);
               res.render('error');
            }
   categorys = results;
   //판매할 물품
   db.query('SELECT * FROM item WHERE item_id = ?', [item_id],(err, result_item) => {
         if (err){ console.log(err);}
         item = result_item;
   //이미지
   db.query('SELECT * FROM image WHERE item_id = ?', [item[0].item_id],(err, result_image) => {
      if (err){ console.log(err);}
      if(result_image.length != 0)
      {
         itemimage = result_image;
         selected_image = itemimage[0].img_name;
      }

   });
   //카테고리이름
   db.query('SELECT cat_name FROM category WHERE cat_id = ?', [item[0].cat_id], (err, result_category) => {
         if (err){ console.log(err);}
         const itemcategory = result_category;
         console.log('Category is ', itemcategory);
         res.render('bidding', {
            'categorys' : categorys,
            'item' : item[0],
            'itemcategory': itemcategory[0],
            'itemimage':itemimage,
            'selectedimage': selected_image,
            session : sess
         });
      });
   });
});
});

//위시리스트get
   app.get('/wishlist', function (req, res) {
      const sess = req.session;
             if (!sess.user_info) {
                   res.redirect('/');
             }
      let categorys = [];
      db.query('SELECT cat_id, cat_name FROM category', (err, results) => {
               if (err){
                  console.log(err);
                  res.render('error');
               }
      categorys = results;
      console.log(categorys);
      res.render('wishlist', {
            'categorys' : categorys,
            session : sess
      });
   });
   });

//상품 검색
app.post('/do_search', function (req, res) {
   const sess = req.session;
          // if (!sess.user_info) {
            //     res.redirect('/');
          // }
   let categorys = [];
   var body = req.body;
   var searchword = body.searchword;
   let resultitems = [];
   db.query('SELECT cat_id, cat_name FROM category', (err, results) => {
            if (err){
               console.log(err);
               res.render('error');
            }
   categorys = results;
   console.log(categorys);
   db.query('SELECT * FROM item WHERE item_name LIKE ? OR item_content LIKE ?', ['%' + searchword +'%','%' + searchword +'%'], function(error,results){
      if(error){
         console.log('검색 실패');
      }else{
         //let search_result = results;
         console.log('검색 완료. result: ', results);
      }

      var temp = {"cat_name": searchword +  " 검색 결과"}
      console.log(temp);
      res.render('shop', {
            'categorys' : categorys,
            session : sess,
            'items' : results,
            'currentcategory': temp
      });
   });
});
});


//상품 등록 진행 코드
      app.post("/do_product_register", upload.single('userfile'), function (req,res){
      const sess = req.session;
      var add_item_id = 0;
             if (!sess.user_info) {
                   res.redirect('/');
             }
            console.log("product_register connect");
             const body = req.body;
             const ItemTitle = body.ItemTitle;
             const ItemCategory = body.ItemCategory;
             const StartPrice = body.StartPrice;
             const SellPrice = body.SellPrice;
             const AuctionType = body.AuctionType;
             const BidType = body.BidType;
             const ItemCond = body.ItemCond;
             const ItemDescrip = body.ItemDescrip;
             const sell_start_date = Date();
             const Duration = body.Duration;

            console.log("Duration is " + Duration);
            const today = new Date()
            const final = new Date();
            var value = parseInt(Duration);
            final.setMinutes(final.getMinutes() + value); //After Duration
            year = final.getFullYear();
           month = final.getMonth() + 1;
           day = final.getDate();
           min = final.getMinutes();
            hour = final.getHours();

         db.query('INSERT INTO item(user_id, cat_id, auc_type, bid_type, item_name, item_content, item_cond, item_reserve_price, item_duration, item_start_time, item_start_price, item_rep_image ) VALUES(?,?,?,?,?,?,?,?,?,?,?,?) ',
         [sess.user_info.user_id, ItemCategory, AuctionType, BidType, ItemTitle, ItemDescrip, ItemCond, SellPrice, final, today, StartPrice, req.file.originalname], function(error,result){
            if(error){
               console.log('물품 추가 실패');
            }else{
            console.log('물품 db 추가 완료. result: ', ItemTitle);
            }
         });

         console.log("item_id 찾기");
         db.query('SELECT item_id FROM item WHERE user_id = ? ORDER BY item_id DESC LIMIT 1', [sess.user_info.user_id], (err, result_item) => {
               if (err) throw err;
               console.log(result_item);
               add_item_id = result_item[0].item_id;

               db.query('INSERT INTO image(item_id, img_name, img_path, img_size) VALUES(?,?,?,?) ',
               [add_item_id, req.file.originalname , req.file.path, req.file.size], function(error,result){
                  if(error){
                     console.log(error);
                  }else{
                  res.redirect(url.format({
                           pathname: '/',
                           query: {
                                 'success': true,
                                 'message': 'Item_register_success/'
                           }
                  }));
               }
            });
         });
   });

//회원 가입 진행 코드
   app.post("/user_registration", function (req,res){
         console.log("user_registration connect");
          var body = req.body;
          var email = body.InputEmail;
          var name = body.InputUserName;
          var passwd = sha256(body.InputPassword1);
          var nickname = body.InputUserNickname;
          var phone = body.InputPhoneNum;
          var birth = body.InputBirth;
          var address = body.InputAddress
         console.log(email, name);

         db.query('INSERT INTO user(user_email, user_pw, user_name, user_nickname, user_phone, user_birth, user_address, user_chk ) VALUES(?,?,?,?,?,?,?,?) ',
         [email, passwd, name, nickname, phone, birth, address, '1'], function(error,result){
            if(error) throw error;
            console.log('추가 완료. result: ',email, passwd, name, nickname, phone, birth, address);
            // alert("회원 가입이 완료되었습니다.");
            res.redirect(url.format({
                     pathname: '/signin',
                     query: {
                           'success': true,
                           'message': 'Sign up success'
                     }
            }));
            // res.render('registration', {
            //    pass:true
            //    });
         });
       });

//인증 메일 전송 코드
      app.post('/user_send',function(req,res){

          mailOptions={
              to : req.body.EmailChk,
              subject : "Please enter your Email account number",
              html : "Hello,<br> Please Enter <b>"+ rand +"</b> to verify your email.<br>"
          }
          console.log(mailOptions);
          smtpTransport.sendMail(mailOptions, function(error, response){
           if(error){
                  console.log(error);
              res.end("error");
           }else{
                window.close();
               }
      });
      });



//인증 메일 확인 코드
      app.post('/mail_check',function(req,res){
         if(rand == req.body.InputEmailChk){

         }
      });


//로그인 코드
      app.post('/do_signin',  function (req,res){
         const body = req.body;
         const email = req.body.email;
         var pass = sha256(req.body.pass);
         console.log(body);
         var flag = false;
         var id = 0;
         //유저 찾기
         db.query('SELECT * FROM `user` WHERE `user_email` = ? LIMIT 1', [email], (err, result) => {
               if (err) throw err;
               console.log(result);

               if (result.length === 0) {
                     console.log('없음');
                     // res.json({success: false});
                     res.redirect(url.format({
                           pathname: '/signin',
                           query: {
                                 'success': false,
                                 'message': 'Login failed: ID does not exist'
                           }
                     }));
               } else {
                     if (pass != result[0].user_pw) {
                           console.log('비밀번호 불일치');
                           res.redirect(url.format({
                                 pathname: '/signin',
                                 query: {
                                       'success': false,
                                       'message': 'Login failed: Password Incorrect'
                                 }
                           }));
                     } else {
                           console.log('로그인 성공');

                           //세션에 유저 정보 저장
                           req.session.user_info = result[0];
                           flag = true;
                           id = result[0].user_id;

                           db.query('select * from `cart` where `user_id` = ?', [id], (err, result1) => {
                                 if (err){
                                    console.log(err);
                                    res.render('error');
                                 }

                                 req.session.cartnum = result1.length;
                              });
                              db.query('select * from `favorite` where `user_id` = ?', [id], (err, result2) => {
                                 if (err){
                                    console.log(err);
                                    res.render('error');
                                 }
                                 req.session.wishnum = result2.length;
                                 res.redirect('/');
                              });
                     }
               }
         });
   });

   //아이템페이지에서 입찰참여하기 누르면 스프링을통해 에이전트 열음
         app.post("/do_bidding_agent", upload.single('userfile'), function (req,res){
            const sess = req.session;
            console.log("Agent connect");
                if (!sess.user_info) {
                      res.redirect('/');
                }
               var body = req.body;
               var bidprice = body.bidprice;
               var item_id = req.query.item_id;
               var BidData = { user_id : sess.user_info.user_id, item_id : item_id, bidding_price : bidprice };
               console.log(BidData);
                // 전달하고자 하는 데이터 생성
               var opts = {
                   host: '127.0.0.1',
                   port: 8080,
                   method: 'POST',
                   path: '/agent/data',
                   headers: {'Content-type': 'application/json'},
                   body: BidData
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

               app.get('/fromspring', function (req, res) {
                  res.send("Success Data!");
               });

               // 요청 전송
               req.write(JSON.stringify(req.data.body));

               req.end();

               //입찰참여하기 누르면 에이전트 열고 bidding페이지로 가서 입찰하면서 블록 생성
               res.redirect(url.format({
                        pathname: '/bidding',
                        query: {
                              'success': true,
                              'item_id': item_id,
                              'message': '입찰하러가기'
                        }
               }));
      });

      //bidding페이지에서 가격 입력 받으면 블록 생성
      app.post("/do_bidding_block", function (req,res){
				const sess = req.session;
			console.log("Mine connect");
						if (!sess.user_info) {
									res.redirect('/');
						}

            const body = req.body;
            console.log(body);
            var bidprice = body.bidprice;
            var item_id = req.query.item_id;
            const BidData = { user_id : sess.user_info.user_id, item_id : item_id, bidding_price : bidprice };

            db.query('INSERT INTO cart(user_id, item_id, bidding_price, is_winner) VALUES(?,?,?,?) ',
              [sess.user_info.user_id, item_id, bidprice, 0], function(error,result){
                if(error){
                  console.log('cart 추가 실패');
                }else{
                  console.log('cart db 추가 완료.');
                }
              });

             // 전달하고자 하는 데이터 생성
            var opts = {
                  host: '127.0.0.1',
                  port: 8080,
                  method: 'POST',
                  path: '/agent/mine',
                  headers: {'Content-type': 'application/json'},
                  body: BidData
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

            app.get('/fromspring', function (req, res) {
               res.send("Success Data!");
            });

            // 요청 전송
            req.write(JSON.stringify(req.data.body));

            req.end();

            res.redirect(url.format({
                     	pathname: '/cart',
                     query: {
                           'success': true,
                           'message': 'bidding',
                           'user_id': sess.user_info.user_id,
									         'success': true
                     }
            }));
   });
}
