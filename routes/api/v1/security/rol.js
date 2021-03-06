const express = require('express');
const app = express();
const Rol = require('../../../../schemas/security/rol');
const {verificarToken} = require('../../../../middleware/authentication');

/**
 * Creacion de un rol
 */
app.post('/api/v1/security/rol', [verificarToken],function (req, res) {
    let body = req.body;
    let user = req.usuario;
    let rol = new Rol({
        nombre: body.nombre,
        descripcion: body.descripcion,
        fechaDeIngreso: Date.now(),
        usuarioDeIngreso: user._id,
        vistas: body.vistas
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

app.get('/api/v1/security/rol/all', [verificarToken], function (req, res) {
    let condicion = {estado:true};
    Rol.find(condicion, 'nombre _id')
    .exec((err, data) => {
         if (err){
             return res.status(400).json({
                 ok: false,
                 err
             });
         }
         res.json({
            ok:true,
            data
        });
    });
});

/**
 * Pagineo del rol
 */
app.post('/api/v1/security/rol/all', [verificarToken], function (req, res) {
    let body = req.body;
    let desde = body.start;
    let limite = body.length;
    
    let condicion = {estado:true};
    
    Rol.find(condicion, 'nombre descripcion')
    .sort('nombre')
    .limit(limite)
    .skip(desde)
    .exec((err, data) => {
         if (err){
             return res.status(400).json({
                 ok: false,
                 err
             });
         }
         Rol.count(condicion, (err, recordsFiltered) =>{
            if (err){
                return res.status(400).json({
                    ok: false,
                    err
                });
            }
            Rol.count({}, (err, recordsTotal) =>{
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

/**
 *  Servicio para actualizar un rol
 */
app.put('/api/v1/security/rol/:id', [verificarToken], function (req, res) {
    let id = req.params.id;
    let body = req.body;
    delete body.usuarioDeIngreso;
    delete body._id;

    Rol.findByIdAndUpdate(id, body,{new: true, runValidators: true}, (err, usuario) =>{
      if (err){
          console.log(err);
          return res.status(400).json({
              ok: false,
              err
          });
      }
      res.json({
          ok: true,
          usuario
      });
    });
});

/**
 * Servicio para eliminar un rol
 */
app.delete('/api/v1/security/rol/:id', [verificarToken], (req, res) => {
    let id =  req.params.id;
    let usuario = req.usuario;
    let body = {estado:false, usuarioDeActualizacion: usuario.id, fechaDeActualizacion: new Date()};
    Rol.findByIdAndUpdate(id, body,{new: true}, (err, rol) =>{
      if (err){
          return res.status(400).json({
              ok: false,
              err
          });
      }
      if (rol === null){
          return res.status(400).json({
              ok: false,
              err:  {message:"rol no encontrado"}
          });
      }
      res.json({
          ok: true,
          rol
      });
    });
});

/**
 *  Servicio para obtener un rol especifico
 */
app.get('/api/v1/security/rol/:id', verificarToken, (req, res) => {
    let id =  req.params.id;
     Rol.findById(id)
        .populate("vistas")
        .exec((err, data) =>{
            if (err){
                return res.status(400).json({
                    ok: false,
                    err
                });
            }
            if (data ===null){
                return res.status(400).json({
                    ok: false,
                    err:  {message:"rol no encontrado"}
                });
            } 
             res.json({
                ok: true,
                rol: data
            });
        });
});

module.exports = app;