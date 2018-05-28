module.exports = function(app){

	const db = require('../db');
	const sha256 = require('sha256');
	const url = require('url');
	const nodemailer = require("nodemailer");
	const mailconfig = require('../config/mail-config.json');

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

//메인 홈 코드
	app.get('/', function (req, res) {
		let categorys = [];
		const sess=req.session;
		db.query('SELECT cat_id, cat_name FROM category', (err, results) => {
					if (err){
						console.log(err);
						res.render('error');
					}
		categorys = results;
		// console.log(categorys);
		/*for(var category in categorys){
			console.log("category is " + categorys[category]["cat_name"]	);
		}*/
		// categorys.forEach(function(item,index){
		// 	console.log('Each item #' + index + ' :',item.cat_name);
		// });
			res.render('main_index', {
				'categorys' : categorys,
				session : sess
		});
	});
});

//상품 카드
app.get('/cart', function (req, res) {
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
	/*for(var category in categorys){
		console.log("category is " + categorys[category]["cat_name"]	);
	}*/
	categorys.forEach(function(item,index){
		console.log('Each item #' + index + ' :',item.cat_name);
	});
	 const sess = req.session;
	res.render('cart', {
			'categorys' : categorys,
			session : sess
	});
});
});

//??
	app.get('/blog_single', function (req, res) {
		res.render('blog_single');
	});

	app.get('/blog', function (req, res) {
		res.render('blog');
	});


	app.get('/error;', function (req, res) {
		res.render('error');
	});

//상품 보기??
	app.get('/product', function (req, res) {
		let categorys = [];
		db.query('SELECT cat_id, cat_name FROM category', (err, results) => {
					if (err){
						console.log(err);
						res.render('error');
					}
		categorys = results;
		console.log(categorys);
		/*for(var category in categorys){
			console.log("category is " + categorys[category]["cat_name"]	);
		}*/
		categorys.forEach(function(item,index){
			console.log('Each item #' + index + ' :',item.cat_name);
		});
	 const sess = req.session;
		res.render('product', {
				'categorys' : categorys,
				session : sess
		});
	});
	});

//??
	app.get('/regular', function (req, res) {
		res.render('regular');
	});

	app.get('/shop', function (req, res) {
		res.render('shop');
	});

	app.get('/signin', function (req, res) {
		res.render('signin');
	});

	app.get('/shop', function (req, res) {
		res.render('shop');
	});

	app.get('/registration', function (req, res) {
		res.render('registration');
	});

//??
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
		console.log(categorys);
		/*for(var category in categorys){
			console.log("category is " + categorys[category]["cat_name"]	);
		}*/
		categorys.forEach(function(item,index){
			console.log('Each item #' + item.cat_id + ' :',item.cat_name);
		});
		res.render('product_register', {
				'categorys' : categorys,
				session : sess
		});
	});
	});

	app.get('/category',function(req,res){
			var name = "test!";
			res.render('category_detail',{'title':name})
	});

//?? 이코드는 뭐야?
	app.get('/category/:id', function (req, res) {
		var id = req.params.id;
		res.render('category_detail',{title:id})
	});


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
		console.log(categorys);
		/*for(var category in categorys){
			console.log("category is " + categorys[category]["cat_name"]	);
		}*/
		categorys.forEach(function(item,index){
			console.log('Each item #' + index + ' :',item.cat_name);
		});
		res.render('user_rule', {
				'categorys' : categorys,
				session : sess
		});
	});
	});

//view , 코드 별 위에 주석좀 무슨 역할인줄 모르겟음! 이거 말구
	app.get('/mypage', function (req, res) {
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
		/*for(var category in categorys){
			console.log("category is " + categorys[category]["cat_name"]	);
		}*/
		categorys.forEach(function(item,index){
			console.log('Each item #' + index + ' :',item.cat_name);
		});
		res.render('mypage', {
				'categorys' : categorys,
				session : sess
		});
	});
	});

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
		/*for(var category in categorys){
			console.log("category is " + categorys[category]["cat_name"]	);
		}*/
		categorys.forEach(function(item,index){
			console.log('Each item #' + index + ' :',item.cat_name);
		});
		res.render('wishlist', {
				'categorys' : categorys,
				session : sess
		});
	});
	});

//상품 등록 진행 코드
	app.post("/do_product_register", function (req,res){
		const sess = req.session;
				 if (!sess.user_info) {
						 res.redirect('/');
				 }
				console.log("product_register connect");
				 var body = req.body;
				 var ItemTitle = body.ItemTitle;
				 //var ItemCategory = body.ItemCategory;
				 var ItemCategory = 1;
				 var StartPrice = body.StartPrice;
				 var SellPrice = body.SellPrice;
				 var AuctionType = body.AuctionType;
				 var BidType = body.BidType;
				 var ItemCond = body.ItemCond;
				 var ItemDescrip = body.ItemDescrip;
				 var sell_start_date = Date();
				 var Duration = body.Duration;
				console.log("title is " + ItemTitle);
				console.log(ItemTitle,ItemCategory,StartPrice,SellPrice,AuctionType,BidType,ItemCond,ItemDescrip,sell_start_date,Duration);

			db.query('INSERT INTO item(user_id, cat_id, auc_type, bid_type, item_name, item_content, item_cond, item_reserve_price, item_duration, item_start_price ) VALUES(?,?,?,?,?,?,?,?,?,?) ',
			[sess.user_info.user_id, ItemCategory, AuctionType, BidType, ItemTitle, ItemCategory, ItemCond, SellPrice, Duration, sell_start_date, StartPrice], function(error,result){
				if(error) throw error;
				console.log('추가 완료. result: ',ItemTitle);
				res.redirect(url.format({
							pathname: '/',
							query: {
									'success': true,
									'message': 'Item register success'
							}
				}));
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

			/* var query = db.query('INSERT INTO user (user_email, user_pw, user_name, user_nickname, user_phone, user_birth, user_address, user_chk ) VALUES ("' + email + '","' + passwd + '","' + name + '","' + nickname + '","' + phone + '","'  + birth + '","'  + address + + '","' '")', function(err, rows) {
					 if(err) { console.log(err);}
					 console.log("err!");
			 })*/

			db.query('INSERT INTO user(user_email, user_pw, user_name, user_nickname, user_phone, user_birth, user_address, user_chk ) VALUES(?,?,?,?,?,?,?,?) ',
			[email, passwd, name, nickname, phone, birth, address, '1'], function(error,result){
				if(error) throw error;
				console.log('추가 완료. result: ',email, passwd, name, nickname, phone, birth, address);
				res.redirect(url.format({
							pathname: '/signup',
							query: {
									'success': true,
									'message': 'Sign up success'
							}
				}));
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

//로그아웃 코드
		app.get('/logout', (req, res) => {

        req.session.destroy(function (err) {
            if (err) throw err;
            res.redirect('/');
        });
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
}
