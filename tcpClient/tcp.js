const net = require("net");
import {
  populateLogSet,
  bufferArrayForTransport,
  convertTimeInNanoSecondsToString,
  convertBytesToStringUpToTerribytes
} from "../createBuffers/bufferBlocks";

const clock = start => {
  if (!start) return process.hrtime();
  let end = process.hrtime(start);
  let result = Math.round(end[0] * 1000000000 + end[1]);
  return result;
};

const tcpClientPromise = async (host, port, size) => {
  const arrayOfBytes = populateLogSet(size, 40);
  console.log(`Populating the Array of Bytes... this may take a while.`);
  let bufferArray = bufferArrayForTransport(arrayOfBytes);
  let clockTimes = [];
  await bufferArray.reduce(async (previousPromise, nextBuf) => {
    await previousPromise;
    let clockTime = await sendBytesOverTCPAsync(host, port, nextBuf);
    clockTimes.push(clockTime);
    return clockTime;
  }, Promise.resolve());
  return clockTimes.map((elm, idx) => {
    return {
      time: elm,
      size: arrayOfBytes[idx],
      byteStr: convertBytesToStringUpToTerribytes(arrayOfBytes[idx]),
      timeStr: convertTimeInNanoSecondsToString(elm)
    };
  });
};

const connectToClient = (host, port) => {
  return new Promise((resolve, reject) => {
    const client = net.createConnection({ host: host, port: port }, () => {
      client.setNoDelay();
      resolve(client);
    });
  });
};

const writeToTheBufferPromisified = (client, buf) => {
  console.log(
    `connected to server! Sending Buffer of length ${buf.byteLength}`
  );
  return new Promise(async (resolve, reject) => {
    let bufAfterPromised = await buf;
    let start = clock();
    let isDrained = client.write(bufAfterPromised, () => {
      if (isDrained) {
        console.log(
          `writeIsDrained, bytesWritten: ${client.bytesWritten}, bufferSize: ${client.bufferSize}, bytesRead: ${client.bytesRead}`
        );
        let endTime = clock(start);
        console.log(`endTime: ${endTime}`);
        console.log(`CLIENT SOCKET CLOSED`);
        resolve(endTime);
      } else {
        console.log(
          `SOCKET PAUSED, bytesWritten: ${client.bytesWritten}, bufferSize: ${client.bufferSize}, bytesRead: ${client.bytesRead}`
        );
      }
      //client.pause();
    });
    console.log(`isDrained: ${isDrained}`);
    client.on(`drain`, () => {
      `DRAIN EVENT, bytesWritten: ${client.bytesWritten}, bufferSize: ${client.bufferSize}, bytesRead: ${client.bytesRead}`;
      let endTime = clock(start);
      console.log(`endTime: ${endTime}`);
      console.log(`CLIENT SOCKET CLOSED`);
      client.end();
      resolve(endTime);
    });

    client.on("end", () => {
      console.log(`ENDED client connection`);
    });

    client.on("error", err => {
      console.log(`ERROR_FROM_TCP_CLIENT ${err}`);
      reject(`ERROR_FROM_TCP_CLIENT ${err}`);
    });
  });
};

const sendBytesOverTCPAsync = async (host, port, buf) => {
  const client = await connectToClient(host, port);
  return writeToTheBufferPromisified(client, buf);
};

export { tcpClientPromise, clock };
