const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config({ path: ".env" });
const config = {
  db: {
    uri: process.env.MONGO_URI,
  },
  listPerPage: 10, //for pagination
};

mongoose.Promise = global.Promise;

mongoose
  .connect(config.db.uri, {
    useNewUrlParser: true,
  })
  .then(() => {
    console.log("Database Connected Successfully!");
  })
  .catch((err) => {
    console.log("Could not connect to the database", err);
    process.exit();
  });

//exports.mongoose = mongoose;

module.exports = {
  mongoose: mongoose,
  uri: config.uri,
  listPerPage: config.listPerPage,
};
