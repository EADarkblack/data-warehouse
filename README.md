# DATA WAREHOUSE

Es una aplicación de gestión de contactos, desarrollado como proyecto final para Acamica en su modo Freelance, esta aplicación permite crear usuarios, localizaciones, compañias y contactos. Todo esto almacenado y gestionado con su propia API.

Esta aplicación se encuentra desarrollada con React Js y basada en una PWA, por lo que las configuraciones del serviceworker y el manifest ya estan listas para ser enviadas a un entorno de producción.

## Proceso de instalación

A continuación verás los requisitos necesarios para la intalación de la aplicación Data Warehouse, junto con las instrucciones de instalación y configuración del servidor.

### Pre-Requisitos:

- Tener instalado [Node JS](https://nodejs.org/es/).

- Tener instalado [MySQL](https://www.mysql.com).

- Tener instalado cualquier interfaz gráfica de MYSQL, tales como [MySQL Workbench](https://www.mysql.com/products/workbench/), [Heidy SQL](https://www.heidisql.com), [PHPMyAdmin](https://www.phpmyadmin.net) o [DBeaver](https://dbeaver.io).

- Opcional: Tener instalado [Yarn](https://yarnpkg.com/getting-started/install).

### Instalación:

1. Instala todas las dependencias de la aplicación con el siguiente comando:

<pre>npm install</pre>

_o si estas usando Yarn, este es el comando_:

<pre>yarn install</pre>

2. Una vez instalada las dependencias, crea e importa la base de datos desde el archivo **data_warehouse_DB.sql**

_Nota: Para el correcto funcionamiento de la aplicación la base de datos ya tiene guardado un usuario administrador y un archivo de imagen por defecto, estos dos datos **NO LOS ELIMINES** ya que hacer esto podria causar fallos en toda la aplicación._

3. Una vez importada la base de datos, procede a crear un archivo **.env** con la siguiente información:

<pre>
# Versión de la API
VERSION=/v1

# Puerto de la base de datos
PORT=3306

# Nombre del usuario de la base de datos
USER=your_username

# Contraseña de la base de datos
PASSWORD=your_password

# Nombre de la base de datos
DB_NAME=data_warehouse_db

# Clave de encriptación para los JWT
KEY=your_secret_key
</pre>

4. una vez creado el archivo **.env** procede a dirigirte con la terminal a la ruta de la carpeta **server**, para desde alli ejecutar el siguiente comando:

<pre>nodemon index</pre>

_Nota: La correcta conexión de la base de datos se debe demostrar cuando el servidor una vez ejecutado devuelva el siguiente mensaje por consola:_

<pre>App listening on port 4000!</pre>

5. Listo, ya con eso el servidor estaria funcionando, ahora el siguiente paso para ejecutar la aplicación de Data Warehouse es creando una nueva terminal que se encuentre en la ruta raiz de la aplicación, y ejecutando el siguiente comando:

<pre>npm run start</pre>

_o si estas usando yarn_:

<pre>yarn start</pre>

6. y ya con esto, la aplicación deberia abrir en una pestaña nueva de tu navegador.

## Inicio

Antes de empezar debes iniciar sesión con las credenciales del usuario por defecto incluido en la base de datos:

<pre>
> Correo Electronico: admin@admin.com
> Contraseña: admin
</pre>

Con este usuario podras hacer la gestión de nuevos usuarios, ya sea crear, eliminar o editar. Dentro de la aplicación podras eliminar todos los contactos excepto el usuario administrador.
## Documentación:

Si deseas hacer uso de algun servicio de la Data Warehouse API o deseas conocer como funciona esta, podras guiarte por medio de la documentación proporcionada en el archivo **data_warehouse_api.yaml**, para visualizar este documento es necesario que hagas uso de [Swagger](https://editor.swagger.io).

===============================================================================

_Desarrollado por: Wilmar Miguez_