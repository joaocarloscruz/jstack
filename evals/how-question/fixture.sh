#!/usr/bin/env bash
# 19.99 * 100 is 1998.9999999999998 in floating point, so Math.floor drops a cent.
set -euo pipefail
mkdir -p src test

cat > package.json <<'EOF'
{ "name": "shop", "private": true, "type": "module", "scripts": { "test": "node --test" } }
EOF

cat > src/money.js <<'EOF'
export function toCents(amount) {
  return Math.floor(amount * 100);
}

export function formatCents(cents) {
  return `$${(cents / 100).toFixed(2)}`;
}
EOF

cat > src/cart.js <<'EOF'
import { formatCents, toCents } from "./money.js";

export function cartTotal(items) {
  const cents = items.reduce((sum, item) => sum + toCents(item.price) * item.qty, 0);
  return formatCents(cents);
}
EOF

cat > src/invoice.js <<'EOF'
import { toCents } from "./money.js";

export function invoiceLine(item) {
  return { sku: item.sku, cents: toCents(item.price) * item.qty };
}
EOF

cat > test/cart.test.js <<'EOF'
import { test } from "node:test";
import assert from "node:assert/strict";
import { cartTotal } from "../src/cart.js";

test("totals a single item", () => {
  assert.equal(cartTotal([{ price: 19.99, qty: 1 }]), "$19.99");
});

test("totals several items", () => {
  assert.equal(cartTotal([{ price: 5, qty: 2 }, { price: 0.5, qty: 3 }]), "$11.50");
});
EOF
