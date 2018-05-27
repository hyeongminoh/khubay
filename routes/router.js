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

	app.get('/', function (req, res) {
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
		res.render('main_index', {
				'categorys' : categorys
		});
	});
});

app.get('/cart', function (req, res) {
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
	res.render('cart', {
			'categorys' : categorys
	});
});
});

	app.get('/blog_single', function (req, res) {
		res.render('blog_single');
	});

	app.get('/blog', function (req, res) {
		res.render('blog');
	});


	app.get('/error;', function (req, res) {
		res.render('error');
	});


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
		res.render('product', {
				'categorys' : categorys
		});
	});
	});

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


	app.get('/product_register', function (req, res) {
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
				'categorys' : categorys
		});
	});
	});

	app.get('/category',function(req,res){
			var name = "test!";
			res.render('category_detail',{'title':name})
	});

	app.get('/category/:id', function (req, res) {
		var id = req.params.id;
		res.render('category_detail',{title:id})
	});

	app.get('/mypage', function (req, res) {
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
				'categorys' : categorys
		});
	});
	});

	app.get('/wishlist', function (req, res) {
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
				'categorys' : categorys
		});
	});
	});

	app.post("/do_product_register", function (req,res){
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
			['0', ItemCategory, AuctionType, BidType, ItemTitle, ItemCategory, ItemCond, SellPrice, Duration, sell_start_date, StartPrice], function(error,result){
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

		app.post('/mail_check',function(req,res){
			if(rand == req.body.InputEmailChk){

			}
		});




		app.post('/do_signin',  function (req,res){
			const body = req.body;


			const email = req.body.email;
			var pass = sha256(req.body.pass);
			console.log(body);
			//유저 찾기
			// req.session.user_idx = 1;
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
									res.redirect('/');


							}
					}
			});
	});
}
