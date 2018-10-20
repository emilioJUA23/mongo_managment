/**
 * Configuración de puerto
 */
process.env.PORT =  process.env.PORT || 3000;

/**
 * Definición del entorno
 */
process.env.NODE_ENV = process.env.NODE_ENV  || 'dev';

/**
 * Dirección a la base de datos
 */
process.env.URLDB = (process.env.NODE_ENV === 'dev') ?  'mongodb://admin:admin123456@ds127293.mlab.com:27293/iarna-proyect' : 'mongodb://admin:admin123456@ds127293.mlab.com:27293/iarna-proyect';


/**
 * Vencimiento del token
 */
process.env.CADUCIDAD_TOKEN = 60 * 60 * 24 * 30;
process.env.SEED = (process.env.NODE_ENV === 'dev') ? "3st3-35-3l-s33d-d3-d3s4r0ll0":"3st3-35-3l-s33d-d3-d3s4r0ll0";

/**
 * Configuración de pagineo
 */
process.env.DESDE = 0;
process.env.LIMITE = 5;