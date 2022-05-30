const express = require("express");
const info = express.Router();
const parseArgs = require("minimist");
const options = { default: { port: 8080, modo: "FORK" } };
const args = parseArgs(process.argv.slice(2), options);
const numCPUs = require("os").cpus().length;
const compression = require("compression");

info.use(compression());

info.get("/", (req, res) => {
    const infoObject = {
        ars: Object.values(args).join(" "),
        path: process.execPath,
        plataforma: process.platform,
        process_id: process.pid,
        version_node: process.version,
        carpeta: process.cwd(),
        memoria_reservada: process.memoryUsage.rss(),
        numCPUs: numCPUs
    };

    res.render("info", infoObject);
    //cluster.worker.kill();
});

info.get("/debug", (req, res) => {
    const infoObject = {
        ars: Object.values(args).join(" "),
        path: process.execPath,
        plataforma: process.platform,
        process_id: process.pid,
        version_node: process.version,
        carpeta: process.cwd(),
        memoria_reservada: process.memoryUsage.rss(),
        numCPUs: numCPUs
      }
    
      console.log(infoObject)
    
      res.render("info", infoObject);
})

module.exports = info;