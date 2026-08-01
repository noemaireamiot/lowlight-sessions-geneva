/**
 * CSV serialisation for the admin exports.
 *
 * Separator is `;` and the file starts with a UTF-8 BOM. Both are for Excel's
 * benefit: a French/Swiss Excel opens comma-separated files as a single column,
 * and without the BOM it mangles accented characters. Google Sheets and
 * LibreOffice detect `;` on their own.
 */

const SEPARATOR = ";";
const BOM = "﻿";

function escapeCell(value: unknown): string {
  if (value === null || value === undefined) return "";

  let text = value instanceof Date ? value.toISOString() : String(value);

  // Normalise line endings but keep them: RFC 4180 allows newlines inside a
  // quoted field, so a multi-line message survives intact.
  text = text.replace(/\r\n?/g, "\n").trim();

  // A leading =, +, - or @ makes Excel treat the cell as a formula. Prefixing an
  // apostrophe keeps the text intact and defuses CSV injection.
  if (/^[=+\-@\t]/.test(text)) text = `'${text}`;

  if (text.includes(SEPARATOR) || text.includes('"') || text.includes("\n")) {
    return `"${text.replace(/"/g, '""')}"`;
  }
  return text;
}

export function toCsv(headers: string[], rows: unknown[][]): string {
  const lines = [headers.map(escapeCell).join(SEPARATOR)];
  for (const row of rows) {
    lines.push(row.map(escapeCell).join(SEPARATOR));
  }
  return BOM + lines.join("\r\n") + "\r\n";
}

/** Response with the headers a browser needs to download rather than display. */
export function csvResponse(filename: string, body: string): Response {
  return new Response(body, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="${filename}"`,
      "Cache-Control": "no-store",
    },
  });
}

/** `newsletter-2026-08-01.csv` — sortable and unambiguous. */
export function datedFilename(prefix: string): string {
  return `${prefix}-${new Date().toISOString().slice(0, 10)}.csv`;
}
