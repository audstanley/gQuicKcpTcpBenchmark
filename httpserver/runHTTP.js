import { spawn } from "child_process";

const launchHttpServerForViewing = () => {
  const http = spawn("http-server");
  http.on("data", console.log);
};

export { launchHttpServerForViewing };
