import quic from "node-quic";

//const port = 1234;
//const address = "127.0.0.1"; // default
const gQuicServerLaunch = (host, port) => {
  console.log("running gQUIC server");
  return quic
    .listen(port, host)
    .then(() => {})
    .onError(error => {})
    .onData((data, stream, buffer) => {
      //console.log(data); // To speed up data transfer, supress console
    });
};

export { gQuicServerLaunch };
