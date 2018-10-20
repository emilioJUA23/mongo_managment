const express = require('express');
const app = express();
const Rol = require('../../../../schemas/security/rol');
const {verificarToken} = require('../../../../middleware/authentication');

app.post('/api/v1/security/rol', function (req, res) {
    let body = req.body;
    let rol = new Rol({
        nombre: body.nombre,
        descripcion: body.descripcion,
        fechaDeIngreso: body.fechaDeIngreso,
        usuarioDeIngreso: body.usuarioDeIngreso,
    });

    rol.save((err, rolDB) => {
        if (err){
          return res.status(400).json({
              ok: false,
              err
          });
        }
        res.json({
            ok: true,
            rol: rolDB
        });
    });
});

module.exports = app;