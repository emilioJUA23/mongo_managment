const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const app = express();
const Usuario = require('../../../../schemas/security/usuario');

app.post('/api/v1/security/login', (req, res) => {
    let body = req.body;

    Usuario
    .findOne({
        email: body.email,
        estado: true
    })
    .populate({
        path: 'roles',
        match: { estado: true},
        populate: { path: 'vistas' } })
    .exec((err, usuarioDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }
        if (!usuarioDB || !bcrypt.compareSync(body.password, usuarioDB.password)) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Usuario o contrasena incorrecta'
                }
            });
        }
        let roles = usuarioDB.roles.map((rol) =>{
            return rol.nombre
        });
        let rolesVistas = usuarioDB.roles.map((rol) =>{
            return rol.vistas.map((vista)=>{
                return vista.ID
            });
        });
        let vistas = [];
        rolesVistas.forEach(rolVista => {
            vistas = [...new Set([...rolVista, ...vistas])];
        });
        let _usuario =
        {
            estado: usuarioDB.estado,
            _id: usuarioDB._id,
            primerNombre: usuarioDB.primerNombre,
            primerApellido: usuarioDB.primerApellido,
            email: usuarioDB.email,
            roles,
            vistas
        };
        let token = jwt.sign({
            usuario: _usuario
        }, process.env.SEED, {
            expiresIn: process.env.CADUCIDAD_TOKEN
        });
        _usuario.token = token;
        res.json({
            ok: true,
            usuario:_usuario
        });
    });
});

module.exports = app;