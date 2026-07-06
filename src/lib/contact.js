export function digitsOnly(value = '') {
  return String(value).replace(/\D/g, '');
}

export function phoneHref(phone = '') {
  const digits = digitsOnly(phone);
  if (digits.length === 10) return `tel:+91${digits}`;
  return `tel:${digits || phone}`;
}

export function whatsappHref(whatsapp = '', message = 'Hi, I want to book an appointment') {
  const digits = digitsOnly(whatsapp);
  const number = digits.length === 10 ? `91${digits}` : digits;
  return `https://wa.me/${number}?text=${encodeURIComponent(message)}`;
}
