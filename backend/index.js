const config = require("./config/config");
const mongoose = require("mongoose");
const app = require("./app");
const logger = require("./config/logger");
const dotenv = require('dotenv');
dotenv.config();


app.listen(config.port, () =>
  console.log(`App listening on port 8082!`),
);

mongoose.connect(config.mongoose.url, { useNewUrlParser: true, useUnifiedTopology: true}).then(() => {
  console.log("Connected to MongoDB")
});

const unexpectedErrorHandler = (error) => {
  logger.error(error);
};

process.on("uncaughtException", unexpectedErrorHandler);
process.on("unhandledRejection", unexpectedErrorHandler);
