import {
  BillingExtra,
  BillingLineCharge,
  BillingSummaryResponse,
} from "@/repositories/BillingRepository"

type BillingEmailPreviewParams = {
  summary: BillingSummaryResponse
  lineCharges: BillingLineCharge[]
  softwareRental: number
  extras: BillingExtra[]
  totalCop: number
}

export function buildBillingEmailPreviewHtml({
  summary,
  lineCharges,
  softwareRental,
  extras,
  totalCop,
}: BillingEmailPreviewParams): string {
  const summaryRows: Array<[string, string]> = [
    [
      "Periodo facturado",
      `${summary.startDateLabel} al ${summary.endDateLabel}`,
    ],
    ["Servicios registrados", String(summary.totalServices)],
    ["Sesiones WhatsApp", String(summary.totalSessions)],
    [
      "Mensajes WhatsApp",
      `${summary.totalMessages} total · ${summary.totalInboundMessages} entrantes / ${summary.totalOutboundMessages} salientes`,
    ],
  ]

  const sourceRows: Array<[string, string]> = summary.serviceSources.map(
    (source) => [source.label, String(source.count)]
  )

  const chargeRows: Array<[string, string]> = [
    ...lineCharges.map(
      (charge) =>
        [charge.alias, formatCop(charge.amountCop)] as [string, string]
    ),
    ["Renta mensual", formatCop(softwareRental)],
    ...extras.map(
      (extra) =>
        [
          extra.description.trim() || "Cobro adicional",
          formatCop(extra.amountCop),
        ] as [string, string]
    ),
  ]

  const activityRows =
    summary.whatsappLines.length > 0
      ? summary.whatsappLines
        .map(
          (line) => `<tr>
        <td style="${TABLE_CELL_LEFT_STYLE}">${escapeHtml(line.alias)}</td>
        <td style="${TABLE_CELL_RIGHT_STYLE}">${line.sessions}</td>
        <td style="${TABLE_CELL_RIGHT_STYLE}">${line.inboundMessages}</td>
        <td style="${TABLE_CELL_RIGHT_STYLE}">${line.outboundMessages}</td>
      </tr>`
        )
        .join("")
      : `<tr><td colspan="4" style="${EMPTY_ROW_STYLE}">Sin actividad registrada en el periodo.</td></tr>`

  return `<div style="font-family:Arial,sans-serif;max-width:680px;margin:0 auto;background:#ffffff;border:1px solid #e6eaf2;border-radius:18px;overflow:hidden;box-shadow:0 16px 36px rgba(15,23,42,0.08);color:#344767;">
    <div style="padding:28px 30px 10px;">
      <p style="margin:0;font-size:14px;line-height:1.75;color:#344767;">
        Cordial saludo,<br><br>
        De acuerdo con nuestro acuerdo comercial, relaciono el cierre correspondiente a ${escapeHtml(
    summary.monthText
  )}, con el resumen de actividad y los valores a facturar durante el periodo comprendido entre ${escapeHtml(
    summary.startDateLabel
  )} y ${escapeHtml(summary.endDateLabel)}.
      </p>
    </div>

    <div style="padding:0 30px 30px;">
      ${buildSectionTitle("Resumen del mes")}
      ${buildKeyValueTable(summaryRows)}

      ${buildSectionTitle("Actividad por línea WhatsApp")}
      ${buildMatrixTable(
    ["Línea", "Sesiones", "Entrantes", "Salientes"],
    activityRows
  )}

      ${buildSectionTitle("Origen de servicios")}
      ${buildKeyValueTable(sourceRows)}

      ${buildSectionTitle("Detalle de cobros")}
      ${buildKeyValueTable(chargeRows)}

      <table width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse;margin-top:12px;border:1px solid #e9edf5;border-radius:14px;overflow:hidden;">
        <tr style="background:#1f2937;">
          <td style="padding:14px 18px;font-size:13px;font-weight:700;color:#ffffff;text-transform:uppercase;letter-spacing:0.04em;">Total</td>
          <td style="padding:14px 18px;font-size:16px;font-weight:700;color:#ffffff;text-align:right;">${formatCop(
    totalCop
  )}</td>
        </tr>
      </table>

      <p style="margin:28px 0 0;font-size:14px;line-height:1.7;color:#344767;">
        Cordialmente,<br>
        Alexander Camilo R<br>
        Software Developer SSR<br>
        Cel: 3103794656
      </p>

      <p style="margin:24px 0 0;font-size:12px;line-height:1.6;color:#8392ab;">
        Este correo fue generado automáticamente desde Gorda Driver.
      </p>
    </div>
  </div>`
}

function buildSectionTitle(title: string): string {
  return `<p style="margin:22px 0 10px;font-size:12px;font-weight:700;letter-spacing:0.08em;text-transform:uppercase;color:#7b809a;">${escapeHtml(
    title
  )}</p>`
}

function buildKeyValueTable(rows: Array<[string, string]>): string {
  const body = rows
    .map(
      ([label, value]) => `<tr>
      <td style="${TABLE_CELL_LEFT_STYLE}">${escapeHtml(label)}</td>
      <td style="${TABLE_CELL_RIGHT_STYLE}">${escapeHtml(value)}</td>
    </tr>`
    )
    .join("")

  return `<table width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse;border:1px solid #e9edf5;border-radius:14px;overflow:hidden;">
    ${body}
  </table>`
}

function buildMatrixTable(headers: string[], rowsHtml: string): string {
  const headerHtml = headers
    .map(
      (header, index) =>
        `<th style="padding:12px 16px;background:#f8fafc;color:#7b809a;font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:0.06em;text-align:${index === 0 ? "left" : "right"
        };border-bottom:1px solid #e9edf5;">${escapeHtml(header)}</th>`
    )
    .join("")

  return `<table width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse;border:1px solid #e9edf5;border-radius:14px;overflow:hidden;">
    <thead><tr>${headerHtml}</tr></thead>
    <tbody>${rowsHtml}</tbody>
  </table>`
}

function formatCop(amount: number): string {
  return `$${amount.toLocaleString("es-CO")} COP`
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;")
}

const TABLE_CELL_LEFT_STYLE =
  "padding:12px 16px;font-size:13px;color:#344767;border-bottom:1px solid #eef2f7;"

const TABLE_CELL_RIGHT_STYLE =
  "padding:12px 16px;font-size:13px;font-weight:600;color:#344767;text-align:right;border-bottom:1px solid #eef2f7;"

const EMPTY_ROW_STYLE =
  "padding:14px 16px;font-size:13px;color:#8392ab;text-align:center;background:#fbfcfe;"
