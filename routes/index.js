var express = require('express');
var router = express.Router();

//Logging für den Server
var JL = require('jsnlog').JL;
//Logging für die Konsole
var jsnlog_nodejs = require('jsnlog-nodejs').jsnlog_nodejs;

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Geosoftware I - Endabgabe - db' });
});

/* GET map page. */
router.get('/map', function(req, res, next) {
  res.render('map', { title: 'Geosoftware I - Endabgabe - Lageplan' });
});

/* GET database page that contains all objects of our database. */
router.get('/database', function(req, res) {
  var db = req.db;
  var collection = db.get('fachbereiche');
  collection.find({},{},function(e,docs){
      res.render('database', {
          'database' : docs, title: "Datenbank Objekte"
      });
  });
});

/* GET impressum page. */
router.get('/impressum', function(req, res, next) {
  res.render('impressum', { title: 'Geosoftware I - Endabgabe - Impressum' });
});

/*
* handling database insert post request when clicking button in map
* sending the data of the request to the respective database collections
*/
router.post('/db/institutes/', function(req, res) {
  var db = req.db;
  var document = req.body;
  if (document.type == 'institute') {
    db.collection('institutes').insert(document, function(err, result) {
      if(err) {
        JL().error("New Object..."+document.name+"...wasn't succesfully saved");
      } else {
        res.send(document);
        JL().info("New Object..."+document.name+"["+document.type+"]... saved to the database institutes");
      }
    });
  }
})
.post('/db/routes/', function(req, res) {
  var db = req.db;
  var document = req.body;
  if (document.type == 'route') {
    db.collection('routes').insert(document, function(err, result) {
      if(err) {
        JL().error("New Object..."+document.name+"...wasn't succesfully saved");
      } else {
        res.send(document);
        JL().info("New Object..."+document.name+"["+document.type+"]... saved to the database routes");
      }
    });
  }
})
.post('/db/fachbereiche/', function(req, res) {
  var db = req.db;
  var document = req.body;
  if (document.type == 'fachbereich'){
    db.collection('fachbereiche').insert(document, function(err, result) {
      if(err) {
        JL().error("New Object..."+document.name+"...wasn't succesfully saved");
      } else {
        res.send(document);
        JL().info("New Object..."+document.name+"["+document.type+"]... saved to the database fachbereiche");
      }
    });
  }
});
/*
* handling database insert post request when clicking button in map
* sending the data of the request to the respective database collections
*/
router.get('/db/institutes/:name', function(req, res) {
  var db = req.db;
  var collection = db.get('institutes');
  collection.find({name: req.params.name},{},function(e,docs){
        res.send(docs);
    })
  })
.get('/db/fachbereiche/:name', function(req, res) {
  var db = req.db
  var collection2 = db.get('fachbereiche');
  collection2.find({name: req.params.name},{},function(e,docs){
        res.send(docs);
    })
  })
.get('/db/routes/:name', function(req, res) {
  var db = req.db  
  var collection3 = db.get('routes');
  collection3.find({name: req.params.name},{},function(e,docs){
          res.send(docs);
    })
  })
.get('/:name', function(req, res) {
  var db = req.db;
  var collection = db.get('institutes');
  collection.find({"name": req.params.name},{},function(e,docs){
    var baba = JSON.parse(docs[0].json);
    JL().info(baba.features[0].features[0].properties.name);
    res.render('object', {title: 'Objekt: ' + JSON.stringify(baba.features[0].features[0].properties.name), text: JSON.stringify(docs[0].json), dbName:JSON.stringify(docs[0].name)});
  JL().info("Currently retrieving object with id... "+req.params.id+ "...");  
  }); 
});

/*
* handling database update request when clicking button in map
*/
router.put('/db/institutes/:name', function(req, res) {
  var db = req.db;
  var collection = db.get('institutes');
  collection.update({name: req.params.name},{ $set: object },
    function(e,docs){
      res.send(docs)
  });
})
.put('/db/fachbereiche/:name', function(req, res) {
  var db = req.db;
  var collection = db.get('fachbereiche');
  collection.update({name: req.params.name},{ $set: object },
    function(e,docs){
      res.send(docs)
  });
})
.put('/db/routes/:name', function(req, res) {
  var db = req.db;
  var collection = db.get('routes');
  collection.update({name: req.params.name},{ $set: object },
    function(e,docs){
      res.send(docs)
  });
});

/*
* handling database delete request when clicking button in map
*/
router.delete('/db/institutes/:name', function(req, res) {
  var db = req.db;
  var collection = db.get('institutes');
  collection.remove({name: req.params.name},function(e,docs){
      res.send(docs)
  });
})
.delete('/db/fachbereiche/:name', function(req, res) {
  var db = req.db;
  var collection = db.get('fachbereiche');
  collection.remove({name: req.params.name},function(e,docs){
      res.send(docs)
  });
})
.delete('/db/routes/:name', function(req, res) {
  var db = req.db;
  var collection = db.get('routes');
  collection.remove({name: req.params.name},function(e,docs){
      res.send(docs)
  });
});

// jsnlog.js on the client by default sends log messages to /jsnlog.logger, using POST.
router.post('*.logger', function (req, res) {
  jsnlog_nodejs(JL, req.body);
});

module.exports = router;