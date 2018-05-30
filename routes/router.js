module.exports = function(app){

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
const java = require('java');
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

//메인 홈 코드
	app.get('/', function (req, res) {

		const sess = req.session;
		let categorys = [];
		let item = [];
		let itemimage = [];
		db.query('SELECT cat_id, cat_name FROM category', (err, results) => {
					if (err){
						console.log(err);
						res.render('error');
					}
		categorys = results;
		//판매할 물품
		db.query('SELECT * FROM item ORDER BY item_id DESC LIMIT 10', (err, result_item) => {
				if (err){ console.log(err);}
				item = result_item;
		//이미지
		db.query('SELECT * FROM image',(err, result_image) => {
			if (err){ console.log(err);}
			itemimage = result_image;

				res.render('main_index', {
						'categorys' : categorys,
						'item' : item,
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

	let categorys = [];
	db.query('SELECT * FROM category', (err, results) => {
				if (err){
					console.log(err);
					res.render('error');
				}
	categorys = results;

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

//view확인용, 별거아님
	app.get('/blog_single', function (req, res) {
		res.render('blog_single');
	});

	app.get('/blog', function (req, res) {
		res.render('blog');
	});


	app.get('/error;', function (req, res) {
		res.render('error');
	});


//이것도 템플릿 확인용 별거 없음
	app.get('/regular', function (req, res) {
		res.render('regular');
	});

//이걸 상품 보는걸로 써야함
	app.get('/shop', function (req, res) {
		let cat_id = req.query.cat_id;
		const sess = req.session;
		let categorys = [];
		let items = [];
		let current_cat = [];
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
					console.log("current category: ", current_cat);
				});
		db.query('SELECT * FROM item where cat_id = ? ORDER BY item_id DESC LIMIT 10',[cat_id], (err, result_item) => {
				if (err){ console.log(err);}
				items = result_item;
				console.log(items);
		res.render('shop', {
				'categorys' : categorys,
				'items' : items,
				session : sess,
				'currentcategory':current_cat[0]
					});
		});
	});
});

	app.get('/signin', function (req, res) {
		res.render('signin');
	});

	app.get('/registration', function (req, res) {
		res.render('registration');
	});

//물품등록 get화면 후에 post는 do_product_register에서 실행
/*	app.get('/product_register', function (req, res) {
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
		categorys.forEach(function(item,index){
			console.log('Each item #' + item.cat_id + ' :',item.cat_name);
		});
		res.render('product_register', {
				'categorys' : categorys,
				session : sess
		});
	});
});*/


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
		console.log(categorys);
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
				user_sell_items.forEach(function(item,index){
				console.log('Item name is ',item.item_name);
				});

				res.render('mypage', {
						'categorys' : categorys,
						'user_sell_items' : user_sell_items,
						session : sess
				});
		});
	});
});

//상품 보기 =(형민)상품보는 창..후에 디비로 변경하면 됨
	app.get('/product', function (req, res) {
		const sess = req.session;
		let categorys = [];
		let item = [];
		let itemimage = [];
		let selected_image = [];
		db.query('SELECT * FROM category', (err, results) => {
					if (err){
						console.log(err);
						res.render('error');
					}
		categorys = results;
		console.log('Item is ',categorys);
		//판매할 물품
		db.query('SELECT * FROM item ORDER BY item_id DESC LIMIT 1', (err, result_item) => {
				if (err){ console.log(err);}
				item = result_item;
				console.log('Item is ', item);
				console.log('Item id is ', item[0].item_id);
				console.log('Item category id is ', item[0].cat_id);
		//이미지
		db.query('SELECT * FROM image WHERE item_id = ?', [item[0].item_id],(err, result_image) => {
			if (err){ console.log(err);}
			itemimage = result_image;
			console.log(itemimage);
			selected_image = itemimage[0].img_name;
			console.log(selected_image);
		});
		//카테고리이름
		db.query('SELECT cat_name FROM category WHERE cat_id = ?', [item[0].cat_id], (err, result_category) => {
				if (err){ console.log(err);}
				const itemcategory = result_category;
				console.log('Category is ', itemcategory);
		res.render('product', {
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
		app.post("/do_product_register", upload.single('userfile'), function (req,res){
		const sess = req.session;
		var add_item_id = 0;
				 if (!sess.user_info) {
						 res.redirect('/');
				 }
				console.log("product_register connect");
				 var body = req.body;
				 var ItemTitle = body.ItemTitle;
				 var ItemCategory = body.ItemCategory;
				 var StartPrice = body.StartPrice;
				 var SellPrice = body.SellPrice;
				 var AuctionType = body.AuctionType;
				 var BidType = body.BidType;
				 var ItemCond = body.ItemCond;
				 var ItemDescrip = body.ItemDescrip;
				 var sell_start_date = Date();
				 var Duration = body.Duration;
				console.log(req.file);
				console.log(req.body);
				console.log(ItemTitle,ItemCategory,StartPrice,SellPrice,AuctionType,BidType,ItemCond,ItemDescrip,sell_start_date,Duration,StartPrice);

			db.query('INSERT INTO item(user_id, cat_id, auc_type, bid_type, item_name, item_content, item_cond, item_reserve_price, item_duration, item_start_price ) VALUES(?,?,?,?,?,?,?,?,?,?) ',
			[sess.user_info.user_id, ItemCategory, AuctionType, BidType, ItemTitle, ItemDescrip, ItemCond, SellPrice, Duration, sell_start_date, StartPrice], function(error,result){
				if(error){
					console.log('추가 실패');
				}else{
				console.log('물품 db 추가 완료. result: ', ItemTitle);
				}
			});

			console.log("item_id 찾기");
			db.query('SELECT item_id FROM item WHERE user_id = ? ORDER BY item_id DESC LIMIT 1', [sess.user_info.user_id], (err, result_item) => {
					if (err) throw err;
					console.log(result_item);
					add_item_id = result_item[0].item_id;
					console.log("추가할 id는: ", add_item_id)
					db.query('INSERT INTO image(item_id, img_name, img_path, img_size) VALUES(?,?,?,?) ',
					[add_item_id, req.file.originalname , req.file.path, req.file.size], function(error,result){
						if(error){
							console.log(error);
						}else{
						console.log('이미지 추가 완료. result: ',add_item_id);
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
