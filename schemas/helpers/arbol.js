const moongose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

let Schema = moongose.Schema;

let arbolSchema = new Schema({
    nombre: {
        type: String,
        required: [true, 'El nombre es necesario'],
        unique : true,
        dropDups: true
    },
    descripcion: {
        type: String,
        required: [true, 'La descripción es necesario']
    },
    nodos:[{
        type: Schema.Types.ObjectId,
        ref: 'Nodo',
        required: false
    }]
});

arbolSchema.plugin( uniqueValidator, { message:  '{PATH} debe ser unico'} );

module.exports = moongose.model('Arbol', arbolSchema);