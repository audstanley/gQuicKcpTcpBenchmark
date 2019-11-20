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
import { gQuicServerLaunch } from "./gQuicFunctions/gQuicServer";
import { gQuicClientLaunch } from "./gQuicFunctions/gQuicClient";

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
  let serverStatusKCP = await runKCPTunnelServerAsAPromisifiedSubprocess(); // server
  let tcpServerListen = await tcpServerPromise("localhost", 8388); // server
  let clientStatusKCP = await runKCPTunnelClientAsAPromisifiedSubprocess(8389); // client
  let tcpClientToKCP = await tcpClientPromise("localhost", 8389, size); // client
  let gQuicServerRunPromise = await gQuicServerLaunch("127.0.0.1", 1234); // server
  let gQuicClientRunPromise = await gQuicClientLaunch("127.0.0.1", 1234, size); // client
  return Promise.all([
    serverStatusKCP,
    tcpServerListen,
    clientStatusKCP,
    tcpClientToKCP,
    gQuicServerRunPromise,
    gQuicClientRunPromise
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
    launchTheClientAndServerBinaries(100000000) // 100Mb = 100000000 bytes
      .then(arrOfPromises => {
        return {
          kcp: arrOfPromises[3],
          gquic: arrOfPromises[5]
        };
      }) // resolve the data part othe the arrayOfPromises
      .then(data => {
        console.log(`data: ${JSON.stringify(data, null, 2)}`);
        // Liner Data for KCP

        let mergedClockTimes = data.kcp
          .concat(data.gquic)
          .sort((a, b) => a.time - b.time)
          .map(e => e.time);
        let arrOfKcpData = data.kcp.map(e => e.size);

        templateLog.data.datasets[0].data = arrOfKcpData;
        templateLog.options.scales.xAxes[0].labels = data.kcp.map(
          e => e.byteStr
        );
        templateLog.options.scales.yAxes[0].labels = mergedClockTimes;
        templateLog.data.datasets[1].data = data.gquic.map(e => e.time);

        templateLin.data.datasets[0].data = arrOfKcpData;
        templateLin.options.scales.xAxes[0].labels = data.kcp.map(
          e => e.byteStr
        );
        templateLin.options.scales.yAxes[0].labels = mergedClockTimes;
        templateLin.data.datasets[1].data = data.gquic.map(e => e.time);

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

        return new Promise((resolve, reject) => {
          setTimeout(resolve, 3000);
        });
      })
      .catch(err => {
        console.log(`There was a problem running both servers: ${err}`);
      });
  }
}
