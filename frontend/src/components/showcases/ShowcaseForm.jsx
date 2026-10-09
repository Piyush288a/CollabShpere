import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Sparkles, AlertCircle, CheckCircle2, Link as LinkIcon, Github, Image, Tag, Folder } from 'lucide-react';
import { showcaseService } from '../../services/showcase.service';
import { projectService } from '../../services/project.service';
import { useAuth } from '../../hooks/useAuth';

export const ShowcaseForm = ({ initialProjectId = null, onSuccess }) => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [completedProjects, setCompletedProjects] = useState([]);
  const [loadingProjects, setLoadingProjects] = useState(true);

  const [projectId, setProjectId] = useState(initialProjectId || '');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [technologies, setTechnologies] = useState('');
  const [githubUrl, setGithubUrl] = useState('');
  const [demoUrl, setDemoUrl] = useState('');
  const [images, setImages] = useState('');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [validationErrors, setValidationErrors] = useState({});

  const currentUserId = user?._id || user?.id;

  useEffect(() => {
    const fetchEligibleProjects = async () => {
      try {
        setLoadingProjects(true);
        // Fetch all projects (or status COMPLETED)
        const res = await projectService.getProjects({ status: 'COMPLETED', limit: 100 });
        const allCompleted = res?.results || [];
        
        // Filter projects owned by current user
        const ownedCompleted = allCompleted.filter(
          (p) => String(p.ownerId) === String(currentUserId)
        );

        setCompletedProjects(ownedCompleted);

        if (ownedCompleted.length > 0 && !projectId) {
          setProjectId(ownedCompleted[0]._id);
        }
      } catch (err) {
        console.error('Failed to fetch user completed projects:', err);
      } finally {
        setLoadingProjects(false);
      }
    };

    fetchEligibleProjects();
  }, [currentUserId]);

  const validate = () => {
    const errors = {};

    if (!projectId) {
      errors.projectId = 'Please select a completed project to showcase';
    }

    if (!title.trim()) {
      errors.title = 'Title is required';
    } else if (title.trim().length < 3) {
      errors.title = 'Title must be at least 3 characters';
    } else if (title.trim().length > 120) {
      errors.title = 'Title must be at most 120 characters';
    }

    if (!description.trim()) {
      errors.description = 'Description is required';
    } else if (description.trim().length < 10) {
      errors.description = 'Description must be at least 10 characters';
    } else if (description.trim().length > 5000) {
      errors.description = 'Description must be at most 5000 characters';
    }

    const urlRegex = /^https?:\/\/.+/;

    if (githubUrl.trim() && !urlRegex.test(githubUrl.trim())) {
      errors.githubUrl = 'GitHub URL must start with http:// or https://';
    }

    if (demoUrl.trim() && !urlRegex.test(demoUrl.trim())) {
      errors.demoUrl = 'Demo URL must start with http:// or https://';
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (!validate()) return;

    setIsSubmitting(true);

    try {
      const techArray = technologies
        .split(',')
        .map((t) => t.trim())
        .filter(Boolean);

      const imageArray = images
        .split(',')
        .map((img) => img.trim())
        .filter(Boolean);

      const payload = {
        projectId,
        title: title.trim(),
        description: description.trim(),
        technologies: techArray,
        githubUrl: githubUrl.trim(),
        demoUrl: demoUrl.trim(),
        images: imageArray,
      };

      const res = await showcaseService.publishShowcase(payload);

      if (onSuccess) {
        onSuccess(res.showcase);
      } else {
        navigate(`/showcases/${res.showcase._id}`);
      }
    } catch (err) {
      console.error('Publish showcase error:', err);
      const message =
        err.response?.data?.error?.message ||
        err.response?.data?.message ||
        'Failed to publish showcase. Please try again.';
      setError(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loadingProjects) {
    return (
      <div style={{ textAlign: 'center', padding: 'var(--space-2xl) 0', color: 'var(--color-text-muted)' }}>
        Loading eligible projects...
      </div>
    );
  }

  if (completedProjects.length === 0 && !initialProjectId) {
    return (
      <div
        style={{
          backgroundColor: 'var(--color-bg-surface)',
          borderRadius: 'var(--radius-lg)',
          border: '1px solid var(--color-border-subtle)',
          padding: 'var(--space-2xl)',
          textAlign: 'center',
        }}
      >
        <Sparkles size={40} color="var(--color-accent)" style={{ margin: '0 auto var(--space-md)' }} />
        <h3
          style={{
            fontSize: 'var(--font-size-xl)',
            fontWeight: 'var(--font-weight-bold)',
            color: 'var(--color-text-main)',
            marginBottom: 'var(--space-xs)',
          }}
        >
          No Completed Projects Found
        </h3>
        <p
          style={{
            fontSize: 'var(--font-size-sm)',
            color: 'var(--color-text-muted)',
            marginBottom: 'var(--space-lg)',
            maxWidth: '480px',
            margin: '0 auto var(--space-lg)',
          }}
        >
          To create a showcase, you must be the owner of a project that is marked as <strong>COMPLETED</strong> in your project workspace.
        </p>
        <button className="btn btn-primary" onClick={() => navigate('/projects')}>
          Go to Projects
        </button>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      style={{
        backgroundColor: 'var(--color-bg-surface)',
        borderRadius: 'var(--radius-lg)',
        border: '1px solid var(--color-border-subtle)',
        padding: 'clamp(var(--space-lg), 3vw, var(--space-2xl))',
        boxShadow: 'var(--shadow-sm)',
      }}
    >
      {/* Form Title Header */}
      <div style={{ marginBottom: 'var(--space-xl)' }}>
        <h2
          style={{
            fontSize: 'var(--font-size-2xl)',
            fontWeight: 'var(--font-weight-extrabold)',
            color: 'var(--color-text-main)',
            letterSpacing: '-0.02em',
            marginBottom: 'var(--space-xs)',
          }}
        >
          Showcase Your Project
        </h2>
        <p style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-muted)' }}>
          Share your completed work, live demo links, and technical highlights with the university community.
        </p>
      </div>

      {/* Backend / Global Error Banner */}
      {error && (
        <div
          style={{
            backgroundColor: '#FEF2F2',
            border: '1px solid #FCA5A5',
            borderRadius: 'var(--radius-md)',
            padding: 'var(--space-md)',
            marginBottom: 'var(--space-lg)',
            display: 'flex',
            alignItems: 'flex-start',
            gap: 'var(--space-sm)',
            color: '#991B1B',
            fontSize: 'var(--font-size-sm)',
          }}
        >
          <AlertCircle size={18} style={{ shrink: 0, marginTop: '2px' }} />
          <div>{error}</div>
        </div>
      )}

      {/* Project Selector */}
      <div style={{ marginBottom: 'var(--space-lg)' }}>
        <label
          style={{
            display: 'block',
            fontSize: 'var(--font-size-xs)',
            fontWeight: 'var(--font-weight-bold)',
            color: 'var(--color-text-main)',
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
            marginBottom: 'var(--space-xs)',
          }}
        >
          Select Completed Project *
        </label>
        <div style={{ position: 'relative' }}>
          <select
            value={projectId}
            onChange={(e) => setProjectId(e.target.value)}
            disabled={!!initialProjectId}
            style={{
              width: '100%',
              padding: '0.75rem 1rem',
              borderRadius: 'var(--radius-md)',
              border: validationErrors.projectId
                ? '1px solid #EF4444'
                : '1px solid var(--color-border)',
              backgroundColor: initialProjectId ? 'var(--color-bg-main)' : 'var(--color-bg-surface)',
              color: 'var(--color-text-main)',
              fontSize: 'var(--font-size-sm)',
              outline: 'none',
              cursor: initialProjectId ? 'not-allowed' : 'pointer',
            }}
          >
            <option value="">-- Choose a Completed Project --</option>
            {completedProjects.map((proj) => (
              <option key={proj._id} value={proj._id}>
                {proj.title} ({proj.category})
              </option>
            ))}
          </select>
        </div>
        {validationErrors.projectId && (
          <p style={{ color: '#EF4444', fontSize: 'var(--font-size-xs)', marginTop: '4px' }}>
            {validationErrors.projectId}
          </p>
        )}
      </div>

      {/* Showcase Title */}
      <div style={{ marginBottom: 'var(--space-lg)' }}>
        <label
          style={{
            display: 'block',
            fontSize: 'var(--font-size-xs)',
            fontWeight: 'var(--font-weight-bold)',
            color: 'var(--color-text-main)',
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
            marginBottom: 'var(--space-xs)',
          }}
        >
          Showcase Headline / Title *
        </label>
        <input
          type="text"
          placeholder="e.g. EcoTrack Mobile: AI-Powered Carbon Footprint Tracker"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          maxLength={120}
          style={{
            width: '100%',
            padding: '0.75rem 1rem',
            borderRadius: 'var(--radius-md)',
            border: validationErrors.title ? '1px solid #EF4444' : '1px solid var(--color-border)',
            fontSize: 'var(--font-size-sm)',
            color: 'var(--color-text-main)',
            backgroundColor: 'var(--color-bg-surface)',
            outline: 'none',
          }}
        />
        {validationErrors.title && (
          <p style={{ color: '#EF4444', fontSize: 'var(--font-size-xs)', marginTop: '4px' }}>
            {validationErrors.title}
          </p>
        )}
        <span style={{ fontSize: '11px', color: 'var(--color-text-muted)', display: 'block', marginTop: '2px' }}>
          {title.length}/120 characters
        </span>
      </div>

      {/* Description */}
      <div style={{ marginBottom: 'var(--space-lg)' }}>
        <label
          style={{
            display: 'block',
            fontSize: 'var(--font-size-xs)',
            fontWeight: 'var(--font-weight-bold)',
            color: 'var(--color-text-main)',
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
            marginBottom: 'var(--space-xs)',
          }}
        >
          Detailed Description *
        </label>
        <textarea
          rows={6}
          placeholder="Describe what you built, key features, challenges solved, architecture, and team contributions..."
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          maxLength={5000}
          style={{
            width: '100%',
            padding: '0.75rem 1rem',
            borderRadius: 'var(--radius-md)',
            border: validationErrors.description ? '1px solid #EF4444' : '1px solid var(--color-border)',
            fontSize: 'var(--font-size-sm)',
            color: 'var(--color-text-main)',
            backgroundColor: 'var(--color-bg-surface)',
            outline: 'none',
            fontFamily: 'inherit',
            resize: 'vertical',
          }}
        />
        {validationErrors.description && (
          <p style={{ color: '#EF4444', fontSize: 'var(--font-size-xs)', marginTop: '4px' }}>
            {validationErrors.description}
          </p>
        )}
        <span style={{ fontSize: '11px', color: 'var(--color-text-muted)', display: 'block', marginTop: '2px' }}>
          {description.length}/5000 characters
        </span>
      </div>

      {/* Technologies */}
      <div style={{ marginBottom: 'var(--space-lg)' }}>
        <label
          style={{
            display: 'block',
            fontSize: 'var(--font-size-xs)',
            fontWeight: 'var(--font-weight-bold)',
            color: 'var(--color-text-main)',
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
            marginBottom: 'var(--space-xs)',
          }}
        >
          Technologies Used (comma separated)
        </label>
        <div style={{ position: 'relative' }}>
          <input
            type="text"
            placeholder="e.g. React, Node.js, MongoDB, Socket.IO, Tailwind CSS"
            value={technologies}
            onChange={(e) => setTechnologies(e.target.value)}
            style={{
              width: '100%',
              padding: '0.75rem 1rem',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--color-border)',
              fontSize: 'var(--font-size-sm)',
              color: 'var(--color-text-main)',
              backgroundColor: 'var(--color-bg-surface)',
              outline: 'none',
            }}
          />
        </div>
      </div>

      {/* Links Row (GitHub & Demo) */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 'var(--space-md)', marginBottom: 'var(--space-lg)' }}>
        {/* GitHub URL */}
        <div>
          <label
            style={{
              display: 'block',
              fontSize: 'var(--font-size-xs)',
              fontWeight: 'var(--font-weight-bold)',
              color: 'var(--color-text-main)',
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
              marginBottom: 'var(--space-xs)',
            }}
          >
            GitHub Repository URL
          </label>
          <input
            type="url"
            placeholder="https://github.com/username/repository"
            value={githubUrl}
            onChange={(e) => setGithubUrl(e.target.value)}
            style={{
              width: '100%',
              padding: '0.75rem 1rem',
              borderRadius: 'var(--radius-md)',
              border: validationErrors.githubUrl ? '1px solid #EF4444' : '1px solid var(--color-border)',
              fontSize: 'var(--font-size-sm)',
              color: 'var(--color-text-main)',
              backgroundColor: 'var(--color-bg-surface)',
              outline: 'none',
            }}
          />
          {validationErrors.githubUrl && (
            <p style={{ color: '#EF4444', fontSize: 'var(--font-size-xs)', marginTop: '4px' }}>
              {validationErrors.githubUrl}
            </p>
          )}
        </div>

        {/* Live Demo URL */}
        <div>
          <label
            style={{
              display: 'block',
              fontSize: 'var(--font-size-xs)',
              fontWeight: 'var(--font-weight-bold)',
              color: 'var(--color-text-main)',
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
              marginBottom: 'var(--space-xs)',
            }}
          >
            Live Demo URL
          </label>
          <input
            type="url"
            placeholder="https://my-demo-app.vercel.app"
            value={demoUrl}
            onChange={(e) => setDemoUrl(e.target.value)}
            style={{
              width: '100%',
              padding: '0.75rem 1rem',
              borderRadius: 'var(--radius-md)',
              border: validationErrors.demoUrl ? '1px solid #EF4444' : '1px solid var(--color-border)',
              fontSize: 'var(--font-size-sm)',
              color: 'var(--color-text-main)',
              backgroundColor: 'var(--color-bg-surface)',
              outline: 'none',
            }}
          />
          {validationErrors.demoUrl && (
            <p style={{ color: '#EF4444', fontSize: 'var(--font-size-xs)', marginTop: '4px' }}>
              {validationErrors.demoUrl}
            </p>
          )}
        </div>
      </div>

      {/* Image URLs */}
      <div style={{ marginBottom: 'var(--space-xl)' }}>
        <label
          style={{
            display: 'block',
            fontSize: 'var(--font-size-xs)',
            fontWeight: 'var(--font-weight-bold)',
            color: 'var(--color-text-main)',
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
            marginBottom: 'var(--space-xs)',
          }}
        >
          Image Preview URLs (comma separated)
        </label>
        <input
          type="text"
          placeholder="https://example.com/screenshot1.png, https://example.com/screenshot2.png"
          value={images}
          onChange={(e) => setImages(e.target.value)}
          style={{
            width: '100%',
            padding: '0.75rem 1rem',
            borderRadius: 'var(--radius-md)',
            border: '1px solid var(--color-border)',
            fontSize: 'var(--font-size-sm)',
            color: 'var(--color-text-main)',
            backgroundColor: 'var(--color-bg-surface)',
            outline: 'none',
          }}
        />
      </div>

      {/* Form Buttons */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 'var(--space-md)' }}>
        <button
          type="button"
          className="btn btn-secondary"
          onClick={() => navigate('/showcases')}
          disabled={isSubmitting}
        >
          Cancel
        </button>
        <button
          type="submit"
          className="btn btn-primary"
          disabled={isSubmitting}
          style={{ gap: '6px' }}
        >
          <Sparkles size={16} />
          {isSubmitting ? 'Publishing...' : 'Publish Showcase'}
        </button>
      </div>
    </form>
  );
};
