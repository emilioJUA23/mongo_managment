const moongose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

let Schema = moongose.Schema;

let nodoSchema = new Schema({
    text: {
        type: String,
        required: [true, 'El nombre del texto es necesario']
    },
    children:[{
        type: Schema.Types.ObjectId,
        ref: 'Nodo',
        required: false
    }]
});

nodoSchema.plugin( uniqueValidator, { message:  '{PATH} debe ser unico'} );

module.exports = moongose.model('Nodo', nodoSchema);