'use strict';

var monk = require('monk');
var db = monk('localhost:27017/lageplan');
var collection = db.get('institutes');

router.route('/db/:id')
  // GET Object from Database
  .get(function (req, res) {
    db.get_item(req.params.id, function(err, object){
      if (err) {
        res.status(500).end("Failed to retrieve Object from Database." + err);
      } else {
        res.send(object);
        }
    });
  })
  // DELETE Object from Database
  .delete(function (req, res) {
    db.delete_item(req.params.id, function(err){
      if (err)
        res.status(500).end("Failed to delete Object from Database. " + err);
      else
        res.status(200).end("Successfully deleted Object from Database");
      })
  })
  // POST Object in Database (Change Object)
  .post(function (req, res) {
      res.setHeader('Content-type', 'application/json');
      db.change_item(req.body, function (err) {
        if (err)
          res.status(500).end("Failed to change Object in Database." + err);
        else
          res.status(200).end("Successfully changed Object in Database");
      });
      });

module.exports = {
    insert_item: function (item, callback) {
        collection.ensureIndex( { "id": 1 }, { unique: true });
        collection.update(
            {id: { $eq: item.id }},{
                "id": item.id,
                "values": item.values
            },
            { upsert: true },
            function (err, doc) {
                if (err) {
                    callback(err);
                } else {
                    callback(null);
                }
            })
    },
    get_item: function(id, callback) {
        // Search for Element
        collection.find({id: { $eq: id }},{},function(err,object){
            // Check for connection/syntax errors
            if(err){
                callback(err,null);
            }else{
                // Check if there is an Entry - else fail
            if(object.length === 1){
                    // Entry is returned
                    callback(null, object);
                } else {
                    // No entry was found
                    callback(new Error("Object not found in Database"), null);
                }
            }
        });
    },
    change_item: function (item, callback) {
            collection.update(
                {id: { $eq: item.id }},
                {
                    "id": item.id,
                    "values": item.values
                }, function (err, doc) {
                    if (err) {
                        callback(err);
                    } else {
                        console.log(doc);
                        callback(null);
                    }
            })
    },
    delete_item: function (id, callback) {
        collection.remove({ id: id },
            function (err, doc) {
                if (err) {
                    callback(err);
                } else {
                    callback(null);
                }
            })
    },
    get_all_item_ids: function(callback) {
        collection.find({},'id',function(err,idlist){
            callback(idlist);
        });
    }
};