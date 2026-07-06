export async function sendAppointmentNotification(action, appointment) {
  try {
    const response = await fetch('/.netlify/functions/appointment-notifications', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action, appointment })
    });
    if (!response.ok) return { ok: false };
    const data = await response.json();
    return {
      ok: true,
      data,
      emailSkipped: Array.isArray(data.emails) && data.emails.some((item) => item?.skipped)
    };
  } catch {
    return { ok: false };
  }
}
