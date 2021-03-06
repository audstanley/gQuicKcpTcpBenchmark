import { launchHttpServerForViewing } from "./httpserver/runHTTP";
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

const launchTheServerBinaries = async () => {
  let serverStatusKCP = await runKCPTunnelServerAsAPromisifiedSubprocess();
  let tcpServerListen = await tcpServerPromise("localhost", 8388); // tcp => kcp server
  let gQuicServerRunPromise = await gQuicServerLaunch("127.0.0.1", 1234); // server
  let justTcpServer = await tcpServerPromise("0.0.0.0", 8390); // just tcp server
  return Promise.all([
    serverStatusKCP,
    tcpServerListen,
    gQuicServerRunPromise,
    justTcpServer
  ]);
};

const launchTheClientBinaries = async (host, size) => {
  launchHttpServerForViewing();
  let clientStatusKCP = await runKCPTunnelClientAsAPromisifiedSubprocess(
    8389,
    host
  ); // client
  let tcpClientToKCP = await tcpClientPromise("localhost", 8389, size); // tcp => kcp client
  let gQuicClientRunPromise = await gQuicClientLaunch(host, 1234, size); // client
  let justTcpClient = await tcpClientPromise(host, 8390, size); // just tcp client
  return Promise.all([
    clientStatusKCP,
    tcpClientToKCP,
    gQuicClientRunPromise,
    justTcpClient
  ]);
};

const launchTheClientAndServerBinaries = async (host, size) => {
  launchHttpServerForViewing();
  let serverStatusKCP = await runKCPTunnelServerAsAPromisifiedSubprocess(); // kcp server
  let tcpServerListen = await tcpServerPromise(host, 8388); // tcp => kcp server
  let justTcpServer = await tcpServerPromise(host, 8390); // just tcp server
  let clientStatusKCP = await runKCPTunnelClientAsAPromisifiedSubprocess(
    8389,
    host
  ); // kcp client
  let tcpClientToKCP = await tcpClientPromise(host, 8389, size); // tcp => kcp client
  let justTcpClient = await tcpClientPromise(host, 8390, size); // just tcp client
  let gQuicServerRunPromise = await gQuicServerLaunch(host, 8391); // server
  let gQuicClientRunPromise = await gQuicClientLaunch(host, 8391, size); // client
  return Promise.all([
    serverStatusKCP,
    tcpServerListen,
    clientStatusKCP,
    tcpClientToKCP,
    gQuicServerRunPromise,
    gQuicClientRunPromise,
    justTcpServer,
    justTcpClient
  ]);
};

const sendDataWithClientHandler = async (size, clientHandler) => {
  let buf = await bufferForTransport(parseInt(size));
  clientHandler.write(buf);
};

// needs to be defined before parsing args into the flags const
args
  .option("option", 'Either "server" mode, Or "client" mode')
  .option("host", "The port on which the client will be running on")
  .option("dataSize", "the size of data chunks in Kb, 1Mb default", 1000);

const flags = args.parse(process.argv);
console.log(`flags: ${JSON.stringify(flags)}`);

if (flags.option) {
  console.log(`FLAG OPTIONS: ${flags.option}`);
  if (
    flags.option === "client" &&
    flags.host != undefined &&
    flags.dataSize != undefined
  ) {
    launchTheClientBinaries(flags.host, parseInt(flags.dataSize))
      .then(arrOfPromises => {
        return {
          kcp: arrOfPromises[1],
          gquic: arrOfPromises[2],
          tcp: arrOfPromises[3]
        };
      })
      .then(data => processGraph(data, flags.host));
  } else if (flags.option === "server") {
    launchTheServerBinaries().then(arrOfPromises => {
      console.log("server connections running");
    });
  } else if (flags.option === "both") {
    launchTheClientAndServerBinaries(flags.host, parseInt(flags.dataSize)) // 100Mb = 100000000 bytes
      .then(arrOfPromises => {
        return {
          kcp: arrOfPromises[3],
          gquic: arrOfPromises[5],
          tcp: arrOfPromises[7]
        };
      }) // resolve the data part othe the arrayOfPromises
      .then(data => processGraph(data, flags.host))
      .catch(err => {
        console.log(`There was a problem running both servers: ${err}`);
      });
  }
}

const processGraph = (data, host) => {
  console.log(`data: ${JSON.stringify(data, null, 2)}`);

  let mergedClockTimes = data.kcp
    .concat(data.gquic)
    .sort((a, b) => a.time - b.time)
    .map(e => e.time);
  let arrOfKcpData = data.kcp.map(e => e.time);
  let xAxisMap = data.kcp.map(
    (e, i) =>
      `size:${e.byteStr},\nkcp time:${e.timeStr},\ngquic time: ${data.gquic[i].timeStr}\n tcp time: ${data.tcp[i].timeStr}`
  );
  let kcpTime = data.kcp.map(e => e.time);
  let gquicTime = data.gquic.map(e => e.time);
  let tcpTime = data.tcp.map(e => e.time);

  templateLog.data.datasets[0].data = kcpTime; // kcp time
  templateLog.data.datasets[1].data = gquicTime; // gquic time
  templateLog.data.datasets[2].data = tcpTime; // tcp time
  templateLog.options.scales.xAxes[0].labels = xAxisMap;
  templateLog.options.scales.xAxes[0].scaleLabel.labelString = `size on host: ${host}`;
  templateLog.options.scales.yAxes[0].labels = arrOfKcpData;

  templateLin.data.datasets[0].data = kcpTime; // kcp time
  templateLin.data.datasets[1].data = gquicTime; // gquic time
  templateLin.data.datasets[2].data = tcpTime; // tcp time
  templateLin.options.scales.xAxes[0].labels = xAxisMap;
  templateLog.options.scales.xAxes[0].scaleLabel.labelString = `size on host: ${host}`;
  templateLin.options.scales.yAxes[0].labels = arrOfKcpData;

  writeFile("./results/log.json", JSON.stringify(templateLog, null, 4), err => {
    if (err) throw err;
    else {
      console.log("File Saved");
    }
  });

  writeFile("./results/lin.json", JSON.stringify(templateLin, null, 4), err => {
    if (err) throw err;
    else {
      console.log("File Saved");
    }
  });

  spawn("google-chrome", ["http://localhost:8080/results"]);
  // let results = await arrOfPromises[3];
  // console.log(`BABOOOOOSH: ${results}`);

  return new Promise((resolve, reject) => {
    setTimeout(resolve, 3000);
  });
};
