import { test } from "node:test";
import assert from "node:assert/strict";
import { triage } from "./triage-service.mjs";
import { Status } from "./statuses.mjs";

const MANUAL_REVIEW = {
  status: Status.MANUAL_REVIEW,
  topic: null,
  draft: null,
};

test("успех: возвращает ready с темой и черновиком", async () => {
  const result = await triage("Вопрос по доставке");

  assert.equal(result.status, Status.READY);
  assert.equal(result.topic, "delivery");
  assert.equal(typeof result.draft, "string");
  assert.ok(result.draft.trim().length > 0);
});

test("ошибка модели: возвращает manual_review", async () => {
  const result = await triage("[error]");
  assert.deepEqual(result, MANUAL_REVIEW);
});

test("таймаут модели: возвращает manual_review", async () => {
  const result = await triage("[timeout]");
  assert.deepEqual(result, MANUAL_REVIEW);
});
