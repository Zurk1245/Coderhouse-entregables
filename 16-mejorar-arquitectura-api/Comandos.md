# Comandos utilizados para armar el balanceador de carga:
1. pm2 start index.js --name="Server1" --watch -- --port 8080 --modo FORK
2. pm2 start index.js --name="Server1 - api/randoms" --watch -i max -- --port 8082 --modo CLUSTER
3. pm2 start index.js --name="Server2 - api/randoms" --watch -i max -- --port 8083 --modo CLUSTER
4. pm2 start index.js --name="Server3 - api/randoms" --watch -i max -- --port 8084 --modo CLUSTER
5. pm2 start index.js --name="Server4 - api/randoms" --watch -i max -- --port 8085 --modo CLUSTER

# Comandos para los test de performance y tests de carga:
1. node --prof index.js
2. artillery quick --count 20 -n 50 "http://localhost:8080/info" > artillery_1.txt
3. node.exe --prof-process isolate-00000219693DCEC0-17520-v8.log > result_prof_1.txt
4. node --prof index.js
5. artillery quick --count 20 -n 50 "http://localhost:8080/info/debug" > artillery_2.txt
6. node.exe --prof-process isolate-0000017E0D4B92B0-21968-v8.log > result_prof_2.txt