const express = require('express');
const app = express();
const {
    verificarToken
} = require('../../../../middleware/authentication');
var MongoClient = require('mongodb').MongoClient;

//declaracion de los servicios API
app.get("/api/v1/survey/answer",[verificarToken], (req, res) => {
    GetSurveys().then(function (results) {
        res.writeHead(200, {
            "Content-Type": "application/json"
        });
        res.write(JSON.stringify(results));
        res.end();
    })
});

app.post('/api/v1/survey/answer',[verificarToken], function(req, res) {
    var survey_answer = req.body;
    let user = req.usuario;
    survey_answer.autorDeEncuesta = user.email;
    insertSurvey(survey_answer)
    res.send(JSON.stringify(survey_answer));
});


//levantamos la conexion a la base de datos
function insertSurvey(myobj)
{
    MongoClient.connect(process.env.URLDB, function(err, db) {
        if (err) throw err;
        console.log("connected to Database");
        var dbo = db.db(process.env.NAMEDB);
        dbo.collection("answers").insertOne(myobj, function(err, res) {
          if (err) throw err;
          console.log("1 document inserted");
          db.close();
        });
      });
}

function GetSurveys() {
    return new Promise(function (resolve, reject) {
        MongoClient.connect(process.env.URLDB, function (err, db) {
            if (err) return reject('Fallo la conexion a la base de datos');
            console.log("connected to Database");
            var dbo = db.db(process.env.NAMEDB);
            dbo.collection("answers").find({}).toArray(function (err, result) {
                if (err) return reject('Fallo el query a la base de datos');
                resolve(result);
                console.log("query executed");
                db.close();
                console.log("conection Closed");
            })
        })
    })
}

module.exports = app;