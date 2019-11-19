import quic from "node-quic";
const port = 1234;
const address = "127.0.0.1"; // default

quic
  .listen(port, address)
  .then(() => {}) // called once server starts listening
  .onError(error => {}) // called if there's an error with the listening.
  .onData((data, stream, buffer) => {
    console.log(buffer.toString());
  }); // data here will be a stringified version of

setInterval(() => {
  quic.send(port, address, Buffer.alloc(1000, 35));
}, 1000);
