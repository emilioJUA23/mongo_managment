//declaracion de cliente mongo db y ConnectionString
var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017/";
var express = require("express");
// var cors = require('cors')
var app = express();
var bodyParser = require('body-parser');
// app.use(cors());
app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies
app.use(function(req, res, next) {
  res.header('Access-Control-Allow-Origin', req.get('Origin') || '*');
  res.header('Access-Control-Allow-Credentials', 'true');
  res.header('Access-Control-Allow-Methods', 'GET,HEAD,PUT,PATCH,POST,DELETE');
  res.header('Access-Control-Expose-Headers', 'Content-Length');
  res.header('Access-Control-Allow-Headers', 'Accept, Authorization, Content-Type, X-Requested-With, Range');
  if (req.method === 'OPTIONS') {
    console.log(req);
    return res.send(200);
  } else {
    return next();
  }
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
    var survey_answer = req.body.survey_answer;
    console.log(survey_answer);
    insertSurvey(survey_answer)
    res.send(JSON.stringify(survey_answer));
});

//levantamos el servidor
function createServer(){
    app.listen(3000, () => {
    console.log("Server running on port 3000");
    });
}

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

//ejecuccion
createServer();
