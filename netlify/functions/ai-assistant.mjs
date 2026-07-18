const headers = {
  'Content-Type': 'application/json',
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS'
};

function json(statusCode, payload) {
  return { statusCode, headers, body: JSON.stringify(payload) };
}

function parseBody(event) {
  try {
    return JSON.parse(event.body || '{}');
  } catch {
    return {};
  }
}

function systemPrompt(type) {
  const guardrail = 'You are writing clinic admin helper text for a homoeopathy clinic. Do not diagnose, prescribe, promise cure, or replace medical consultation. Keep output concise, simple, and patient-friendly.';
  const prompts = {
    appointmentSummary: 'Create a short admin case summary from appointment details. Mention complaint, date, time, contact preference, and missing details.',
    whatsappTemplate: 'Create a polite WhatsApp message draft for appointment confirmation, reminder, follow-up, or report request.',
    blogIdeas: 'Suggest patient-friendly blog topics with short summaries and keywords for common clinic concerns.',
    blogDraft: 'Create a simple health education blog draft with title, excerpt, patient-friendly body, keywords, and FAQs.',
    faqGenerator: 'Create clear patient FAQ questions and answers for the selected clinic topic.',
    seoMeta: 'Create SEO meta title, description, keywords, and FAQ ideas. Keep it suitable for a local clinic.',
    visitSummary: 'Summarize patient visit history and notes for admin record keeping only.',
    prescriptionInstructions: 'Rewrite prescription advice into clear patient instructions without adding new medicines or diagnosis.',
    reviewReply: 'Write a warm professional reply to a patient review.',
    campaignCaption: 'Create a simple clinic campaign heading, short description, button text, and WhatsApp/social caption.'
  };
  return `${guardrail}\nTask: ${prompts[type] || 'Create helpful clinic admin text.'}`;
}

async function callGemini(type, payload) {
  const supportedKeys = [
    'GEMINI_API_KEY',
    'Gemini_API_Key',
    'GEMINI_APIKEY',
    'GOOGLE_API_KEY',
    'GOOGLE_GENERATIVE_AI_API_KEY',
    'AI_API_KEY'
  ];
  const envName = supportedKeys.find((key) => process.env[key]);
  const apiKey = envName ? process.env[envName] : '';
  if (!apiKey) return { text: '', envName: '', configured: false };

  const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [
        {
          role: 'user',
          parts: [
            { text: systemPrompt(type) },
            { text: JSON.stringify(payload || {}, null, 2) }
          ]
        }
      ],
      generationConfig: {
        temperature: 0.45,
        maxOutputTokens: 900
      }
    })
  });

  if (!response.ok) {
    const detail = await response.text();
    throw new Error(`AI provider failed: ${detail}`);
  }

  const data = await response.json();
  return {
    text: data.candidates?.[0]?.content?.parts?.map((part) => part.text || '').join('\n').trim() || '',
    envName,
    configured: true
  };
}

export async function handler(event) {
  if (event.httpMethod === 'OPTIONS') return json(200, { ok: true });
  if (event.httpMethod !== 'POST') return json(405, { ok: false, error: 'Method not allowed' });

  const { type, payload } = parseBody(event);
  if (!type) return json(400, { ok: false, error: 'AI helper type is required.' });

  try {
    const result = await callGemini(type, payload);
    if (!result.configured) return json(200, { ok: false, providerConfigured: false, reason: 'missing-env', text: '' });
    if (!result.text) return json(200, { ok: false, providerConfigured: true, envName: result.envName, reason: 'empty-ai-response', text: '' });
    return json(200, { ok: true, providerConfigured: true, envName: result.envName, text: result.text });
  } catch (error) {
    return json(200, { ok: false, providerConfigured: true, reason: 'provider-error', error: error.message, text: '' });
  }
}
