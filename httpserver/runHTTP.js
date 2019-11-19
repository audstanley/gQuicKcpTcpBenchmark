import { spawn } from "child_process";
const http = spawn("http-server");
http.on("data", console.log);

export { http };
