export function installAnalytics() {
  const gaId = import.meta.env.VITE_GA_ID;
  const clarityId = import.meta.env.VITE_CLARITY_ID;

  if (gaId && !document.querySelector(`[src*="${gaId}"]`)) {
    const script = document.createElement('script');
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${gaId}`;
    document.head.appendChild(script);
    window.dataLayer = window.dataLayer || [];
    window.gtag = function gtag() { window.dataLayer.push(arguments); };
    window.gtag('js', new Date());
    window.gtag('config', gaId);
  }

  if (clarityId && !window.clarity) {
    window.clarity = function clarity() { (window.clarity.q = window.clarity.q || []).push(arguments); };
    const script = document.createElement('script');
    script.async = true;
    script.src = `https://www.clarity.ms/tag/${clarityId}`;
    document.head.appendChild(script);
  }
}
