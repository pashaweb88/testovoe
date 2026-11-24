import { classify } from "./mock-ai.mjs";
import { AllowedTopics, MODEL_TIMEOUT_MS, Status } from "./statuses.mjs";

const MANUAL_REVIEW = {
  status: Status.MANUAL_REVIEW,
  topic: null,
  draft: null,
};

export function parseTriageInput(rawBody) {
  let body;
  try {
    body = JSON.parse(rawBody);
  } catch {
    return { ok: false };
  }

  if (body === null || typeof body !== "object" || Array.isArray(body)) {
    return { ok: false };
  }

  const { text } = body;
  if (typeof text !== "string" || text.trim() === "") {
    return { ok: false };
  }

  return { ok: true, text };
}

function isValidModelResult(result) {
  return (
    result !== null &&
    typeof result === "object" &&
    !Array.isArray(result) &&
    AllowedTopics.has(result.topic) &&
    typeof result.draft === "string" &&
    result.draft.trim() !== ""
  );
}

export async function triage(text) {
  try {
    const raw = await classify(text, { signal: AbortSignal.timeout(MODEL_TIMEOUT_MS) });
    let result;
    try {
      result = JSON.parse(raw);
    } catch {
      return MANUAL_REVIEW;
    }

    if (!isValidModelResult(result)) {
      return MANUAL_REVIEW;
    }

    return {
      status: Status.READY,
      topic: result.topic,
      draft: result.draft,
    };
  } catch {
    return MANUAL_REVIEW;
  }
}
