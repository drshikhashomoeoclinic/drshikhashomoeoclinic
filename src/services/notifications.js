function digitsOnly(value = '') {
  return String(value || '').replace(/\D/g, '');
}

function whatsappLink(number, message) {
  const digits = digitsOnly(number);
  if (!digits) return '';
  const phone = digits.length === 10 ? `91${digits}` : digits;
  return `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
}

function confirmationFallback(action, appointment = {}) {
  const name = appointment.name || 'Patient';
  const date = appointment.date || 'your selected date';
  const time = appointment.timeSlot || 'your selected time';
  const mobile = appointment.phone || appointment.mobile || '';
  const complaint = appointment.complaint || appointment.concern || '';
  const patientMessage = `Hello ${name}, your appointment with Dr. Shikha's Homoeo Clinic is confirmed for ${date} at ${time}. Address: 113 Debaipukur Road, Near Amtallah Rickshaw Stand, Hindmotor, Hooghly, PIN-712233. Contact: 7001431935.`;
  const doctorMessage = `Appointment confirmed: ${name}, ${mobile}, ${date}, ${time}, Complaint: ${complaint}.`;

  return {
    ok: true,
    functionUnavailable: true,
    emailSkipped: true,
    whatsappSkipped: true,
    data: { action },
    whatsapp: {
      providerConfigured: false,
      patientLink: whatsappLink(mobile, patientMessage),
      doctorLink: whatsappLink('7001431935', doctorMessage),
      patientMessage,
      doctorMessage
    }
  };
}

export async function sendAppointmentNotification(action, appointment) {
  const endpoints = ['/api/appointment-notifications', '/.netlify/functions/appointment-notifications'];

  for (const endpoint of endpoints) {
    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action, appointment })
      });
      if (!response.ok) continue;
      const data = await response.json();
      return {
        ok: true,
        data,
        emailSkipped: Array.isArray(data.emails) && data.emails.some((item) => item?.skipped || item?.failed),
        whatsappSkipped: Array.isArray(data.whatsapp?.sends) && data.whatsapp.sends.some((item) => item?.skipped || item?.failed),
        whatsapp: data.whatsapp || {}
      };
    } catch {
      // Try the next deployment endpoint before falling back to WhatsApp Web links.
    }
  }

  if (action === 'appointment-confirmed') return confirmationFallback(action, appointment);
  return { ok: false };
}
