import { billingIdempotencyWebhookLedgerSpec } from "./billing-idempotency-webhook-ledger.ts";
import { borrowmeProductListNPlusOneSpec } from "./borrowme-product-list-n-plus-one.ts";
import { chatRoomNPlusOneRpsSpec } from "./chat-room-n-plus-one-rps.ts";
import { concertOutboxDltRecoverySpec } from "./concert-outbox-dlt-recovery.ts";
import { concertSeatOversellingConsistencySpec } from "./concert-seat-overselling-consistency.ts";

export const architectureSpecs = [
  concertSeatOversellingConsistencySpec,
  concertOutboxDltRecoverySpec,
  chatRoomNPlusOneRpsSpec,
  billingIdempotencyWebhookLedgerSpec,
  borrowmeProductListNPlusOneSpec,
];
