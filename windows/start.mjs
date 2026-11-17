import { spawn } from "node:child_process";
import { createWriteStream } from "node:fs";
import { networkInterfaces } from "node:os";
import http from "node:http";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.dirname(fileURLToPath(import.meta.url));
const port = String(process.env.PORT || 8080);
const entry = path.join(root, ".output", "server", "index.mjs");
const url = `http://127.0.0.1:${port}/`;

const addresses = [];
for (const list of Object.values(networkInterfaces())) {
  for (const item of list ?? []) {
    const family = String(item.family);
    if (item.internal || (family !== "IPv4" && family !== "4")) continue;
    addresses.push(item.address);
  }
}

console.log("");
console.log("الشيخ إخوان يعمل على هذا الجهاز");
console.log(url);
for (const address of addresses) {
  console.log(`من هاتف على نفس الواي فاي: http://${address}:${port}/`);
}
console.log("أغلق هذه النافذة لإيقاف الشيخ إخوان.");
console.log("إذا سأل ويندوز عن جدار الحماية، اسمح لـ Node على الشبكات الخاصة.");
console.log("");

function openBrowser() {
  const started = Date.now();
  const timer = setInterval(() => {
    const req = http.get(url, (res) => {
      res.resume();
      if ((res.statusCode ?? 500) < 500) {
        clearInterval(timer);
        if (process.platform === "win32") {
          spawn("cmd", ["/c", "start", "", url], {
            detached: true,
            stdio: "ignore",
            windowsHide: true,
          }).unref();
        }
      }
    });
    req.on("error", () => {
      if (Date.now() - started > 40000) clearInterval(timer);
    });
  }, 400);
}

openBrowser();

const child = spawn(process.execPath, [entry], {
  cwd: root,
  env: {
    ...process.env,
    PORT: port,
    HOST: "0.0.0.0",
    NITRO_PORT: port,
    NITRO_HOST: "0.0.0.0",
  },
  stdio: ["ignore", "pipe", "pipe"],
});

function relay(stream, target) {
  stream.on("data", (chunk) => {
    const text = String(chunk);
    if (/listening|error|Error|EADDRINUSE|ALSADEK/i.test(text)) target.write(chunk);
  });
}
relay(child.stdout, process.stdout);
relay(child.stderr, process.stderr);

const log = createWriteStream(path.join(root, "alsadek.log"), { flags: "a" });
child.stdout.pipe(log);
child.stderr.pipe(log);

child.on("exit", (code) => {
  if (code && code !== 0) {
    console.log(`توقف الخادم (${code}). راجع alsadek.log بجانب هذا الملف.`);
  }
  process.exit(code ?? 0);
});

process.on("SIGINT", () => child.kill("SIGINT"));
process.on("SIGTERM", () => child.kill("SIGTERM"));
