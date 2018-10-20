const express = require('express');
const app = express();
const Vista = require('../../../../schemas/security/vista');
const {verificarToken} = require('../../../../middleware/authentication');

app.post('/api/v1/security/vista', function (req, res) {
    let body = req.body;
    let vista = new Vista({
        nombre: body.nombre,
        descripcion: body.descripcion,
        fechaDeIngreso: body.fechaDeIngreso,
        usuarioDeIngreso: body.usuarioDeIngreso,
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