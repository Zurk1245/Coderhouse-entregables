const mongoose = require('mongoose');


async function conectarMongo(mongoUrl) {
  await mongoose.connect(mongoUrl);
}

module.exports = { conectarMongo }