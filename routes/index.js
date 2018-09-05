var express = require('express');
var router = express.Router();
//Logging für den Server
var JL = require('jsnlog').JL;

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Geosoftware I - Endabgabe - db' });
});

/* GET map page. */
router.get('/map', function(req, res, next) {
  res.render('map', { title: 'Geosoftware I - Endabgabe - Lageplan' });
});

/* GET database page that contains all objects of the collection fachbereiche. */
router.get('/database', function(req, res) {
  var db = req.db;
  var collection = db.get('fachbereiche');
  collection.find({},{},function(e,docs){
      res.render('database', {
          'database' : docs, title: "Liste aller Fachbereiche"
      });
  });
});

router.get('/:name', function(req, res) {
  var db = req.db;
  var collection = db.get('institutes');
  collection.find({"name": req.params.name},{},function(e,docs){
    var baba = JSON.parse(docs[0].json);
    res.render('object', {title: 'Objekt: ' + JSON.stringify(baba.features[0].features[0].properties.name), text: JSON.stringify(docs[0].json), dbName:JSON.stringify(docs[0].name)});  
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
  var collection = db.get('institutes');
  collection.find({"name": document.name},{},function(e,docs){
    if (docs[0] !== undefined) {
      JL().error("The name..."+document.name+"...was already taken");
    } else {
      db.collection('institutes').insert(document, function(err, result) {
        res.send(document);
        JL().info("New Object..."+document.name+"...was succesfully saved");
      })
    }
  })
})
.post('/db/routes', function(req, res) {
  var db = req.db;
  var document = req.body;
  var collection = db.get('routes');
  collection.find({"name": document.name},{},function(e,docs){
    if (docs[0] !== undefined) {
      JL().error("The name..."+document.name+"...was already taken");
    } else {
      db.collection('routes').insert(document, function(err, result) {
        res.send(document);
        JL().info("New Object..."+document.name+"...was succesfully saved");
      })
    }
  })
})
.post('/db/fachbereiche', function(req, res) {
  var db = req.db;
  var document = req.body;
  var collection = db.get('fachbereiche');
  collection.find({"name": document.name},{},function(e,docs){
    if (docs[0] !== undefined) {
      JL().error("The name..."+document.name+"...was already taken");
    } else {
      db.collection('fachbereiche').insert(document, function(err, result) {
        res.send(document);
        JL().info("New Object..."+document.name+"...was succesfully saved");
      })
    }
  })
});
/*
* handling database get request when clicking button in map
* loading the data from the respective database collection
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
  var collection = db.get('fachbereiche');
  collection.find({name:req.params.name},{},function(e,docs){  
    if(docs.length<1){
      collection.find({abk:req.params.name},{},function(e,docs){
        res.send(docs);
      })
    }
    else {
      res.send(docs);
    }
  })
})
.get('/db/routes/:name', function(req, res) {
  var db = req.db  
  var collection = db.get('routes');
  collection.find({name: req.params.name},{},function(e,docs){
    res.send(docs);
  })
});

/*
* handling database update request when clicking button in map
*/
router.put('/db/institutes/:name', function(req, res) {
  var db = req.db;
  var collection = db.get('institutes');
  collection.update({name: req.params.name},{name: req.body.name, json: req.body.json},
    function(e,docs){
      res.send(docs)
  });
})
.put('/db/fachbereiche/:abk', function(req, res) {
  var db = req.db;
  var collection = db.get('fachbereiche');
  collection.update({name: req.body.name, abk: req.body.abk},{name: req.body.name, abk: req.body.abk, site: req.body.site, inst: req.body.inst},
    function(e,docs){
      res.send(docs)
  });
})
.put('/db/routes/:name', function(req, res) {
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

module.exports = router;