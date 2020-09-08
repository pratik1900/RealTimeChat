//storing socket connection in a separate file so that the socket.io instance can be shared around in different files

let io;

module.exports = {
  init: server => {
    //runs only once on the main file
    io = require("socket.io")(server, { perMessageDeflate: false });  //added options object
    console.log("Socket Initialized.");
    return io;
  },
  getIO: () => {
    if (!io) {
      throw new Error("Socket.io not initialized!");
    }
    return io;
  },
};
