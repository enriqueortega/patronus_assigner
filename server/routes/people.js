var express = require('express');
var router = express.Router();
var pg = require('pg');
var connectionString;

if(process.env.DATABASE_URL) { //connecting to outside heroku database
  pg.defaults.ssl = true;
  connectionString = process.env.DATABASE_URL;
} else { //connecting to local database before being connected to heroku for testing purposes
  connectionString = 'postgress://localhost:5432/patroni_tables';
}

router.post("/*", function(req,res){
  var first_name = req.body.first_name;
  var last_name = req.body.last_name;

  console.log("totally people bro",req.body);
  pg.connect(connectionString, function(err, client, done){
    if (err){
      console.log('error connecting to DB:', err);
      res.status(500).send(err);
      done();
      return;
    }

    var query = client.query('INSERT INTO tbl_people (first_name, last_name) VALUES ($1,$2);',[first_name, last_name]);

    query.on('end', function(){
      res.status(200).send("succues insert");
      done();
    });

    query.on('error', function(error){
      console.log("error inserting perosn into DB:", error);
      res.status(500).send(error);
      done();
    });
  })
});

//TODO: make router dynamic based off of id
router.put("/test/*",function(req,res){
  console.log("still works");
  console.log(req.body);
  console.log("still works");
  var personId = req.params[0];
  var patronusId = req.body.patronusDrop;
  var results=[];

  pg.connect(connectionString, function(err, client, done){
    var query = client.query('UPDATE tbl_people SET patronus_id = $1 WHERE person_id = $2;', [patronusId, personId]);

    query.on('row', function(row){
      console.log("we got a row!!!!!!!!!!", row);
      results.push(row);
    });

    query.on('end', function(){
      res.send(results);
      done();
    });

    query.on('error', function(error){
      console.log("error inserting perosn into DB:", error);
      res.status(500).send(error);
      done();
    });

  });
});

router.get("/assigned", function(req, res){
  console.log("Hey gurl, heeeyyyy");
  pg.connect(connectionString, function(err, client, done){
    if (err){
      res.status(500).send(err);
      done();
      return;
    }

    var assignedResults = [];
    var peoplePatronus = client.query('SELECT * FROM tbl_people JOIN tbl_patroni on tbl_people.patronus_id = tbl_patroni.patronus_id;');

    peoplePatronus.on('row', function(row){
      console.log("we got a row",row);
      assignedResults.push(row);
    });

    peoplePatronus.on('end', function(){
      res.send(assignedResults);
      done();
    });

    peoplePatronus.on('error', function(error){
      console.log("error inserting person into DB:", error);
      res.status(500).send(error);
      done();
    });
  });
});

router.get("/*", function(req,res){
  console.log("hey you got get got goot people");
  pg.connect(connectionString, function(err, client, done){
    if (err){
      console.log('error connecting to DB:', err);
      res.status(500).send(err);
      done();
      return;
    }

    var results=[];
    var query = client.query('SELECT * FROM tbl_people WHERE patronus_id IS NULL;');

    query.on('row', function(row){
      console.log("we got a row",row);
      results.push(row);
    });

    query.on('end', function(){
      res.send(results);
      done();
    });

    query.on('error', function(error){
      console.log("error inserting person into DB:", error);
      res.status(500).send(error);
      done();
    });
  });
});

module.exports = router;
