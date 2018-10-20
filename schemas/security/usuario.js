const moongose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

let Schema = moongose.Schema;

let usuarioSchema = new Schema({
    primerNombre: {
        type: String,
        required: [true, 'El primer nombre es necesario']
    },
    segundoNombre: {
        type: String,
    },
    primerApellido: {
        type: String,
        required: [true, 'El primer apellido es necesario']
    },
    segundoApellido: {
        type: String,
    },
    email:{
        type: String,
        unique: true,
        required: [true, 'El correo es necesario']
    },
    password:{
        type: String,
        required: [true, 'La contrasena es obligatorio']
    },
    estado: {
        type: Boolean,
        default: true
    },
    rol: {
        type: Schema.Types.ObjectId,
        ref: 'Rol',
        required: false
    },
});

usuarioSchema.methods.toJSON = function() 
{
    let user = this;
    let userObject = user.toObject();
    delete userObject.password;

    return userObject;
};

usuarioSchema.plugin( uniqueValidator, { message:  '{PATH} debe ser unico'} );

module.exports = moongose.model('Usuario', usuarioSchema);