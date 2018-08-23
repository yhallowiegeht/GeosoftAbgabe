var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Geosoftware I - Endabgabe - Start' });
});

/* GET map page. */
router.get('/map', function(req, res, next) {
  res.render('map', { title: 'Geosoftware I - Endabgabe - Lageplan' });
});

/* GET impressum page. */
router.get('/impressum', function(req, res, next) {
  res.render('impressum', { title: 'Geosoftware I - Endabgabe - Impressum' });
});

/*
* handling database insert post request when clicking button in map
* sending the data of the request to the database collection 'institutes'
*/
router.post('/db/', function(req, res) {
  var db = req.db;
  var document = req.body;
  db.collection('institutes').insert(document, function(err, result) {
    if(err) {
      console.log("Klappt nicht");
    } else {
      res.send(document);
      console.log("New Object..."+document.name+ "... saved to the database");
    }
  });
});

router.get('/db/:name', function(req, res) {
  var db = req.db;
  var collection = db.get('institutes');
  collection.find({name: req.params.name},{},function(e,docs){
        res.send(docs);
    });
});

module.exports = router;