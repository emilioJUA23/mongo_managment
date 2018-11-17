const puerto ={
    alias:  'p',
    demand: true,
    desc: "puerto"
};

const argv = require('yargs')
    .command('server', 'puerto para correr la aplicación',{puerto} )
    .help()
    .argv;

 let getComando = () => argv._[0];

 module.exports = {argv, getComando}