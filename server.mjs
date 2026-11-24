import { createServer } from "node:http";
import { readFile } from "node:fs/promises";
import { handleTriage, json } from "./triage-controller.mjs";
import { HttpStatus, Status } from "./statuses.mjs";

const html = await readFile(new URL("./index.html", import.meta.url));

createServer(async (request, response) => {
  if (request.method === "GET" && request.url === "/") {
    response.writeHead(HttpStatus.OK, { "Content-Type": "text/html; charset=utf-8" });
    response.end(html);
    return;
  }
  if (request.method === "POST" && request.url === "/api/triage") {
    try {
      await handleTriage(request, response);
    } catch {
      json(response, HttpStatus.SERVER_ERROR, { status: Status.SERVER_ERROR });
    }
    return;
  }

  return json(response, HttpStatus.NOT_FOUND, { status: Status.NOT_FOUND });

}).listen(Number(process.env.PORT || 3000), "127.0.0.1");
