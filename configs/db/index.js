require('../../configs/globals');

const Vista = require('../../schemas/security/vista');
const Nodo =  require('../../schemas/helpers/nodo');
const Arbol = require('../../schemas/helpers/arbol');
const Rol = require('../../schemas/security/rol');
const Usuario = require('../../schemas/security/usuario');
const Utils = require('../../utils');
const bcrypt = require('bcrypt');
const mongoose = require('mongoose');

const removeVista = async() =>{
    try {
        await Vista.remove({});
        await Nodo.remove({});
        await Arbol.remove({});
        await Rol.remove({});
        await Usuario.remove({});
    } catch (error) {
        console.log(error);
    }
}

const configurarVistas = async() =>{
    try {
        let home = {
            ID: "HOME",
            nombre: "Principal",
            descripcion: "Pantalla principal donde se encuentra el menu de opciones",
            path: "home"
        };
        let welcome = {
            ID: "WELCOME",
            nombre: "Bienvenida",
            descripcion: "Pantalla de bienvenida",
            path: "welcome"
        };
        let surveyIndex = {
            ID: "SURVEY-INDEX",
            nombre: "Indice de Encuestas",
            descripcion: "Muestra todas las encuestas realizada en el sistema",
            path: "surveyindex"
        };
        let surveyBuild = {
            ID: "SURVEY-BUILD",
            nombre: "Gestion de encuestas",
            descripcion: "Pantalla que da seguimiento a una encuesta",
            path: "surveybuild/?{id}"
        };
        let surveyVersions = {
            ID: "SURVEY-VERSIONS",
            nombre: "Versionamiento de encuestas",
            descripcion: "Pantalla que muestras las versiones de una encuesta",
            path: "surveyversions/{id}"
        };
        let configuration = {
            ID: "CONFIGURATION",
            nombre: "configuracion del sistema",
            descripcion: "Muestra todaas las opciones de configuracion del sistema",
            path: "configuration"
        };
        let userIndex ={
            ID: "USER-INDEX",
            nombre: "Listado de usuarios",
            descripcion: "Listado de usuarios del sistema",
            path: "userindex"
        };
        let userSignUp = {
            ID: "USER-SIGN-UP",
            nombre: "Creacion de usuarios",
            descripcion: "Pantalla para crear un usuario",
            path: "usersignup"
        };
        let userUpdate = {
            ID: "USER-UPDATE",
            nombre: "Actualizacion de usuarios",
            descripcion: "Pantalla para actualizar roles del usuario o eliminar usuario",
            path: "userupdate/{id}"
        };
        let rolIndex = {
            ID: "ROL-INDEX",
            nombre: "Listado de roles",
            descripcion: "Listado del roles del sistema",
            path: "rolindex"
        };
        let rolUpdate = {
            ID: "ROL-UPDATE",
            nombre: "Actualizar un rol",
            descripcion: "Actualizar o borrar un rol, asi mismo de asignar las pantallas correspondiente",
            path: "rolupdate/{id}"
        };
        let vistaIndex = {
            ID: "VISTA-INDEX",
            nombre: "Indice de vistas del sistema",
            descripcion: "Mostrar los indices correspondiente dl sistema",
            path: "vistaindex"
        };
    
        let homeVista = new Vista(home);
        let welcomeVista = new Vista(welcome);
        let surveyIndexVista = new Vista(surveyIndex);
        let surveyBuildVista = new Vista(surveyBuild);
        let surveyVersionsVista = new Vista(surveyVersions);
        let configurationVista = new Vista(configuration);
        let userIndexVista = new Vista(userIndex);
        let userSignUpVista= new Vista(userSignUp);
        let userUpdateVista = new Vista(userUpdate);
        let rolIndexVista = new Vista(rolIndex);
        let rolUpdateVista = new Vista(rolUpdate);
        let vistaIndexVista = new Vista(vistaIndex);
        console.log("Creando vistas");
        let PVhome = await homeVista.save();
        let PVwelcome = await welcomeVista.save();
        let PVsurveyIndex = await surveyIndexVista.save();
        let PVsurveyBuild = await surveyBuildVista.save();
        let PVsurveyVersions = await surveyVersionsVista.save();
        let PVconfiguration = await configurationVista.save();
        let PVuserIndex = await userIndexVista.save();
        let PVuserSignUp = await userSignUpVista.save();
        let PVuserUpdate = await userUpdateVista.save();
        let PVrolIndex = await rolIndexVista.save();
        let PVrolUpdate = await rolUpdateVista.save();
        let PVvistaIndex = await vistaIndexVista.save();

        console.log("Creando nodos");
        userIndex ={
            text: PVuserIndex.nombre,
            value: PVuserIndex._id
        };
        userSignUp = {
            text: PVuserSignUp.nombre,
            value: PVuserSignUp._id
        };
        userUpdate = {
            text: PVuserUpdate.nombre,
            value: PVuserUpdate._id
        };
        rolIndex = {
            text: PVrolIndex.nombre,
            value: PVrolIndex._id
        };
        rolUpdate = {
            text: PVrolUpdate.nombre,
            value: PVrolUpdate._id
        };
        vistaIndex = {
            text: PVvistaIndex.nombre,
            value: PVvistaIndex._id
        };
        let userIndexNodo = new Nodo(userIndex);
        let userSignUpNodo= new Nodo(userSignUp);
        let userUpdateNodo = new Nodo(userUpdate);
        let rolIndexNodo = new Nodo(rolIndex);
        let rolUpdateNodo = new Nodo(rolUpdate);
        let vistaIndexNodo = new Nodo(vistaIndex);
        let PNuserIndex = await userIndexNodo.save();
        let PNuserSignUp = await userSignUpNodo.save();
        let PNuserUpdate = await userUpdateNodo.save();
        let PNrolIndex = await rolIndexNodo.save();
        let PNrolUpdate = await rolUpdateNodo.save();
        let PNvistaIndex = await vistaIndexNodo.save();

        configuration = {
            text: PVconfiguration.nombre,
            value: PVconfiguration._id,
            children: [PNuserIndex._id, PNuserSignUp._id, PNuserUpdate._id, PNrolIndex._id, PNrolUpdate._id, PNvistaIndex._id]
        };
        let configurationNodo = new Nodo(configuration);
        let PNconfiguration = await configurationNodo.save();

        surveyVersions = {
            text: PVsurveyVersions.nombre,
            value: PVsurveyVersions._id
        };
        let surveyVersionsNodo = new Nodo(surveyVersions);
        let PNsurveyVersions = await surveyVersionsNodo.save();

        surveyBuild = {
            text: PVsurveyBuild.nombre,
            value: PVsurveyBuild._id,
            children: [PNsurveyVersions._id]
        };
        let surveyBuildNodo = new Nodo(surveyBuild);
        let PNsurveyBuild = await surveyBuildNodo.save();

        welcome = {
            text: PVwelcome.nombre,
            value: PVwelcome._id
        };
        surveyIndex = {
            text: PVsurveyIndex.nombre,
            value: PVsurveyIndex._id
        };
        let welcomeNodo = new Nodo(welcome);
        let surveyIndexNodo = new Nodo(surveyIndex);
        let PNwelcome = await welcomeNodo.save();
        let PNsurveyIndex = await surveyIndexNodo.save();
       
        home = {
            text: PVhome.nombre,
            value: PVhome._id,
            children: [PNwelcome._id, PNsurveyIndex._id, PNsurveyBuild._id, PNconfiguration._id]
        }; 
        let homeNodo = new Nodo(home);
        let PNhome = await homeNodo.save();

        let _arbol ={
            nombre: "ARBOLDEVISTAS",
            descripcion: "Arbol de flujo de navegacion en vistas",
            nodos: [PNhome._id]
        };
        let arbol = new Arbol(_arbol);
    
        console.log("Creando Arbol");
        let PArbol = await arbol.save();
    
        let rol = new Rol({
            nombre: "ADMINISTRADOR",
            descripcion: "Rol que tiene acceso a todo las funcionalidades del sistema",
            fechaDeIngreso: Date.now(),
            vistas: [ PVhome._id,
                PVwelcome._id,
                PVsurveyIndex._id,
                PVsurveyBuild._id,
                PVsurveyVersions._id,
                PVconfiguration._id,
                PVuserIndex._id,
                PVuserSignUp._id,
                PVuserUpdate._id,
                PVrolIndex._id,
                PVrolUpdate._id,
                PVvistaIndex._id]
        });
    
        console.log("Creando rol");
        let PRRol = await rol.save();
    
        let usuario = new Usuario({
            primerNombre: "Administrador",
            primerApellido: "Administrador",
            email: process.env.SMTP_AUTH_USER,
            password: bcrypt.hashSync(Utils.hash("123456"),10),
            roles: [PRRol._id]
        });
        console.log("Creando Usuario");
        let PUUsuario  = await usuario.save();   
    } catch (error) {
        console.log(error);
    }
}

const configurarTodo = async() =>{
    await removeVista();
    await configurarVistas();
    console.log("Configuracion terminada");
    mongoose.connection.close(function () {
        console.log('Mongoose connection disconnected');
      });
}
mongoose.connect(process.env.URLDB , (err,res) => {
    if (err) throw err;
    configurarTodo();
});