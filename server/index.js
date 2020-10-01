require("dotenv").config();
const express = require("express");
const io = require("./socket");
const mongoose = require("mongoose");
const cors = require('cors');
const multer = require("./MulterConfig");
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);
const cloudinary = require("cloudinary").v2;

const routes = require("./routes/index");
const User = require('./models/user');

const app = express();

app.use(express.json());
app.use(cors({ origin: 'http://localhost:3000', credentials: true })); //use before routes
app.use(multer.multer({ storage: multer.fileStorage, fileFilter: multer.fileFilter }).single('newImg'));


const MONGO_URI = `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@cluster0.efyra.mongodb.net/<dbname>?retryWrites=true&w=majority`;

// SESSION CONFIG
const store = new MongoStore({
  url: MONGO_URI,
  collection: 'sessions'
}) 

//SESSION Config
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

//Image Hosting Cofig
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
});


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
      console.log("New Socket Connection: ", socket.id);
      
      socket.on("startChat", data => {
        console.log(`Chat started with ${data.person}`);
        socket.emit("startChat")
      })
      // socket.on("join", chatRoomId => {
      //   socket.join(chatRoomId);
      // })
    });
  })
  .catch(err => console.log(err));
