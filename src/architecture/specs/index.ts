import { billingIdempotencyWebhookLedgerSpec } from "./billing-idempotency-webhook-ledger.ts";
import { borrowmeProductListNPlusOneSpec } from "./borrowme-product-list-n-plus-one.ts";
import { concertOutboxDltRecoverySpec } from "./concert-outbox-dlt-recovery.ts";
import { concertSeatOversellingConsistencySpec } from "./concert-seat-overselling-consistency.ts";
import { realtimeDeliveryConsistencySpec } from "./realtime-delivery-consistency.ts";

export const architectureSpecs = [
  concertSeatOversellingConsistencySpec,
  concertOutboxDltRecoverySpec,
  realtimeDeliveryConsistencySpec,
  billingIdempotencyWebhookLedgerSpec,
  borrowmeProductListNPlusOneSpec,
];
