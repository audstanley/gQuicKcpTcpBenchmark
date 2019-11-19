let a = n => {
  return new Promise((resolve, reject) => {
    if (n < 0) reject(`nope`);
    setTimeout(() => {
      resolve(`done: ${n}`);
    }, 5000);
  });
};

let b = async () => {
  let c = [10, 20, 30, 40, 50];
  let d = c.reduce(async (previousPromise, nextId) => {
    console.log(nextId);
    await previousPromise;
    return a(nextId);
  }, Promise.resolve());
  console.log(d);
};

b();

setTimeout(() => {
  console.log(`done`);
}, 5100);
