import { spawn } from "child_process";

const runKCPTunnelClientAsAPromisifiedSubprocess = (port, host) => {
  const kcpClient = spawn("./kcpFunctions/client_linux_amd64", [
    "-r",
    `${host}:4000`,
    "-l",
    `:${port.toString()}`,
    "-mode",
    "fast3",
    "-nocomp",
    "-autoexpire",
    "900",
    "-sockbuf",
    "16777217",
    "-dscp",
    "46"
  ]); // ./kcpFunctions/client_linux_amd64 -r 0.0.0.0:4000 -l :8388 -mode fast3 -nocomp -autoexpire 900 -sockbuf 16777217 -dscp 46
  kcpClient.stdout.on("data", data => {
    //process.stdout.write(`client: ${data.toString()}`);
  });
  kcpClient.stderr.on("data", data => {
    process.stdout.write(`client: ${data.toString()}`);
  });
  kcpClient.on("close", code => {
    console.log(`client closed with code: ${code}`);
  });
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve("kcp tunnel client is now running");
    }, 20000);
  });
};

const runKCPTunnelServerAsAPromisifiedSubprocess = () => {
  const kcpServer = spawn("./kcpFunctions/server_linux_amd64", [
    "-t",
    "0.0.0.0:8388",
    "-l",
    ":4000",
    "-mode",
    "fast3",
    "-nocomp",
    "-sockbuf",
    "16777217",
    "-dscp",
    "46"
  ]);
  kcpServer.stdout.on("data", data => {
    //process.stdout.write(`server: ${data.toString()}`);
  });
  kcpServer.stderr.on("data", data => {
    process.stdout.write(`server: ${data.toString()}`);
  });
  kcpServer.on("close", code => {
    console.log(`server closed with code: ${code}`);
  });
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve("kcp tunnel server is now running");
    }, 20000);
  });
};
export {
  runKCPTunnelClientAsAPromisifiedSubprocess,
  runKCPTunnelServerAsAPromisifiedSubprocess
};
