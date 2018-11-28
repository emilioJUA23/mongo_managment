const express = require('express');
const app = express();
const {  verificarToken } = require('../../../../middleware/authentication');
var MongoClient = require('mongodb').MongoClient;

app.get("/api/v1/survey/instrument",[verificarToken], (req, res) => {
  let desde = parseInt(req.query.desde) || 0;
  let limite = parseInt(req.query.limite) || 5;
  GetInstruments(desde,limite).then(function (results) {
    res.writeHead(200, {
      "Content-Type": "application/json"
    });
    res.write(JSON.stringify(results));
    res.end();
  })
});

app.post('/api/v1/survey/instrument',[verificarToken], function (req, res) {
  var survey_answer = req.body;
  survey_answer.fechaDeCreacionDeEncuesta = Date.now();
  survey_answer.locale = "es";
  console.log(survey_answer);
  insertInstrument(survey_answer)
  res.send(JSON.stringify(survey_answer));
});

function insertInstrument(myobj) {
  MongoClient.connect(process.env.URLDB, function (err, db) {
    if (err) throw err;
    var dbo = db.db(process.env.NAMEDB);
    console.log("connected to Database");
    var myquery = {
      "title": myobj.title
    };
    dbo.collection("surveys").deleteMany(myquery, function (err, obj) {
      if (err) throw err;
      console.log(`${obj.result.n} document(s) deleted`);
      dbo.collection("surveys").insertOne(myobj, function (err, res) {
        if (err) throw err;
        console.log("1 document inserted");
        db.close();
      });
    });
  });
}

function GetInstruments(desde, limite) {
  return new Promise(function (resolve, reject) {
    MongoClient.connect(process.env.URLDB, function (err, db) {
      if (err) return reject('Fallo la conexion a la base de datos');
      console.log("connected to Database");
      var dbo = db.db(process.env.NAMEDB);
      dbo.collection("surveys")
      .find({})
      .sort({fechaDeCreacionDeEncuesta: -1})
      .limit(limite)
      .skip(desde)
      .toArray(function (err, result) {
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