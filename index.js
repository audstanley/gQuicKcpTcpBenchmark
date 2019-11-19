import { http } from "./httpserver/runHTTP";
import {
  runKCPTunnelClientAsAPromisifiedSubprocess,
  runKCPTunnelServerAsAPromisifiedSubprocess
} from "./kcpFunctions/kcpPromises";
import { tcpServerPromise } from "./tcpServer/tcp";
import { tcpClientPromise } from "./tcpClient/tcp";
import args from "args";
import { templateLog, templateLin } from "./chartTemplate";
import { writeFile } from "fs";
import { spawn } from "child_process";

const launchTheKCPConnectionBinaries = async () => {
  let serverStatusKCP = await runKCPTunnelServerAsAPromisifiedSubprocess();
  let clientStatusKCP = await runKCPTunnelClientAsAPromisifiedSubprocess(8389);
  return Promise.all([serverStatusKCP, clientStatusKCP]);
};

const launchTheClientBinaries = async () => {
  let clientStatusKCP = await runKCPTunnelClientAsAPromisifiedSubprocess(8389);
  return Promise.all([clientStatusKCP]);
};

const launchTheServerBinaries = async () => {
  let serverStatusKCP = await runKCPTunnelServerAsAPromisifiedSubprocess();
  let tcpServerListen = await tcpServerPromise("localhost", 4001);
  let tcpClientToKCP = await tcpClientPromise("localhost", 8388); // problem here
  return Promise.all([serverStatusKCP, tcpServerListen, tcpClientToKCP]);
};

const launchTheClientAndServerBinaries = async size => {
  //let buf = await bufferForTransport(parseInt(size));
  let serverStatusKCP = await runKCPTunnelServerAsAPromisifiedSubprocess();
  let tcpServerListen = await tcpServerPromise("localhost", 8388);
  let clientStatusKCP = await runKCPTunnelClientAsAPromisifiedSubprocess(8389);
  let tcpClientToKCP = tcpClientPromise("localhost", 8389, size);
  return Promise.all([
    serverStatusKCP,
    tcpServerListen,
    clientStatusKCP,
    tcpClientToKCP
  ]);
};

const sendDataWithClientHandler = async (size, clientHandler) => {
  let buf = await bufferForTransport(parseInt(size));
  clientHandler.write(buf);
};

// needs to be defined before parsing args into the flags const
args
  .option("option", 'Either "server" mode, Or "client" mode')
  .option("clientPort", "The port on which the client will be running on")
  .option("serverPort", "The port on which the server will be running on")
  .option("dataSize", "the size of data chunks in Kb, 1Mb default", 1000);

const flags = args.parse(process.argv);
console.log(`flags: ${JSON.stringify(flags)}`);

if (flags.option) {
  console.log(`FLAG OPTIONS: ${flags.option}`);
  if (flags.option === "client") {
    launchTheClientBinaries().then(() => {
      console.log("client connections running");
    });
  } else if (flags.option === "server") {
    launchTheServerBinaries().then(arrOfPromises => {
      console.log("server connections running");
      // arrOfPromises[1] is the tcp server event
    });
  } else if (flags.option === "both") {
    launchTheClientAndServerBinaries(10000000) // 10Mb = 10000000 bytes
      .then(arrOfPromises => arrOfPromises[3]) // resolve the data part othe the arrayOfPromises
      .then(data => {
        console.log(`data: ${JSON.stringify(data, null, 2)}`);
        let arrOfData = data.map(e => e.size);
        templateLog.data.datasets[0].data = arrOfData;
        templateLog.options.scales.xAxes[0].labels = data.map(e => e.timeStr);
        templateLog.options.scales.yAxes[0].labels = data.map(e => e.byteStr);

        templateLin.data.datasets[0].data = arrOfData;
        templateLin.options.scales.xAxes[0].labels = data.map(e => e.timeStr);
        templateLin.options.scales.yAxes[0].labels = data.map(e => e.byteStr);

        writeFile(
          "./results/log.json",
          JSON.stringify(templateLog, null, 4),
          err => {
            if (err) throw err;
            else {
              console.log("File Saved");
            }
          }
        );

        writeFile(
          "./results/lin.json",
          JSON.stringify(templateLin, null, 4),
          err => {
            if (err) throw err;
            else {
              console.log("File Saved");
            }
          }
        );

        spawn("google-chrome", ["http://localhost:8080/results"]);
        // let results = await arrOfPromises[3];
        // console.log(`BABOOOOOSH: ${results}`);
      })
      .catch(err => {
        console.log(`There was a problem running both servers: ${err}`);
      });
  }
}
