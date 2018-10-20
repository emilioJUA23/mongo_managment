const moongose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

let Schema = moongose.Schema;

let rolSchema = new Schema({
    nombre: {
        type: String,
        required: [true, 'El nombre es necesario']
    },
    descripcion: {
        type: String,
        required: [true, 'La descripción es necesario']
    },
    fechaDeIngreso: {
        type: Date,
        required: [true, 'La fecha de ingreso es necesario']
    },
    usuarioDeIngreso: {
        type: Schema.Types.ObjectId,
        ref: 'Usuario',
        required: false
    },
    fechaDeActualizacion: {
        type: Date
    },
    usuarioDeActualizacion: {
        type: Schema.Types.ObjectId,
        ref: 'Usuario',
        required: false
    },
    estado: {
        type: Boolean,
        default: true
    },
    vistas:[{
        type: Schema.Types.ObjectId,
        ref: 'Vista',
        required: false
    }]
});

rolSchema.plugin( uniqueValidator, { message:  '{PATH} debe ser unico'} );

module.exports = moongose.model('Rol', rolSchema);