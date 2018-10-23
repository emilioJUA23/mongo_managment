const express = require('express');
const bcrypt = require('bcrypt');
const app = express();
const _ = require('underscore');
const Usuario = require('../../../../schemas/security/usuario');
const {verificarToken} = require('../../../../middleware/authentication');
var generator = require('generate-password');
const Utils = require('../../../../utils');

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

app.put('/api/v1/security/usuario/:id', [verificarToken], function (req, res) {
    let id = req.params.id;
    let body = req.body;
    Usuario.update(
        { "_id": id},
        { $push: { roles: { $each: body } } },
        function (err, raw) {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            }
            if (raw === null){
                return res.status(400).json({
                    ok: false,
                    err:  {message:"Usuario no encontrado"}
                });
            }
            res.json({
                ok:true,
                raw
            });
        }
     );
});

app.delete('/api/v1/security/usuario/forgetpassword', [verificarToken], (req, res) => {
    let id =  req.params.id;
    let body = {estado:false};
    Usuario.findByIdAndUpdate(id, body,{new: true}, (err, usuario) =>{
      if (err){
          return res.status(400).json({
              ok: false,
              err
          });
      }
      if (usuario === null){
          return res.status(400).json({
              ok: false,
              err:  {message:"usuario no encontrado"}
          });
      }
      res.json({
          ok: true,
          usuario
      });
    });
});

app.delete('/api/v1/security/resetpassword/:id', [verificarToken], (req, res) => {
    let id =  req.params.id;
    let body = req.body;
    body.password = bcrypt.hashSync(body.password,10);
    Usuario.findByIdAndUpdate(id, body,{new: true}, (err, usuario) =>{
      if (err){
          return res.status(400).json({
              ok: false,
              err
          });
      }
      if (usuario === null){
          return res.status(400).json({
              ok: false,
              err:  {message:"usuario no encontrado"}
          });
      }
      res.json({
          ok: true,
          usuario
      });
    });
});


app.delete('/api/v1/security/resetpassword', [verificarToken], (req, res) => {
    let id =  req.params.id;
    let body = req.body;

    Person.findOne({ 'email': body.email}, 'email', function (err, data) {
        if (err){
            return res.status(400).json({
                ok: false,
                err
            });
        }
        if (data ===null){
            return res.status(400).json({
                ok: false,
                err:  {message:"usuario no encontrado"}
            });
        }

        var password = generator.generate({
            length: 10,
            numbers: true
        });

        Utils.sendEmail(data.email, "Recuperacion de contraseña", `Tu nueva contraseña es: ${password}`, `<h1>Recuperacion de contrasena</h1><p>Tu nueva contrasena es: <b>${password}</b>`);
        password = Utils.hash(password);
        password = bcrypt.hashSync(password,10)
        Usuario.findByIdAndUpdate(data._id, {password},{new: true}, (err, usuario) =>{
            if (err){
                return res.status(400).json({
                    ok: false,
                    err
                });
            }
            res.json({
                ok: true,
                message: "Contrasena actualizada"
            });
        });
      });
});

app.get('/api/v1/security/usuario/viewmatch/:view', verificarToken, (req, res) => {
    let usuario = req.usuario;
    let view =  req.params.view;

    Usuario.
        findOne({ _id : usuario._id }).
        populate({
            path: 'roles',
            populate: { path: 'vistas' } })
        .exec((err, data) => {
            if (err){
                return res.status(400).json({
                    ok: false,
                    err
                });
            }
            if (data ===null){
                return res.status(400).json({
                    ok: false,
                    err:  {message:"usuario no encontrado"}
                });
            }    
            data.roles.forEach((rol) =>{
                if(rol.vistas.some(vista => vista.ID === view))
                {
                    res.json({
                        ok: true,
                        message: "Acceso autorizado"
                    });
                }
            });
            return res.status(403).json({
                ok: false,
                err
            });
        })
});

module.exports = app;