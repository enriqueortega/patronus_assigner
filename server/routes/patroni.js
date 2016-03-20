var express = require('express');
var router = express.Router();
var pg = require('pg');
var connectionString;

if(process.env.DATABASE_URL) {//connecting to outside heroku database
  pg.defaults.ssl = true;
  connectionString = process.env.DATABASE_URL;
} else {//connecting to local database before being connected to heroku for testing purposes
  connectionString = 'postgress://localhost:5432/patroni_tables';
}

router.post("/*", function(req,res){
  console.log("totally patroni routoni");
  var patronus_name = req.body.patronus_name;

  pg.connect(connectionString, function(err, client, done){
    if (err){
      console.log('error connecting to DB:', err);
      res.status(500).send(err);
      done();
      return;

    }
    var query = client.query('INSERT INTO tbl_patroni (patronus_name) VALUES ($1);',[patronus_name]);

    query.on('end', function(){
      done();
    });

    query.on('error', function(error){
      console.log("error inserting patronus into DB:", error);
      res.status(500).send(error);
      done();
    });
  })
  res.send("you got to patroni champ");
});



router.get("/test/*",function(req,res){
  var id = req.params[0];
  var results=[];

  pg.connect(connectionString, function(err, client, done){
    var query = client.query('SELECT * FROM tbl_patroni WHERE patronus_id = $1;', [id]);

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




router.get("/*", function(req,res){
  console.log("hey you got get got goot patronus");
  pg.connect(connectionString, function(err, client, done){

    if (err){
      console.log('error connecting to DB:', err);
      res.status(500).send(err);
      done();
      return;
    }

    var results=[];
    var query = client.query('SELECT * FROM tbl_patroni;');

    query.on('row', function(row){
      console.log("we got a row",row);
      results.push(row);
    });

    query.on('end', function(){
      res.send(results);
      done();
    });

    query.on('error', function(error){
      console.log("error pulling patronjus from DB:", error);
      res.status(500).send(error);
      done();
    });
  })
});

module.exports = router;
