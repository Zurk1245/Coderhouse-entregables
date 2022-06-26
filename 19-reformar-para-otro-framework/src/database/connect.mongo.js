const mongoose = require('mongoose');

async function conectarMongo(mongoUrl) {
    try {
        await mongoose.connect(mongoUrl);
    } catch (error) {
        console.log(error);
    }
}

module.exports = { conectarMongo };