var express = require('express');
var router = express.Router();

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

router.get('/:name', function(req, res) {
  var db = req.db;
  var collection = db.get('institutes');
  collection.find({"name": req.params.name},{},function(e,docs){
    var baba = JSON.parse(docs[0].json);
    JL().info(baba.features[0].features[0].properties.name);
    res.render('object', {title: 'Objekt: ' + JSON.stringify(baba.features[0].features[0].properties.name), text: JSON.stringify(docs[0].json), dbName:JSON.stringify(docs[0].name)});
  JL().info("Currently retrieving object with id... "+req.params.id+ "...");  
  }); 
})

/* GET impressum page. */
router.get('/impressum', function(req, res, next) {
  res.render('impressum', { title: 'Geosoftware I - Endabgabe - Impressum' });
});

/*
* handling database post request when clicking button in map
* sending the data of the request to the respective database collection
*/
router.post('/db/institutes', function(req, res) {
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
.post('/routes/', function(req, res) {
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
.post('/fachbereiche/', function(req, res) {
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
* handling database get request when clicking button in map
* loading the data from the respective database collection
*/
router.get('/institutes/:name', function(req, res) {
  var db = req.db;
  var collection = db.get('institutes');
  collection.find({name: req.params.name},{},function(e,docs){
        res.send(docs);
    })
  })
.get('/fachbereiche/:name', function(req, res) {
  var db = req.db
  var collection2 = db.get('fachbereiche');
  collection2.find({name: req.params.name},{},function(e,docs){
        res.send(docs);
    })
  })
.get('/routes/:name', function(req, res) {
  var db = req.db  
  var collection3 = db.get('routes');
  collection3.find({name: req.params.name},{},function(e,docs){
          res.send(docs);
    })
  });

/*
* handling database update request when clicking button in map
*/
router.put('/institutes/:name', function(req, res) {
  var db = req.db;
  var collection = db.get('institutes');
  collection.update({name: req.params.name},{name: req.body.name, json: req.body.json},
    function(e,docs){
      res.send(docs)
  });
})
.put('/fachbereiche/:name', function(req, res) {
  var db = req.db;
  var collection = db.get('fachbereiche');
  collection.update({name: req.params.name},{name: req.body.name, abk: req.body.abk, site: req.body.site, inst: req.body.inst},
    function(e,docs){
      res.send(docs)
  });
})
.put('/routes/:name', function(req, res) {
  var db = req.db;
  var collection = db.get('routes');
  collection.update({name: req.params.name},{name: req.body.name, start: req.body.start, ziel: req.body.ziel},
    function(e,docs){
      res.send(docs)
  });
});

/*
* handling database delete request when clicking button in map
*/
router.delete('/institutes/:name', function(req, res) {
  var db = req.db;
  var collection = db.get('institutes');
  collection.remove({name: req.params.name},function(e,docs){
      res.send(docs)
  });
})
.delete('/fachbereiche/:name', function(req, res) {
  var db = req.db;
  var collection = db.get('fachbereiche');
  collection.remove({name: req.params.name},function(e,docs){
      res.send(docs)
  });
})
.delete('/routes/:name', function(req, res) {
  var db = req.db;
  var collection = db.get('routes');
  collection.remove({name: req.params.name},function(e,docs){
      res.send(docs)
  });
});

module.exports = router;