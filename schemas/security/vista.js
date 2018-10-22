const moongose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

let Schema = moongose.Schema;

let vistaSchema = new Schema({
    nombre: {
        type: String,
        required: [true, 'El nombre es necesario']
    },
    descripcion: {
        type: String,
        required: [true, 'La descripción es necesario']
    },
    path: {
        type: String,
        required: [true, 'La descripción es necesario']
    }
});

vistaSchema.plugin( uniqueValidator, { message:  '{PATH} debe ser unico'} );

module.exports = moongose.model('Vista', vistaSchema);