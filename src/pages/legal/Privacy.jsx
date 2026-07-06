import SEO from '../../components/seo/SEO.jsx';

export default function Privacy() {
  return <Legal title="Privacy Policy" body="We collect appointment and contact details only to respond to patient requests, manage clinic communication, and improve services. Data is stored in Firebase when configured and is not sold." />;
}

function Legal({ title, body }) {
  return <main className="container-lux max-w-4xl py-16 md:py-24"><SEO title={title} /><h1 className="font-display text-5xl font-bold">{title}</h1><p className="mt-6 text-lg leading-8 text-slate-700">{body}</p></main>;
}
