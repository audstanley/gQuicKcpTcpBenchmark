const net = require("net");
const tcpServerPromise = (host, port) => {
  const serverSettings = { host: host, port: port, exclusive: true };
  return new Promise((resolve, reject) => {
    const server = net.createServer(socket => {
      //console.log("client connected");
      //   socket.end("goodbye\n");
      socket.on("end", () => {
        console.log("client disconnected");
      });
      socket.on("data", data => {
        // if (data.length > 5) {
        //   console.log(`DATA_RECEIVED: ${data.toString().slice(0, 5)}`);
        // }
      });
    });
    server.on("error", err => {
      reject(err);
    });
    server.listen(serverSettings, () => {
      console.log(`opened tcp server on ${host}:${port}`);
      resolve(server);
    });
  });
};

export { tcpServerPromise };
