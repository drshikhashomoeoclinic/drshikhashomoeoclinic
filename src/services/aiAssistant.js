function clean(value) {
  return String(value || '').trim();
}

function sentence(parts) {
  return parts.filter(Boolean).join(' ');
}

function appointmentName(item = {}) {
  return clean(item.name) || 'the patient';
}

export function fallbackAiText(type, payload = {}) {
  const patient = payload.patient || payload.appointment || payload;
  const name = appointmentName(patient);
  const complaint = clean(patient.complaint || patient.concern) || 'health concern not added';
  const date = clean(patient.date) || 'date not selected';
  const time = clean(patient.timeSlot) || 'time not selected';
  const phone = clean(patient.phone || patient.mobile);
  const email = clean(patient.email);

  const fallbacks = {
    appointmentSummary: sentence([
      `${name} requested consultation for ${complaint}.`,
      `Preferred appointment: ${date} at ${time}.`,
      phone ? `Contact: ${phone}.` : 'Mobile number is missing.',
      email ? `Email: ${email}.` : 'Email not provided.',
      patient.notes ? `Notes: ${patient.notes}` : ''
    ]),
    whatsappTemplate: `Hello ${name}, your appointment request for ${date} at ${time} has been received. The clinic will confirm the final time shortly. Please bring old reports or prescriptions if available.`,
    blogIdeas: [
      'Hair fall: when should you consult? | Explain common triggers, when to seek help, and what details to share.',
      'Acidity that keeps coming back | Simple patient guide for symptoms, food triggers, and consultation preparation.',
      'PCOS and irregular periods | Patient-friendly signs, tracking tips, and when to book a consultation.',
      'Skin allergy and itching | What to note before visiting the clinic.'
    ].join('\n'),
    blogDraft: [
      `Title: ${clean(payload.topic) || 'Common health concern: when to consult'}`,
      'Excerpt: A simple guide to help patients understand symptoms and prepare for consultation.',
      '',
      'Body:',
      'If a symptom keeps returning or affects daily life, it is better to discuss it with a qualified doctor. Note when the problem started, what makes it better or worse, and any medicines already taken.',
      '',
      'Bring old reports, prescriptions, and a clear list of symptoms. This helps the doctor understand the case properly.',
      '',
      'Keywords: homoeopathy consultation, patient care, health concern, Hindmotor'
    ].join('\n'),
    seoMeta: [
      'Meta Title: Dr. Shikha Homoeo Clinic | Homoeopathy Consultation in Hindmotor',
      'Meta Description: Book a personalised homoeopathic consultation at Dr. Shikha Homoeo Clinic, Hindmotor, Uttarpara. Patient-friendly care for common and chronic concerns.',
      'Keywords: homoeopathy clinic Hindmotor, homoeopathic doctor Uttarpara, Dr Shikha Kumari Shukla, BHMS consultant'
    ].join('\n'),
    faqGenerator: [
      'Q: When should I book a consultation?',
      'A: Book if symptoms keep returning, disturb daily life, or you are unsure about the next step.',
      '',
      'Q: What should I bring?',
      'A: Bring old reports, prescriptions, and a short note of your symptoms.',
      '',
      'Q: Can I ask follow-up questions?',
      'A: Yes. The clinic can guide you about follow-up after consultation.'
    ].join('\n'),
    visitSummary: sentence([
      `${clean(patient.name) || 'Patient'} profile summary:`,
      patient.medicalHistory ? `Medical history: ${patient.medicalHistory}.` : '',
      patient.allergies ? `Allergies: ${patient.allergies}.` : '',
      patient.chronicDiseases ? `Chronic diseases: ${patient.chronicDiseases}.` : '',
      patient.visitHistory?.length ? `Visits recorded: ${patient.visitHistory.length}.` : 'No visit history added yet.'
    ]),
    prescriptionInstructions: [
      'Patient Instructions:',
      payload.prescription?.medicines ? `Medicines: ${payload.prescription.medicines}` : 'Medicines: Follow the doctor-written prescription.',
      payload.prescription?.advice ? `Advice: ${payload.prescription.advice}` : '',
      payload.prescription?.followUpDate ? `Follow-up: ${payload.prescription.followUpDate}` : 'Follow-up: As advised by the doctor.',
      'Do not change dose or stop medicine without consulting the clinic.'
    ].filter(Boolean).join('\n'),
    reviewReply: `Thank you for sharing your experience. We are glad the consultation was helpful. Your trust means a lot to Dr. Shikha's Homoeo Clinic.`,
    campaignCaption: [
      'Campaign Heading: Book a personalised homoeopathic consultation',
      'Description: Share your health concern and the clinic will guide you with appointment confirmation and follow-up support.',
      'Button Text: Book Appointment',
      'Caption: Gentle, personalised care for families in Hindmotor and Uttarpara. Book your consultation today.'
    ].join('\n')
  };

  return fallbacks[type] || 'AI helper draft is ready. Please review before using.';
}

export async function askAiAssistant(type, payload = {}) {
  try {
    const response = await fetch('/api/ai-assistant', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ type, payload })
    });
    const data = await response.json();
    const text = clean(data.text);
    return {
      ok: Boolean(data.ok && text),
      providerConfigured: Boolean(data.providerConfigured),
      envName: data.envName || '',
      model: data.model || '',
      reason: data.reason || '',
      text: text || fallbackAiText(type, payload),
      fallback: !data.ok || !text,
      error: data.error || ''
    };
  } catch (error) {
    return {
      ok: false,
      providerConfigured: false,
      envName: '',
      model: '',
      reason: 'function-unreachable',
      text: fallbackAiText(type, payload),
      fallback: true,
      error: error.message
    };
  }
}

export function createAppointmentSummary(appointment) {
  return fallbackAiText('appointmentSummary', appointment);
}

export function aiResultMessage(result, successMessage = 'AI draft is ready. Review before using.') {
  if (!result?.fallback) {
    return result.envName || result.model
      ? `${successMessage} Gemini key detected from ${result.envName || 'environment'}${result.model ? ` using ${result.model}` : ''}.`
      : successMessage;
  }

  if (result?.reason === 'missing-env' || !result?.providerConfigured) {
    return 'AI is using the free built-in template because this live deployment cannot read the Gemini key. In Vercel, add GEMINI_API_KEY for Production, then redeploy the latest Production deployment.';
  }

  if (result?.reason === 'provider-error') {
    return `AI is using the free built-in template because Gemini returned an error. Check that the API key is valid and Gemini API is enabled. ${result.error || ''}`.trim();
  }

  return 'AI is using the free built-in template because Gemini did not return a usable response. Try again in a moment.';
}
