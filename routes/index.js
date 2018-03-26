var express = require('express');
var router = express.Router();
var mysqlDB = require('../db/mysql');
var multipart = require('connect-multiparty');
var multipartMiddleware = multipart();
var multer = require("multer");
// 这里dest对应的值是你要将上传的文件存的文件夹
var upload = multer({dest:'../file/receipt'});

/* Home page */
router.get('/', function(req, res, next) {

  //res.render('index', { title: 'Express' });
  res.json('success request');
});

/* ************************************出库单stockout api. ****************************************/
router.post('/api/create_stockout_details', function(req, res, next) {

  var sql = 'INSERT INTO stockout_receipt_details (product_number, category, part_number, price, quantity, amount, receipt_number) VALUES ?';
  console.log('stockout_details body');
  console.log(req.body);
  var arr = req.body;
  var values = [];
  arr.forEach(element => {
    var tmp = [element.productNumber,
              element.category,
              element.part_number,
              element.price,
              element.quantity,
              element.amount,
              element.stockout_number];
    values.push(tmp);
  });
  console.log('mysql value');
  console.log(values);
  mysqlDB.query(sql, [values], function (err, result) {
    if (err) throw err;
    console.log('success insert');
  });
  
  //res.render('index', { title: 'Express' });
  
});

router.post('/api/create_stockout_receipt', function(req, res, next) {
  var sql = 'INSERT INTO `stockout_receipt`(`receipt_number`, `company_name`, `subtotal`, `signer`, `date`, `receipt_type`, `comment`) VALUES ?';
  //var sql = 'INSERT INTO stockout_details (product_number, category, part_number, price, quantity, amount, stockout_number) VALUES ?';
  console.log('stockout_receipt body');
  console.log(req.body);
  var body = req.body;
  var values = [[body.receipt_number,
            body.company,
            body.subtotal,
            body.signer,
            body.date,
            body.type,
            body.comment]];

  console.log('mysql value');
  console.log(values);
  mysqlDB.query(sql, [values], function (err, result) {
    if (err) throw err;
    console.log('success insert');
  });
});

router.get('/api/get_stockout_receipt', function(req, res, next) {
  var sql = 'SELECT `receipt_number`, `company_name`, `subtotal`, `signer`, `date`, `receipt_type`, `stub_path` FROM `stockout_receipt`';
  mysqlDB.query(sql, function (err, result) {
    if (err) throw err;
    console.log(result);
    res.json(result);
  });//res.render('index', { title: 'Express' });
  
});

router.get('/api/get_stockout_receipt/:id', function(req, res, next) {
  var receipt_number = req.params.id;
  console.log('receipt_number');
  console.log(receipt_number);
  var sql = 'SELECT `receipt_number`, `company_name`, `subtotal`, `signer`, `date`, `receipt_type`, `comment`FROM `stockout_receipt`'+
  'WHERE `receipt_number` = '+receipt_number;
  
  mysqlDB.query(sql, function (err, result) {
    if (err) throw err;
    console.log(result);
    res.json(result);
  });//res.render('index', { title: 'Express' });
  
});


router.get('/api/get_stockout_receipt_detial/:id', function(req, res, next) {
  var receipt_number = req.params.id;
  console.log('receipt_number');
  console.log(receipt_number);
  var sql = 'SELECT * FROM `stockout_receipt_details`'+
  'WHERE `receipt_number` = '+receipt_number;
  
  mysqlDB.query(sql, function (err, result) {
    if (err) throw err;
    console.log(result);
    res.json(result);
  });//res.render('index', { title: 'Express' });
  
});

// multipartMiddleware
router.post('/api/add_stockout_receipt_stubImg', upload.single('file'), function(req, res, next) {
  console.log('stockout_receipt stub image');
    console.log(req.body);
    console.log(req.file);
    //`stub_signer`= '+req.body.stub_signer+',`sign_date`= '+req.body.sign_date+
    var sql = "UPDATE stockout_receipt SET stub_path ='"+req.file.path+"' WHERE receipt_number='"+req.body.receiptId+"'";
    mysqlDB.query(sql, function (err, result) {
      if (err) throw err;
      console.log(result);
      //res.json(result);
    });//res.render('index', { title: 'Express' });

    //res.send('/file/receipt/'+req.file.filename);

});



module.exports = router;
