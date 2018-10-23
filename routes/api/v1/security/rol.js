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

app.post('/api/v1/security/rol/all', [verificarToken], function (req, res) {
    let body = req.body;
    let desde = body.start;
    let limite = body.length;
    
    let condicion = {estado:true};
    console.log({desde,limite, condicion});
    
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

app.put('/api/v1/security/rol/:id', [verificarToken], function (req, res) {
    let id = req.params.id;
    let body = req.body;

    Rol.update(
        { "_id": id},
        { $push: { roles: { $each: body.push } } },
        function (err, raw) 
        {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            }
            Rol.update(
                { "_id": id},
                { $pullAll: { roles: { $each:  body.pull } } },     
                function (err, raw) 
                {
                    if (err) {
                        return res.status(400).json({
                            ok: false,
                            err
                        });
                    }
                    res.json({
                        ok: true,
                        message: "Vistas actualizado"
                    });
                }
            );
        }
    );
});

app.delete('/api/v1/security/rol/:id', [verificarToken], (req, res) => {
    let id =  req.params.id;
    let body = {estado:false};
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

module.exports = app;