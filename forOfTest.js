const populateLogSet = (bytes, split) => {
  const arrayOfBytes = Array.from(
    Array(split),
    (_, x) => Math.round(Math.pow(bytes, (x + 1) / split)) // set the max [bytes], and this will make a log set of bytes to send UP TO the bytes value.
  );
  return arrayOfBytes;
};

const sendBytesExample = bytes => {
  return new Promise((resolve, reject) => {
    if (bytes < 0) {
      reject("bytes CANNOT be a negative value");
    } else {
      // setTimeout is REALLY going to be: client.write(someBytesOfLengthBytes, callbackResolveWhenDtaIsSentSuccessfully())
      setTimeout(() => {
        resolve(Math.floor(bytes));
      }, Math.floor(bytes / 1000));
    }
  });
};

let runTimes = async () => {
  let times = populateLogSet(100000000, 40); // 40 log slices of 100Mb
  console.log(times);
  let timesPromised = times.map(element => sendBytesExample(element));
  for (p of timesPromised) {
    await p.then(bytes =>
      console.log(convertBytesToStringUpToTerribytes(bytes))
    );
  }
};

//runTimes().catch(console.log);

const convertBytesToStringUpToTerribytes = bytes => {
  const lengthOfInt = Math.ceil(Math.log10(bytes + 1)); // Mathimatically get the length of an Integer.
  if (lengthOfInt >= 1 && lengthOfInt <= 3) {
    return `${bytes}bytes`;
  } else if (lengthOfInt >= 4 && lengthOfInt <= 6) {
    return `${(bytes / 1000).toPrecision(3)}Kb`;
  } else if (lengthOfInt >= 7 && lengthOfInt <= 9) {
    return `${(bytes / 1000000).toPrecision(3)}Mb`;
  } else if (lengthOfInt >= 10 && lengthOfInt <= 12) {
    return `${(bytes / 1000000000).toPrecision(3)}Tb`;
  } else {
    return `${bytes}bytes`;
  }
};

const convertTimeInNanoSecondsToString = ns => {
  const lengthOfInt = Math.ceil(Math.log10(ns + 1)); // Mathimatically get the length of an Integer.
  if (lengthOfInt >= 1 && lengthOfInt <= 3) {
    return `${ns}ns`;
  } else if (lengthOfInt >= 4 && lengthOfInt <= 6) {
    return `${(ns / 1000).toPrecision(3)}us`;
  } else if (lengthOfInt >= 7 && lengthOfInt <= 9) {
    return `${(ns / 1000000).toPrecision(3)}ms`;
  } else if (lengthOfInt >= 10 && lengthOfInt <= 12) {
    return `${(ns / 1000000000).toPrecision(3)}S`;
  } else if (lengthOfInt >= 13 && lengthOfInt <= 15) {
    return `${(ns / 1000000000).toPrecision(7)}S`;
  } else {
    return `${ns}ns`;
  }
};

export {
  convertTimeInNanoSecondsToString,
  convertBytesToStringUpToTerribytes,
  populateLogSet
};
