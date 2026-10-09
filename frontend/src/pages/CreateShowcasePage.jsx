import React from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { ShowcaseForm } from '../components/showcases/ShowcaseForm';

export const CreateShowcasePage = () => {
  const [searchParams] = useSearchParams();
  const initialProjectId = searchParams.get('projectId');

  return (
    <div style={{ paddingBottom: 'var(--space-3xl)' }}>
      <div className="container" style={{ paddingTop: 'var(--space-xl)', marginBottom: 'var(--space-lg)' }}>
        <Link
          to="/showcases"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            fontSize: 'var(--font-size-sm)',
            fontWeight: 'var(--font-weight-semibold)',
            color: 'var(--color-text-muted)',
            textDecoration: 'none',
          }}
        >
          <ArrowLeft size={16} />
          Back to Showcase Gallery
        </Link>
      </div>

      <div className="container" style={{ maxWidth: '800px' }}>
        <ShowcaseForm initialProjectId={initialProjectId} />
      </div>
    </div>
  );
};
