const defaultClinicName = "Dr. Shikha's Homoeo Clinic";

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

function whatsappTemplate(action, appointment = {}) {
  const name = clean(appointment.name) || 'Patient';
  const date = clean(appointment.date) || 'your selected date';
  const time = clean(appointment.timeSlot) || 'your selected time';
  const clinic = clean(process.env.CLINIC_NAME) || defaultClinicName;

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
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.NOTIFICATION_FROM_EMAIL;
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

export async function handler(event) {
  if (event.httpMethod !== 'POST') return json(405, { error: 'Method not allowed' });

  try {
    const { action = 'appointment-created', appointment = {} } = JSON.parse(event.body || '{}');
    const result = { action, whatsappTemplate: whatsappTemplate(action, appointment), emails: [] };

    if (action === 'appointment-created') {
      result.emails.push(await sendEmail({ to: appointment.email, action: 'patient-confirmation', appointment }));
      result.emails.push(await sendEmail({ to: process.env.ADMIN_APPOINTMENT_EMAIL, action: 'admin-new-appointment', appointment }));
    } else if (action === 'appointment-reminder' || action === 'follow-up-reminder') {
      result.emails.push(await sendEmail({ to: appointment.email, action, appointment }));
    }

    return json(200, result);
  } catch (error) {
    return json(500, { error: error.message || 'Notification failed.' });
  }
}
