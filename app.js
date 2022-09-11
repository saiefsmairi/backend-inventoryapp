var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var config = require("./database/db.json");
var cors = require("cors");
var mongoose = require("mongoose");
const dotenv = require('dotenv').config();
var indexRouter = require('./routes/index');
const { createServer } = require("http");
const { Server } = require("socket.io");
const User = require('./models/user')
const Notification = require('./models/notification')

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
console.log("hello")
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static('public/uploads'));

app.use(cors({ origin: true, credentials: true }));

app.use('/', indexRouter);
app.use('/users', require('./routes/userRoutes'));
app.use('/company', require('./routes/companyRoutes'));
app.use('/area', require('./routes/areaRoutes'));
app.use('/zone', require('./routes/zoneRoutes'));
app.use('/affectation', require('./routes/AffectationRoutes'));
app.use('/product', require('./routes/productRoutes'));
app.use('/notification', require('./routes/notificationRoutes'));

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

mongoose.connect(config.mongo.uri, () => {
  console.log("Connected to DATABASE");
});

const io = new Server({
  cors: {
    origin: "*"
  }
});

let onlineUsers = [];

const addNewUser = (username, socketId) => {
  !onlineUsers.some((user) => user.username === username) &&
    onlineUsers.push({ username, socketId });
};

const removeUser = (socketId) => {
  onlineUsers = onlineUsers.filter((user) => user.socketId !== socketId);
};

const getUser = (username) => {
  return onlineUsers.find((user) => user.username === username);
};




io.on("connection", (socket) => {
  console.log("connected from phone")
  socket.on("newUser", (username) => {
    console.log("newUser")
    addNewUser(username, socket.id);
    console.log(onlineUsers)


  });
  //user has many notifs
  socket.on("sendNotification", ({ senderName, receiverName, text, zone, senderFirstName, senderLastName, zonename, date }) => {
    console.log(onlineUsers)

    console.log("****zonename***")
    console.log(zonename)

    const receiver = getUser(receiverName);
    console.log("****receiver***")
    console.log(receiver)
    console.log("****receiverName***")
    console.log(receiverName)
    console.log("****senderName***")
    console.log(senderName)

    var notif = new Notification({
      sender: senderName,
      receiver: receiverName,
      text,
      zone,
      senderFirstName,
      senderLastName,
      zonename,
      date
    });
    notif.save();

    User.findByIdAndUpdate({ _id: receiverName }, { $push: { notifications: { notification: notif } } }, function (err, ff) {
      if (err) {
        console.log("error update notif")
      }

    })

    let state = "new"
    io.to(receiver.socketId).emit("getNotification", {
      senderName, receiverName, text, zonename, notif, senderFirstName, senderLastName, zone, state, date
    });

  });


  socket.on("disconnect", () => {
    console.log("someone has left")
    removeUser(socket.id);


  })
});

io.listen(4000)
// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});



module.exports = app;
