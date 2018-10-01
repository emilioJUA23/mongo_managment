//declaracion de cliente mongo db y ConnectionString
var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017/surveys";
var express = require("express");
var app = express();

//declaracion de los servicios API
app.get("/url", (req, res, next) => {
    res.json(["Tony","Lisa","Michael","Ginger","Food"]);
   });

//levantamos el servidor
function server_creation(){
    app.listen(3000, () => {
    console.log("Server running on port 3000");
    creating_apis();
    });
}

MongoClient.connect(url, function(err, db) {
  if (err) throw err;
  console.log("Database created!");
  // llamar el servidor que cree las apis que vamos a consumir.
  server_creation();
  db.close();
  console.log("DbConnection closed");
});