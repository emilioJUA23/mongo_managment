//declaracion de cliente mongo db y ConnectionString
var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017/";
var express = require("express");
var app = express();
var bodyParser = require('body-parser');
app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies

//declaracion de los servicios API
app.get("/survey/answer", (req, res, next) => {
    res.json(["Tony","Lisa","Michael","Ginger","Food"]);
   });

app.post('/survey/answer', function(req, res) {
    var survey_answer = req.body.survey_answer;
    insertSurvey(survey_answer)
    res.send(JSON.stringify(survey_answer));
});

//levantamos el servidor
function createServer(){
    app.listen(3000, () => {
    console.log("Server running on port 3000");
    // createConn();
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

//ejecuccion 
createServer();
