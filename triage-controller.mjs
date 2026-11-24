import { parseTriageInput, triage } from "./triage-service.mjs";
import { HttpStatus, Status } from "./statuses.mjs";

function json(response, status, body) {
  response.writeHead(status, { "Content-Type": "application/json; charset=utf-8" });
  response.end(JSON.stringify(body));
}

export async function handleTriage(request, response) {
  const chunks = [];
  for await (const chunk of request) chunks.push(chunk);
  const rawBody = Buffer.concat(chunks).toString("utf8");

  const input = parseTriageInput(rawBody);
  if (!input.ok) {
    return json(response, HttpStatus.BAD_REQUEST, { status: Status.INVALID_INPUT });
  }

  const result = await triage(input.text);
  return json(response, HttpStatus.OK, result);
}

export { json };
