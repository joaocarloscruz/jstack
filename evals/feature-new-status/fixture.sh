#!/usr/bin/env bash
set -euo pipefail
mkdir -p src test

cat > package.json <<'EOF'
{ "name": "orders", "private": true, "type": "module", "scripts": { "test": "node --test" } }
EOF

cat > src/orders.js <<'EOF'
export function statusLabel(order) {
  if (order.status === "pending") return "Awaiting payment";
  if (order.status === "paid") return "Paid";
  if (order.status === "shipped") return "On its way";
  return "Unknown";
}

export function canCancel(order) {
  return order.status === "pending" || order.status === "paid";
}

export function isFinal(order) {
  return order.status === "shipped";
}

export function emailSubject(order) {
  if (order.status === "paid") return `Order ${order.id} confirmed`;
  if (order.status === "shipped") return `Order ${order.id} shipped`;
  return null;
}
EOF

cat > test/orders.test.js <<'EOF'
import { test } from "node:test";
import assert from "node:assert/strict";
import { canCancel, emailSubject, isFinal, statusLabel } from "../src/orders.js";

test("pending orders can be cancelled and send no email", () => {
  const order = { id: 7, status: "pending" };
  assert.equal(statusLabel(order), "Awaiting payment");
  assert.equal(canCancel(order), true);
  assert.equal(isFinal(order), false);
  assert.equal(emailSubject(order), null);
});

test("shipped orders are final", () => {
  const order = { id: 8, status: "shipped" };
  assert.equal(statusLabel(order), "On its way");
  assert.equal(canCancel(order), false);
  assert.equal(isFinal(order), true);
  assert.equal(emailSubject(order), "Order 8 shipped");
});
EOF
