const express = require('express');
const app = express();
const Vista = require('../../../../schemas/security/vista');
const Arbol = require('../../../../schemas/helpers/arbol');
const {verificarToken} = require('../../../../middleware/authentication');
require('./../../../../schemas/helpers/nodo');

app.get('/api/v1/security/vista/tree', [verificarToken],function (req, res) {
    Arbol.findOne({nombre:"ARBOLDEVISTAS"})
    .populate({
        path: "nodos",
        select: 'text value -_id',
        populate: { path: 'children',
            select: 'text value -_id',
            populate: { path: 'children',
                select: 'text value -_id', } }
    })
    .exec((err, data) => {
      if(err) {
        console.log(err);
        return res.status(400).json({
            ok: false,
            err
        });
      }  
      res.json({
        ok: true,
        tree: data.nodos
        });
    });
});

app.post('/api/v1/security/vista', function (req, res) {
    let body = req.body;
    let vista = new Vista({
        nombre: body.nombre,
        descripcion: body.descripcion
    });

    vista.save((err, vistaDB) => {
        if (err){
          return res.status(400).json({
              ok: false,
              err
          });
        }
        res.json({
            ok: true,
            vista: vistaDB
        });
    });
});

module.exports = app;