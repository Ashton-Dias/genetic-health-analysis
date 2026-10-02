/**
 * Local-time timestamp for report headers: "YYYY-MM-DD HH:mm (TZ)".
 * Uses the viewer's own clock/zone (not UTC) so a report generated at
 * 4:14 PM in Sydney says 16:14, with the zone label so shared or
 * downloaded reports stay unambiguous.
 */
const pad = (n) => String(n).padStart(2, "0");

function zoneLabel(date) {
  try {
    const part = new Intl.DateTimeFormat(undefined, { timeZoneName: "short" })
      .formatToParts(date)
      .find((p) => p.type === "timeZoneName");
    // Skip bare "GMT+10"-style output; the explicit offset below is clearer.
    if (part && !/^(GMT|UTC)[+-]/.test(part.value)) return part.value;
  } catch {
    // fall through to the computed offset
  }
  const offsetMin = -date.getTimezoneOffset();
  const sign = offsetMin >= 0 ? "+" : "-";
  const abs = Math.abs(offsetMin);
  return `UTC${sign}${pad(Math.floor(abs / 60))}:${pad(abs % 60)}`;
}

export function formatLocalTimestamp(date = new Date()) {
  const day = `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
  const time = `${pad(date.getHours())}:${pad(date.getMinutes())}`;
  return `${day} ${time} (${zoneLabel(date)})`;
}
