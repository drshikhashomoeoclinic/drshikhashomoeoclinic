import { useParams } from 'react-router-dom';
import Breadcrumbs from '../components/seo/Breadcrumbs.jsx';
import SEO from '../components/seo/SEO.jsx';
import { useClinic } from '../context/ClinicContext.jsx';

export default function BlogDetail() {
  const { slug } = useParams();
  const { posts } = useClinic();
  const post = posts.find((item) => item.slug === slug) || posts[0];
  return (
    <main>
      <SEO title={post.title} description={post.excerpt || post.description} type="article" />
      <Breadcrumbs items={[{ label: 'Blog', href: '/blog' }, { label: post.title }]} />
      <article className="container-lux max-w-4xl py-16 md:py-24">
        <p className="eyebrow">{post.category} · {new Date(post.date).toLocaleDateString('en-IN')}</p>
        <h1 className="mt-4 font-display text-5xl font-bold md:text-7xl">{post.title}</h1>
        <p className="mt-8 text-xl leading-9 text-slate-700">{post.body || post.excerpt || post.description}</p>
      </article>
    </main>
  );
}
