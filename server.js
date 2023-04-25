"use strict";

const express = require("express");
const body_parser = require("body-parser");
const axios = require("axios").default;
const app = express().use(body_parser.json());
const socket = require("socket.io");
const http = require("http");
const routes = require('./routes');

const path = require('path');

const cors = require('cors');
app.use(cors());

const httpServer = http.createServer(app);
const io = socket(httpServer, {
  cors: {
    origin: '/',
    methods: ['GET', 'POST']
  },
  path: '/socket.io'
});

routes.configure(io);
app.use(routes.router);

app.use('/', express.static(path.resolve(__dirname, 'public')));

app.get("*", (req, res) => {
  res.sendFile(path.resolve(__dirname, "public/index.html"));
});

httpServer.listen(process.env.PORT || 1337, () => console.log("webhook is listening"));