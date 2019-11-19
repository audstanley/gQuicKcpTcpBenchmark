const bufferArrayForTransport = arrayOfSizes => {
  const arrayOfBuffers = arrayOfSizes.map(n => {
    process.stdout.write(` ${n}`);
    return bufferPromise(n);
  });
  return arrayOfBuffers;
};

const bufferPromise = n => {
  return new Promise((resolve, reject) => {
    if (n < 0) {
      reject(`Make sure the Bytes are not negative`);
    } else {
      resolve(new Buffer.alloc(n, 35)); // ascii 35 = "#"
    }
  });
};

const populateLogSet = (bytes, split) => {
  const arrayOfBytes = Array.from(
    Array(split),
    (_, x) => Math.round(Math.pow(bytes, (x + 1) / split)) // set the max [bytes], and this will make a log set of bytes to send UP TO the bytes value.
  );
  return arrayOfBytes;
};

const convertBytesToStringUpToTerribytes = bytes => {
  const lengthOfInt = Math.ceil(Math.log10(bytes + 1)); // Mathimatically get the length of an Integer.
  if (lengthOfInt >= 1 && lengthOfInt <= 3) {
    return `${bytes}bytes`;
  } else if (lengthOfInt >= 4 && lengthOfInt <= 6) {
    return `${(bytes / 1000).toPrecision(3)}Kb`;
  } else if (lengthOfInt >= 7 && lengthOfInt <= 9) {
    return `${(bytes / 1000000).toPrecision(3)}Mb`;
  } else if (lengthOfInt >= 10 && lengthOfInt <= 12) {
    return `${(bytes / 1000000000).toPrecision(3)}Gb`;
  } else if (lengthOfInt >= 13 && lengthOfInt <= 15) {
    return `${(bytes / 1000000000000).toPrecision(3)}Tb`;
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
  bufferArrayForTransport,
  convertTimeInNanoSecondsToString,
  convertBytesToStringUpToTerribytes,
  populateLogSet
};
