# Comandos utilizados para armar el balanceador de carga:
1. pm2 start index.js --name="Server1" --watch -- --port 8080 --modo FORK
2. pm2 start index.js --name="Server1 - api/randoms" --watch -i max -- --port 8082 --modo CLUSTER
3. pm2 start index.js --name="Server2 - api/randoms" --watch -i max -- --port 8083 --modo CLUSTER
4. pm2 start index.js --name="Server3 - api/randoms" --watch -i max -- --port 8084 --modo CLUSTER
5. pm2 start index.js --name="Server4 - api/randoms" --watch -i max -- --port 8085 --modo CLUSTER