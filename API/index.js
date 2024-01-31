const express = require("express");
require("./db");
// import express from "express";
// import "./db/index.js";
const auth = require("./routes/auth");
const audio = require("./routes/audio");
const favorite = require("./routes/favorite");
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use("/auth", auth);
app.use("/audio", audio);
app.use("/favorite", favorite);
app.use("/", (req, res) => {
  res.send("main route hitted");
});

app.listen(3000, () => {
  console.log("listeng");
});
