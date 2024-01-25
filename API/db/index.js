require("dotenv").config();

const mongoose = require("mongoose");
const { MONGO_URI } = require("../utils/variables");
// import "dotenv/config";
// import mongoose from "mongoose";

//const mongoString = process.env.MONGO_URI;

console.log(MONGO_URI);

mongoose.connect(MONGO_URI);
const database = mongoose.connection;

database.on("error", (error) => {
  console.log(error);
});

database.once("connected", () => {
  console.log("Database Connected");
});
