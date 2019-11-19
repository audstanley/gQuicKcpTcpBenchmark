const args = require("args");

args
  .option("option", 'Either "server" mode, Or "client" mode')
  .option("clientPort", "The port on which the client will be running on")
  .option("serverPort", "The port on which the server will be running on")
  .option("dataSize", "the size of data chunks in Kb, 1Mb default", 1000);

const flags = args.parse(process.argv);
console.log(flags);
