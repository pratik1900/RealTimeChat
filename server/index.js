require("dotenv").config();
const express = require("express");
const io = require("./socket");
const mongoose = require("mongoose");
const cors = require('cors');
const multer = require("./MulterConfig").multer;
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);

const routes = require("./routes/index");
const User = require('./models/user');

const app = express();

app.use(express.json());
app.use(cors({ origin: 'http://localhost:3000', credentials: true })); //use before routes
app.use(multer({ storage: multer.fileStorage, fileFilter: multer.fileFilter }).single('image'));


const MONGO_URI = `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@cluster0.efyra.mongodb.net/<dbname>?retryWrites=true&w=majority`;

// SESSION CONFIG
const store = new MongoStore({
  url: MONGO_URI,
  collection: 'sessions'
}) 

app.use(session({ 
  secret: process.env.SESSION_SECRET, 
  resave: false, 
  saveUninitialized: false, 
  cookie: {
    maxAge: 24 * 60 * 60 * 1000,
    httpOnly: true, 
    // secure: true
  },
  store: store
}));


app.use(routes);


// --*--





mongoose
  .connect(MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(result => {
    console.log("Connected to DB.");
    const server = app.listen(5000, () => console.log("Server started!"));
    io.init(server);
    io.getIO().on("connect", socket => {
    // console.log(socket.client.id)
    console.log(socket.id);
    // req.session.user.socket_id = socket.id;
    // req.session.save();
    socket.emit("login", "You are connected!");
    });
  })
  .catch(err => console.log(err));
