# Consideraciones
- La parte de XAMPP que incluye MySQL está desactivada para que pueda funcionar bien en Heroku (la parte de productos)
- La parte con mongo para los mensajes funciona bien
- Las URLs cambian de forma dinámica dependiendo si se está en local o en heroku
- La variable de entorno para mongo está puesta en heroku con el comando heroku config:set CONNECTION_STRING y para local se toma del archivo .env
- Link para ver la app en Heroku: http://entregable-coder.herokuapp.com