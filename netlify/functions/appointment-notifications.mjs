const defaultClinicName = "Dr. Shikha's Homoeo Clinic";
const clinicAddress = '113 Debaipukur Road, Near Amtallah Rickshaw Stand, Hindmotor, Hooghly, PIN-712233';
const clinicContact = '7001431935';

function json(statusCode, body) {
  return {
    statusCode,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body)
  };
}

function clean(value = '') {
  return String(value || '').trim();
}

function appointmentSummary(appointment = {}) {
  return [
    `Name: ${clean(appointment.name)}`,
    `Mobile: ${clean(appointment.phone || appointment.mobile)}`,
    `Email: ${clean(appointment.email)}`,
    `Preferred Date: ${clean(appointment.date)}`,
    `Preferred Time: ${clean(appointment.timeSlot)}`,
    `Complaint: ${clean(appointment.complaint || appointment.concern)}`
  ].join('\n');
}

function digitsOnly(value = '') {
  return String(value || '').replace(/\D/g, '');
}

function whatsappLink(number, message) {
  const digits = digitsOnly(number);
  if (!digits) return '';
  const phone = digits.length === 10 ? `91${digits}` : digits;
  return `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
}

function whatsappTemplate(action, appointment = {}) {
  const name = clean(appointment.name) || 'Patient';
  const date = clean(appointment.date) || 'your selected date';
  const time = clean(appointment.timeSlot) || 'your selected time';
  const clinic = clean(process.env.CLINIC_NAME) || defaultClinicName;
  const mobile = clean(appointment.phone || appointment.mobile);
  const complaint = clean(appointment.complaint || appointment.concern);

  if (action === 'appointment-confirmed-doctor') {
    return `Appointment confirmed: ${name}, ${mobile}, ${date}, ${time}, Complaint: ${complaint}.`;
  }

  if (action === 'appointment-confirmed') {
    return `Hello ${name}, your appointment with ${clinic} is confirmed for ${date} at ${time}. Address: ${clinicAddress}. Contact: ${clinicContact}.`;
  }

  if (action === 'follow-up-reminder') {
    return `Hello ${name}, this is a follow-up reminder from ${clinic}. Please reply to confirm a convenient time for your follow-up consultation.`;
  }

  if (action === 'appointment-reminder') {
    return `Hello ${name}, this is a reminder for your appointment at ${clinic} on ${date} at ${time}. Please reply if you need to reschedule.`;
  }

  return `Hello ${name}, your appointment request at ${clinic} for ${date} at ${time} has been received. We will confirm shortly.`;
}

function emailContent(action, appointment = {}) {
  const clinic = clean(process.env.CLINIC_NAME) || defaultClinicName;
  const date = clean(appointment.date) || 'your selected date';
  const time = clean(appointment.timeSlot) || 'your selected time';

  if (action === 'admin-new-appointment') {
    return {
      subject: `New appointment request - ${clean(appointment.name) || 'Patient'}`,
      text: `A new appointment request was submitted for ${clinic}.\n\n${appointmentSummary(appointment)}`
    };
  }

  if (action === 'appointment-confirmed-admin') {
    return {
      subject: `Appointment confirmed - ${clean(appointment.name) || 'Patient'}`,
      text: [
        'New appointment confirmed.',
        `Patient Name: ${clean(appointment.name)}`,
        `Mobile: ${clean(appointment.phone || appointment.mobile)}`,
        `Email: ${clean(appointment.email)}`,
        `Complaint: ${clean(appointment.complaint || appointment.concern)}`,
        `Date: ${date}`,
        `Time: ${time}`
      ].join('\n')
    };
  }

  if (action === 'appointment-confirmed') {
    return {
      subject: `Your appointment is confirmed - ${clinic}`,
      text: [
        `Your appointment with ${clinic} is confirmed.`,
        `Date: ${date}`,
        `Time: ${time}`,
        `Address: ${clinicAddress}`,
        `Contact: ${clinicContact}`
      ].join('\n')
    };
  }

  if (action === 'appointment-reminder') {
    return {
      subject: `Appointment reminder - ${clinic}`,
      text: `This is a reminder for your appointment at ${clinic} on ${date} at ${time}.\n\n${appointmentSummary(appointment)}`
    };
  }

  if (action === 'follow-up-reminder') {
    return {
      subject: `Follow-up reminder - ${clinic}`,
      text: `This is a follow-up reminder from ${clinic}. Please contact the clinic to confirm your next consultation.\n\n${appointmentSummary(appointment)}`
    };
  }

  return {
    subject: `Appointment request received - ${clinic}`,
    text: `Dear ${clean(appointment.name) || 'Patient'},\n\nYour appointment request at ${clinic} has been received for ${date} at ${time}. The clinic will confirm by phone or WhatsApp.\n\n${appointmentSummary(appointment)}`
  };
}

async function sendEmail({ to, action, appointment }) {
  const apiKey = process.env.EMAIL_API_KEY || process.env.RESEND_API_KEY;
  const from = process.env.FROM_EMAIL || process.env.NOTIFICATION_FROM_EMAIL;
  if (!apiKey || !from || !to) {
    return { skipped: true, reason: 'Email environment variables are not configured.' };
  }

  const content = emailContent(action, appointment);
  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      from,
      to,
      subject: content.subject,
      text: content.text
    })
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Email provider error: ${error}`);
  }

  return response.json();
}

async function sendWhatsApp({ to, message }) {
  const apiKey = process.env.WHATSAPP_PROVIDER_API_KEY;
  const providerUrl = process.env.WHATSAPP_PROVIDER_URL;
  if (!apiKey || !providerUrl || !to) {
    return { skipped: true, reason: 'WhatsApp provider environment variables are not configured.' };
  }

  const response = await fetch(providerUrl, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ to: digitsOnly(to), message })
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`WhatsApp provider error: ${error}`);
  }

  return response.json();
}

export async function handler(event) {
  if (event.httpMethod !== 'POST') return json(405, { error: 'Method not allowed' });

  try {
    const { action = 'appointment-created', appointment = {} } = JSON.parse(event.body || '{}');
    const patientWhatsappMessage = whatsappTemplate(action, appointment);
    const doctorWhatsappMessage = whatsappTemplate(`${action}-doctor`, appointment);
    const whatsappProviderConfigured = Boolean(process.env.WHATSAPP_PROVIDER_API_KEY && process.env.WHATSAPP_PROVIDER_URL);
    const result = {
      action,
      whatsappTemplate: patientWhatsappMessage,
      whatsapp: {
        providerConfigured: whatsappProviderConfigured,
        patientLink: whatsappLink(appointment.phone || appointment.mobile, patientWhatsappMessage),
        doctorLink: whatsappLink(process.env.CLINIC_WHATSAPP_NUMBER, doctorWhatsappMessage),
        patientMessage: patientWhatsappMessage,
        doctorMessage: doctorWhatsappMessage,
        sends: []
      },
      emails: []
    };

    if (action === 'appointment-created') {
      result.emails.push(await sendEmail({ to: appointment.email, action: 'patient-confirmation', appointment }));
      result.emails.push(await sendEmail({ to: process.env.CLINIC_EMAIL || process.env.ADMIN_APPOINTMENT_EMAIL, action: 'admin-new-appointment', appointment }));
    } else if (action === 'appointment-confirmed') {
      result.emails.push(await sendEmail({ to: appointment.email, action: 'appointment-confirmed', appointment }));
      result.emails.push(await sendEmail({ to: process.env.CLINIC_EMAIL || process.env.ADMIN_APPOINTMENT_EMAIL, action: 'appointment-confirmed-admin', appointment }));
      result.whatsapp.sends.push(await sendWhatsApp({ to: appointment.phone || appointment.mobile, message: patientWhatsappMessage }));
      result.whatsapp.sends.push(await sendWhatsApp({ to: process.env.CLINIC_WHATSAPP_NUMBER, message: doctorWhatsappMessage }));
    } else if (action === 'appointment-reminder' || action === 'follow-up-reminder') {
      result.emails.push(await sendEmail({ to: appointment.email, action, appointment }));
    }

    return json(200, result);
  } catch (error) {
    return json(500, { error: error.message || 'Notification failed.' });
  }
}
