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
process.env.URLDB = (process.env.NODE_ENV === 'dev') ?  '' : 'mongodb://localhost:27017/iarna';


/**
 * Vencimiento del token
 */
process.env.CADUCIDAD_TOKEN = 60 * 60 * 24 * 30;
process.env.SEED = (process.env.NODE_ENV === 'dev') ? "":"3st3-35-3l-s33d-d3-d3s4r0ll0";

/**
 * Configuración de pagineo
 */
process.env.DESDE = 0;
process.env.LIMITE = 5;

/** 
 * Configuracion de SMTP
 */
process.env.SMTP_HOST = '';
process.env.SMTP_PORT = 587;
process.env.SMTP_SECURE = true;
process.env.SMTP_AUTH_USER = "";
process.env.SMTP_AUTH_PASS = "";