# REST API - DIGITALIZACIÓN DE ENCUESTAS

El presente proyecto, presenta los servicios para la gestión del proyecto web:

1. Autentificación y Autorización de un usuario (Json Web Token)
2. Seguimientos de usuarios
3. Seguimientos de Roles de seguridad
4. Seguimiento de Encuestas
5. Digitalización y tabulación de respuestas

Cabe mencionar que se presenta la siguiente arquitectura del proyecto:

```
*----------*                             *---------*
|          |                             |         |
| Rest API |  <-----Client MongoDb------>| MongoDB |
|          |                             |         |
*----------*                             *---------*
```

## Antes de comenzar

Debes clonar el proyecto (Via HTTPS):
```
git clone https://github.com/emilioJUA23/mongo_managment.git
```

Debe tomarse en cuenta que el en el presente proyecto, no se instala los paquetes respectivos (Ver sección de instalación).

Así mismo debe comprender la estructura del proyecto:
* configs: Carpeta de configuraciones generales del proyecto
  * db: Script Inicial para la configuración inicial de la base de datos
  * globals: Listado de variables globales
* middleware: Sistema que enlaza los sistemas transversales del proyecto
  * authentication: Sistema transversal que autentifica y autoriza a un usuario.
* routes: Rutas de llamadas de servicios
* schemas: Esquemas utilizado en base de datos
  * usuario: Esquema que almacena todos los datos de los usuarios
  * rol: Esquema que almacena los roles respectivo del sistema
  * vista: Esquema que almacena las vistas correspondientes de la aplicación web
  * arbol: Esquema que estructura las vistas correspondientes de la aplicación web.
  * nodo: Esquema que almacena cada nodo de un árbol (En este caso hace referecia a cada vista de la aplicación web)
  * answer: Esquema que almacena las respuestas de las encuestas
  * surveys: Esquema que almacacena la estructura de la encuesta.

### Prerequesitos

Antes de comenzar a trabajar, es necesario instalar los siguientes componentes (Sistema operativo: Linux, Ubuntu):

**Nodejs**
```
sudo apt-get update
sudo apt-get install nodejs
sudo apt-get install npm
```

Posteriormente a la instalación de Nodejs, se recomienda seguir la [instalación de Docker (En el Sistema operativo: linux, Ubuntu)](https://www.digitalocean.com/community/tutorials/como-instalar-y-usar-docker-en-ubuntu-16-04-es). 

**Observación**: Se debe tomar en cuenta, que para crear una imagen de docker de producción, es necesario tener un repositorio de imagenes (Para el presente proyecto se utilizó Dockerhub).

### Instalación

Para instalar el proyecto en su local, debe ejecutar el siguiente comando:

```
cd Ruta-Proyecto
npm install
```

Este comando descargará todos los paquetes dependientes del proyecto hacia la carpeta NODE_MODULES.

Así mismo es necesario instanciar un contenedor de Mongo DB:

```
mkdir ~/data
sudo docker run -d \
 --name mongo \
 -p 27017:27017 \
 -v ~/data:/data/db mongo  
```

Comandos:
* **mkdir:** hace refencia a la carpeta en donde se creará todos los esquemas respectivos de Mongo.
* **docker run:**  Crea y ejecuta el contenedor de Mongo, con los siguientes parámetros:
  * -d: Instancia un servicio demonio (Daemon)
  * --name: Nombre del contenedor
  * -p Localhost:Contenedor : Le asigna los puertos correspondientes
  * -v localhost:Contenedor : Hace referencia a la carpetas del filesystem

#### Variables de entornos

A continuación se encontrará todos los parámetros necesarios para la ejecución del proyecto (del archivo configs/globals.js):
* PORT: Puerto en que se ejecutará la aplicación
* NODE_ENV: Variable que indica si la aplicación corre una variable de producción o de pruebas (Actualmente no tiene una funcionalidad).
* NAMEDB: Nombre de la base de datos que almacena todas los esquemas de la aplicación
* URLDB: Dirección (URL) del esquema de base de datos de MONGO (sin defenir el nombre de la base de datos)
* CADUCIDAD_TOKEN: Indica la caducidad de tiempo (Segundos) del token de autentificación
* SEED: Llave privada que desencripta la información respectiva del token
* DESDE: Variable que indica que indica el comienzo de pagineo.
* LIMITE: Variable que indica cuántos elementos traerá el pagineo
* SMTP_HOST: Variable que indica el host del servidor de correo.
* SMTP_PORT: Variable que indica el puerto del servidor de correo
* SMTP_SECURE: Variable boolena, que indica si tiene que autentificarse al servidor de correo.
* SMTP_AUTH_USER: Correo electrónico administrador
* SMTP_AUTH_PASS: Contraseña del correo electrónico
* ADMIN_PASSWORD: Contraseña por default de la aplicación (Usuario administrador)

## Ejecutar la aplicación

Para compilar la aplicación, debe ejecutar los siguientes comandos:

```
cd Ruta-Proyecto
npm start
```

**Ojo**: La aplicación comenzará a ejecutarse con las variables entorno de defecto (Ver archivo configs/globals.js)

## Built
Para crear una imagen de producción, debe seguir los siguientes pasos:

```
cd Ruta-Proyecto
docker login #Autentificación del usuario y contraseña 
docker build -t {{usuario}}/{{nombreProyecto}} .
docker push {{usuario}}/{{nombreProyecto}}
```

## Ejecutar la imagen de docker
Para crear un contenedor y ejecutar la imagen de la aplicación, debe seguir los siguientes pasos:

```
sudo docker run -d \
--name mongo-managment \
-p 8080:8080 \
-e PORT='8080' \
-e NODE_ENV='PROD' \
-e NAMEDB='iarna' \
-e URLDB='mongodb://mongo:27017' \
-e CADUCIDAD_TOKEN='2592000' \
-e SEED='3sT3-3S-3L-S33d-D3-Pr0duCc10N-p4R4-t0K3n' \
-e DESDE='0' \
-e LIMITE='5' \
-e SMTP_HOST='smtp.gmail.com' \
-e SMTP_PORT='465' \
-e SMTP_SECURE='true' \
-e SMTP_AUTH_USER='djob195@gmail.com' \
-e SMTP_AUTH_PASS='22880207DiegoOrellana' \
-e ADMIN_PASSWORD='123456' \
--link mongo:mongo \
{{usuario}}/{{nombreProyecto}}
```
Comandos:
* **docker run:**  Crea y ejecuta el contenedor de Mongo, con los siguientes parámetros:
  * -d: Instancia un servicio demonio (Daemon)
  * --name: Nombre del contenedor
  * -e key=value : Nombre y valor de una variable de entrono
  * -link local:Contenedor : Nombre DNS que permitirá comunicar con otros contenedores

## Construcción de la aplicación

* [Node.js](https://nodejs.org/es/) - Entorno de Javascript
* [Docker](https://www.docker.com/) - Manejo de contenedores


## Versión

Para el presente proyecto se realizó la versión final de los estudiantes del año 2018 de la Universidad Rafael Landívar 

## Authors

* **Luis Juaréz** - [emilioJUA23](https://github.com/emilioJUA23)
* **Diego Orellana** - [djob195](https://github.com/djob195)
* Estudiantes de la Universidad Rafael Landívar


## Agradecimiento

* Universidad Rafael Landívar 
