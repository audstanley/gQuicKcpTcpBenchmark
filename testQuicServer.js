import quic from "node-quic";

const port = 1234;
const address = "127.0.0.1"; // default

quic
  .listen(port, address)
  .then(() => {})
  .onError(error => {})
  .onData((data, stream, buffer) => {
    console.log(data);
  });

// quic
//   .send(port, address, data)
//   .then(() => {})
//   .onError(error => {})
//   .onData((data, buffer) => {});
