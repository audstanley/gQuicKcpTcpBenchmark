const net = require("net");

const clock = start => {
  if (!start) return process.hrtime();
  let end = process.hrtime(start);
  let result = Math.round(end[0] * 1000000 + end[1]);
  return result;
};

const tcpClientPromise = (host, port, buf) => {
  return new Promise((resolve, reject) => {
    console.log(`Launching TCP Client ${host}:${port}`);
    const client = net.createConnection({ host: host, port: port }, () => {
      // 'connect' listener.
      console.log("connected to server!");
      let start = clock();
      client.write(buf, () => {
        resolve(clock(start));
      });
    });

    client.on("end", () => {
      console.log("disconnected from server");
    });

    client.on("error", err => {
      reject(`client/tcp.js Error: ${err}`);
    });
  });
};

export { tcpClientPromise };
