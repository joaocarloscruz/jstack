#!/usr/bin/env node
// Appends one row to a show-me-your-work decision log (TSV).
// Usage: node log.mjs <logfile> <phase> <decision> <why> <evidence> <result>

import { appendFileSync, existsSync, mkdirSync, statSync } from "node:fs";
import { dirname } from "node:path";

const args = process.argv.slice(2);
if (args.length !== 6) {
  process.stderr.write("usage: node log.mjs <logfile> <phase> <decision> <why> <evidence> <result>\n");
  process.exit(1);
}

const [logfile, ...cells] = args;
mkdirSync(dirname(logfile), { recursive: true });

// Append the header rather than overwrite: a false "missing" costs one stray line, not the log.
if (!existsSync(logfile) || statSync(logfile).size === 0) {
  appendFileSync(logfile, "ts\tphase\tdecision\twhy\tevidence\tresult\n");
}

// Spreadsheets run cells starting with these characters as formulas.
const clean = (value) => {
  const flat = value.replace(/[\t\r\n]/g, " ");
  return /^[=+\-@]/.test(flat) ? `'${flat}` : flat;
};

const ts = new Date().toISOString().replace(/\.\d{3}Z$/, "Z");
appendFileSync(logfile, `${[ts, ...cells.map(clean)].join("\t")}\n`);
