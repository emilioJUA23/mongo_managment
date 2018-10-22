const express = require('express');
const bcrypt = require('bcrypt');
const app = express();
const _ = require('underscore');
const Usuario = require('../../../../schemas/security/usuario');
const {verificarToken} = require('../../../../middleware/authentication');

app.post('/api/v1/security/usuario', [verificarToken], function (req, res) {
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

app.post('/api/v1/security/usuario/all', [verificarToken], function (req, res) {
    let body = req.body;
    let desde = body.start;
    let limite = body.length;
    
    let condicion = {estado:true};
    console.log({desde,limite, condicion});
    
    Usuario.find(condicion, 'primerNombre segundoNombre primerApellido segundoApellido email')
    .sort('email')
    .limit(limite)
    .skip(desde)
    .exec((err, data) => {
         if (err){
             return res.status(400).json({
                 ok: false,
                 err
             });
         }
         Usuario.count(condicion, (err, recordsFiltered) =>{
            if (err){
                return res.status(400).json({
                    ok: false,
                    err
                });
            }
            Usuario.count({}, (err, recordsTotal) =>{
                if (err){
                    return res.status(400).json({
                        ok: false,
                        err
                    });
                }
                res.json({
                    ok:true,
                    dataTablesResponse:{
                        recordsTotal,
                        recordsFiltered,
                        data
                    }
                });
            });
         });
    });
});

  module.exports = app;