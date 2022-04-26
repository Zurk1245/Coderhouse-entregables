# Consideraciones
- Correr XAMPP (está configurado para el puerto 80) para que no hayan errores de bases de datos locales (mariadb para los productos)
- Nginx está configurado para el puerto 81 (para que NO CHOQUE con XAMPP)
- Para la conexión con mongodb hay que pasar el string connection con un archivo .env (hay un .env de ejemplo)

# Comando para forever:
1. forever start index.js --port 8079 --modo CLUSTER --watch