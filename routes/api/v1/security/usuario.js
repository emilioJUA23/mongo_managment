const express = require('express');
const bcrypt = require('bcrypt');
const app = express();
const _ = require('underscore');
const Usuario = require('../../../../schemas/security/usuario');
const {verificarToken} = require('../../../../middleware/authentication');

app.post('/api/v1/security/usuario'/*, [verificarToken, verificarAdmin_Role]*/, function (req, res) {
    let body = req.body;
    let usuario = new Usuario({
        primerNombre: body.primerNombre,
        segundoNombre: body.segundoNombre,
        primerApellido: body.primerApellido,
        segundoApellido: body.segundoApellido,
        email: body.email,
        password: bcrypt.hashSync(body.password,10)
    });

    usuario.save((err, usuarioDB) => {
        if (err){
          return res.status(400).json({
              ok: false,
              err
          });
        }
        res.json({
            ok: true,
            usuario: usuarioDB
        });
    });
});

  
  module.exports = app;