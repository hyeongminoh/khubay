module.exports = function(app){

	const db = require('../db');
	const sha256 = require('sha256');

	app.get('/', function (req, res) {
		res.render('main_index');
	});

	app.get('/blog_single', function (req, res) {
		res.render('blog_single');
	});

	app.get('/blog', function (req, res) {
		res.render('blog');
	});

	app.get('/cart', function (req, res) {
		res.render('cart');
	});

	app.get('/error;', function (req, res) {
		res.render('error');
	});

	app.get('/product', function (req, res) {
		res.render('product');
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
		res.render('product_register');
	});
	app.get('/category', function (req, res) {
		res.render('category');
	});
	app.get('/category/:id', function (req, res) {
		res.render('category');
	});

	app.post("/test_registration", function (req,res){
			console.log("test_registration connect");
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
				console.log('추가 완료. result: ',result);
			});

			 res.redirect('/registration')
	 	});

}
