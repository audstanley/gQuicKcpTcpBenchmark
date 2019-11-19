import quic from "node-quic";

const port = 1234;
const address = "127.0.0.1"; // default

let data = Buffer.alloc(10, 35);
quic
  .send(port, address, data)
  .then(() => {})
  .onError(error => {})
  .onData((data, buffer) => {
    console.log("Got something back");
  });
