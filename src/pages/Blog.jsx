import BlogCard from '../components/cards/BlogCard.jsx';
import Breadcrumbs from '../components/seo/Breadcrumbs.jsx';
import SEO from '../components/seo/SEO.jsx';
import SectionHeader from '../components/ui/SectionHeader.jsx';
import { useClinic } from '../context/ClinicContext.jsx';

export default function Blog() {
  const { posts } = useClinic();
  return (
    <main>
      <SEO title="Blog" description="Health articles and patient education from Dr. Shikha's Homoeo Clinic." />
      <Breadcrumbs items={[{ label: 'Blog' }]} />
      <section className="section-pad bg-clinic-soft">
        <div className="container-lux">
          <SectionHeader eyebrow="Blog" title="Health notes" />
          <div className="grid gap-6 md:grid-cols-3">{posts.map((post) => <BlogCard post={post} key={post.slug || post.title} />)}</div>
        </div>
      </section>
    </main>
  );
}
