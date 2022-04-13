const express = require("express");
const info = express.Router();
const parseArgs = require("minimist");
const options = { default: { port: 8080 } };
const args = parseArgs(process.argv.slice(2), options);

info.get("/", (req, res) => {
    res.render("info", {
        ars: Object.values(args).join(" "),
        path: process.execPath,
        plataforma: process.platform,
        process_id: process.pid,
        version_node: process.version,
        carpeta: process.cwd(),
        memoria_reservada: process.memoryUsage.rss()
    });
});

module.exports = info;