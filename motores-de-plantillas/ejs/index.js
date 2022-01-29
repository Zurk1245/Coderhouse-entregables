const express = require("express");
const app = express();
const PORT = 8080;

app.get("/", (req, res) => {
    res.send("Hello World");
});

const server = app.listen(PORT, () => {
    console.log(`Server running on port`, PORT);
});
server.on("error", (error) => console.log(`error en el servidor ${error}`));