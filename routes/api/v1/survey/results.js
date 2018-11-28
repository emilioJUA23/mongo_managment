const express = require('express');
const app = express();
const { verificarToken } = require('../../../../middleware/authentication');
var MongoClient = require('mongodb').MongoClient;
const fs = require('fs');
const uuidv1 = require('uuid/v1');

app.get("/api/v1/survey/results/:id",[verificarToken], (req, res) => {
    var id = req.params.id;
    GetResults(id).then(function (results) {
        console.log(results);
        var jsonexport = require('jsonexport');
        var filename = `${uuidv1()}.csv`;
        jsonexport(results, function (err, csv) {
            if (err) return console.log(err);
            fs.writeFile(`${__dirname}\\${filename}`, csv,{flag: 'w'}, function (err) {
                if (err)
                    return console.log(err);
                res.download(`${__dirname}\\${filename}`, function (err) {
                    if (err) {
                        throw err;
                    }
                 fs.unlink(`${__dirname}\\${filename}`,(err)=>{
                     if(err) console.log(err);
                 })
                });
            });
        });

    })
});

function GetResults(ins_id)
{
  return new Promise(function(resolve,reject){
    MongoClient.connect(process.env.URLDB, function(err, db) {
        if (err) return reject('Fallo la conexion a la base de datos');
        console.log("connected to Database");
        var dbo = db.db(process.env.NAMEDB);
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

module.exports = app;