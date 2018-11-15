require('./configs/globals');

const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
var MongoClient = require('mongodb').MongoClient;
var url =process.env.URLDB;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies

app.use(function(req, res, next) {
    res.header('Access-Control-Allow-Origin', req.get('Origin') || '*');
    res.header('Access-Control-Allow-Credentials', 'true');
    res.header('Access-Control-Allow-Methods', 'GET,HEAD,PUT,PATCH,POST,DELETE');
    res.header('Access-Control-Expose-Headers', 'Content-Length');
    res.header('Access-Control-Allow-Headers', 'Accept, Authorization, Content-Type, X-Requested-With, Range');
    if (req.method === 'OPTIONS') {
      return res.send(200);
    } else {
      return next();
    }
  });

app.use(require('./routes'));

mongoose.connect(process.env.URLDB , (err,res) => {
    if (err) throw err;
    console.log("Base de datos online");
    //require('./configs/db/index');
});

app.listen( process.env.PORT, () => {
    console.log(`Escuchando en el puerto ${process.env.PORT}`);
});

//declaracion de los servicios API
app.get("/survey/answer", (req, res) => {
  GetSurveys().then(function(results) {
    res.writeHead(200, {"Content-Type": "application/json"});
    res.write(JSON.stringify(results));
    res.end();
    })
   });

app.post('/survey/answer', function(req, res) {
    var survey_answer = req.body;
    insertSurvey(survey_answer)
    res.send(JSON.stringify(survey_answer));
});

app.get("/survey/instrument", (req, res) => {
  GetInstruments().then(function(results) {
    res.writeHead(200, {"Content-Type": "application/json"});
    res.write(JSON.stringify(results));
    res.end();
    })
});

app.post('/survey/instrument', function(req, res) {
    var survey_answer = req.body;
    insertInstrument(survey_answer)
    res.send(JSON.stringify(survey_answer));
});

app.get("/survey/results/:id", (req, res) => {
  var id = req.params.id;
  GetResults(id).then(function(results)
  {
    console.log(results);
    var jsonexport = require('jsonexport');
    jsonexport(results,function(err, csv)
    {
      if(err) return console.log(err);
      fs = require('fs');
      console.log(csv);
      fs.writeFile('out.csv', csv, function (err) {
          if (err) 
              return console.log(err);
          res.download(__dirname + '\\out.csv', function(err){
            if (err) {
              throw err;
            }
      });
    });
});

  })
});

//levantamos la conexion a la base de datos
function insertSurvey(myobj)
{
    MongoClient.connect(url, function(err, db) {
        if (err) throw err;
        console.log("connected to Database");
        var dbo = db.db("surveys");
        dbo.collection("answers").insertOne(myobj, function(err, res) {
          if (err) throw err;
          console.log("1 document inserted");
          db.close();
        });
      });
}

function insertInstrument(myobj)
{
    MongoClient.connect(url, function(err, db) {
        if (err) throw err;
        var dbo = db.db("surveys");
        console.log("connected to Database");
        var myquery = { "title": myobj.title };
        dbo.collection("surveys").deleteMany(myquery, function(err, obj) {
          if (err) throw err;
          console.log(`${obj.result.n} document(s) deleted`);
          dbo.collection("surveys").insertOne(myobj, function(err, res) {
            if (err) throw err;
            console.log("1 document inserted");
            db.close();
          });
        });
      });
}

function GetSurveys()
{
  return new Promise(function(resolve,reject){
    MongoClient.connect(url, function(err, db) {
        if (err) return reject('Fallo la conexion a la base de datos');
        console.log("connected to Database");
        var dbo = db.db("surveys");
        dbo.collection("answers").find({}).toArray( function(err, result) {
          if (err) return reject('Fallo el query a la base de datos');
          resolve(result);
          console.log("query executed");
          db.close();
          console.log("conection Closed");
          })
        })
  })
}

function GetInstruments()
{
  return new Promise(function(resolve,reject){
    MongoClient.connect(url, function(err, db) {
        if (err) return reject('Fallo la conexion a la base de datos');
        console.log("connected to Database");
        var dbo = db.db("surveys");
        dbo.collection("surveys").find({}).toArray( function(err, result) {
          if (err) return reject('Fallo el query a la base de datos');
          resolve(result);
          console.log("query executed");
          db.close();
          console.log("conection Closed");
          })
        })
  })
}

function GetResults(ins_id)
{
  return new Promise(function(resolve,reject){
    MongoClient.connect(url, function(err, db) {
        if (err) return reject('Fallo la conexion a la base de datos');
        console.log("connected to Database");
        var dbo = db.db("surveys");
        dbo.collection("answers").find({instrument_id:ins_id}).toArray( function(err, result) {
          if (err) return reject('Fallo el query a la base de datos');
          var extract = result.map(a => a.result);
          resolve(extract);
          console.log("query executed");
          db.close();
          console.log("conection Closed");
          })
        })
  })
}