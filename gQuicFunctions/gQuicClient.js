import quic from "node-quic";
import {
  populateLogSet,
  bufferArrayForTransport,
  convertTimeInNanoSecondsToString,
  convertBytesToStringUpToTerribytes
} from "../createBuffers/bufferBlocks";
import { clock } from "../tcpClient/tcp";

const gQuicClientLaunch = async (host, port, size) => {
  let arrayOfBytes = populateLogSet(parseInt(size), 40);
  let bufferArray = bufferArrayForTransport(arrayOfBytes);

  let clockTimes = [];
  await bufferArray.reduce(async (previousPromise, nextBuf) => {
    await previousPromise;
    let clockTimeStart = clock();
    await quic.send(port, host, nextBuf);
    let clockTimeEnd = new Promise((resolve, reject) => {
      let result = clock(clockTimeStart);
      if (result) resolve(result);
      else reject("Not working");
      resolve(result);
    });
    clockTimes.push(await clockTimeEnd);
    return clockTimeEnd;
  }, Promise.resolve());

  return clockTimes.map((elm, idx) => {
    return {
      time: elm,
      size: arrayOfBytes[idx],
      byteStr: convertBytesToStringUpToTerribytes(arrayOfBytes[idx]),
      timeStr: convertTimeInNanoSecondsToString(elm)
    };
  });

  // console.log("running gQUIC client");
  // return quic
  //   .send(port, address, data)
  //   .then(() => {})
  //   .onError(error => {})
  //   .onData((data, buffer) => {
  //     console.log("Got something back");
  //   });
};

export { gQuicClientLaunch };
