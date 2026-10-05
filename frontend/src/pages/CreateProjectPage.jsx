import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { projectService } from '../services/project.service';
import { ROUTES } from '../constants/routes.constants';
import { ArrowLeft, Rocket, AlertCircle, Loader2 } from 'lucide-react';
import '../styles/global.css';

const CATEGORIES = [
  'Web Development',
  'Mobile Development',
  'AI & Machine Learning',
  'Data Science',
  'DevOps',
  'Game Development',
  'Open Source',
  'Cybersecurity',
  'Other',
];

const DIFFICULTIES = ['Beginner', 'Intermediate', 'Advanced'];

export const CreateProjectPage = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'Web Development',
    skillsInput: '',
    teamSize: 4,
    deadline: '',
    difficulty: 'Intermediate',
    repositoryUrl: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    // Client-side validations
    if (!formData.title.trim() || formData.title.trim().length < 3) {
      setError('Project title must be at least 3 characters long.');
      return;
    }

    if (!formData.description.trim() || formData.description.trim().length < 10) {
      setError('Description must be at least 10 characters long.');
      return;
    }

    if (!formData.teamSize || formData.teamSize < 1 || formData.teamSize > 50) {
      setError('Team size must be an integer between 1 and 50.');
      return;
    }

    if (!formData.deadline) {
      setError('Please select a project deadline.');
      return;
    }

    if (formData.repositoryUrl.trim() && !/^https?:\/\/.+/.test(formData.repositoryUrl.trim())) {
      setError('Repository URL must be a valid http:// or https:// link.');
      return;
    }

    // Process skills input
    const requiredSkills = formData.skillsInput
      ? formData.skillsInput.split(',').map((s) => s.trim()).filter(Boolean)
      : [];

    const payload = {
      title: formData.title.trim(),
      description: formData.description.trim(),
      category: formData.category,
      requiredSkills,
      teamSize: Number.parseInt(formData.teamSize, 10),
      deadline: formData.deadline,
      difficulty: formData.difficulty,
      repositoryUrl: formData.repositoryUrl.trim(),
    };

    setIsSubmitting(true);
    try {
      const data = await projectService.createProject(payload);
      const newProjectId = data.project?._id || data.project?.id;
      if (newProjectId) {
        navigate(`/projects/${newProjectId}`);
      } else {
        navigate(ROUTES.PROJECTS);
      }
    } catch (err) {
      console.error('Failed to create project:', err);
      setError(err.message || 'Failed to create project. Please check fields and try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div style={{
      paddingTop: 'var(--space-2xl)',
      paddingBottom: 'var(--space-5xl)',
    }}>
      <div className="container" style={{ maxWidth: '720px' }}>
        {/* Navigation Back Link */}
        <Link
          to={ROUTES.PROJECTS}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 'var(--space-xs)',
            fontSize: 'var(--font-size-sm)',
            fontWeight: 'var(--font-weight-semibold)',
            color: 'var(--color-text-muted)',
            marginBottom: 'var(--space-xl)',
            textDecoration: 'none',
          }}
        >
          <ArrowLeft size={16} />
          Back to Projects
        </Link>

        {/* Card Form */}
        <div style={{
          backgroundColor: 'var(--color-bg-surface)',
          border: '1px solid var(--color-border)',
          borderRadius: 'var(--radius-xl)',
          padding: 'clamp(var(--space-xl), 4vw, var(--space-3xl))',
          boxShadow: 'var(--shadow-sm)',
        }}>
          {/* Header */}
          <div style={{ marginBottom: 'var(--space-2xl)' }}>
            <h1 style={{
              fontSize: 'clamp(1.75rem, 3.5vw, var(--font-size-3xl))',
              fontWeight: 'var(--font-weight-extrabold)',
              color: 'var(--color-text-main)',
              letterSpacing: '-0.025em',
              marginBottom: 'var(--space-xs)',
            }}>
              Create a New Project
            </h1>
            <p style={{
              fontSize: 'var(--font-size-base)',
              color: 'var(--color-text-muted)',
              margin: 0,
            }}>
              Share your software idea and invite student collaborators to build with you.
            </p>
          </div>

          {/* Global Error Banner */}
          {error && (
            <div style={{
              backgroundColor: 'rgba(239, 68, 68, 0.08)',
              border: '1px solid rgba(239, 68, 68, 0.2)',
              borderRadius: 'var(--radius-md)',
              padding: 'var(--space-md) var(--space-lg)',
              marginBottom: 'var(--space-xl)',
              display: 'flex',
              alignItems: 'center',
              gap: 'var(--space-sm)',
              color: '#B91C1C',
              fontSize: 'var(--font-size-sm)',
            }}>
              <AlertCircle size={18} style={{ flexShrink: 0 }} />
              <span>{error}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit}>
            {/* Title */}
            <div style={{ marginBottom: 'var(--space-xl)' }}>
              <label htmlFor="title" style={labelStyle}>
                Project Title <span style={{ color: 'var(--color-accent)' }}>*</span>
              </label>
              <input
                id="title"
                name="title"
                type="text"
                required
                minLength={3}
                maxLength={120}
                placeholder="e.g. EcoTrack — Campus Energy Monitor"
                value={formData.title}
                onChange={handleChange}
                className="form-control"
                style={inputStyle}
              />
              <span style={helpTextStyle}>3 to 120 characters</span>
            </div>

            {/* Description */}
            <div style={{ marginBottom: 'var(--space-xl)' }}>
              <label htmlFor="description" style={labelStyle}>
                Project Description <span style={{ color: 'var(--color-accent)' }}>*</span>
              </label>
              <textarea
                id="description"
                name="description"
                required
                rows={5}
                minLength={10}
                maxLength={5000}
                placeholder="Describe your project goals, technical scope, and expected responsibilities..."
                value={formData.description}
                onChange={handleChange}
                className="form-control"
                style={{
                  ...inputStyle,
                  height: 'auto',
                  lineHeight: 'var(--line-height-normal)',
                  paddingTop: 'var(--space-sm)',
                }}
              />
              <span style={helpTextStyle}>Provide details about what you plan to build (minimum 10 characters)</span>
            </div>

            {/* Category & Difficulty Row */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
              gap: 'var(--space-xl)',
              marginBottom: 'var(--space-xl)',
            }}>
              {/* Category */}
              <div>
                <label htmlFor="category" style={labelStyle}>
                  Category <span style={{ color: 'var(--color-accent)' }}>*</span>
                </label>
                <select
                  id="category"
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className="form-control"
                  style={inputStyle}
                >
                  {CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              {/* Difficulty */}
              <div>
                <label htmlFor="difficulty" style={labelStyle}>
                  Difficulty Level <span style={{ color: 'var(--color-accent)' }}>*</span>
                </label>
                <select
                  id="difficulty"
                  name="difficulty"
                  value={formData.difficulty}
                  onChange={handleChange}
                  className="form-control"
                  style={inputStyle}
                >
                  {DIFFICULTIES.map((diff) => (
                    <option key={diff} value={diff}>
                      {diff}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Skills Required */}
            <div style={{ marginBottom: 'var(--space-xl)' }}>
              <label htmlFor="skillsInput" style={labelStyle}>
                Required Skills & Tech Stack
              </label>
              <input
                id="skillsInput"
                name="skillsInput"
                type="text"
                placeholder="e.g. React, Node.js, Socket.IO, MongoDB"
                value={formData.skillsInput}
                onChange={handleChange}
                className="form-control"
                style={inputStyle}
              />
              <span style={helpTextStyle}>Separate technologies with commas</span>
            </div>

            {/* Team Size & Deadline Row */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
              gap: 'var(--space-xl)',
              marginBottom: 'var(--space-xl)',
            }}>
              {/* Team Size */}
              <div>
                <label htmlFor="teamSize" style={labelStyle}>
                  Target Team Size <span style={{ color: 'var(--color-accent)' }}>*</span>
                </label>
                <input
                  id="teamSize"
                  name="teamSize"
                  type="number"
                  min={1}
                  max={50}
                  required
                  value={formData.teamSize}
                  onChange={handleChange}
                  className="form-control"
                  style={inputStyle}
                />
                <span style={helpTextStyle}>Total members including yourself (1 - 50)</span>
              </div>

              {/* Deadline */}
              <div>
                <label htmlFor="deadline" style={labelStyle}>
                  Project Deadline <span style={{ color: 'var(--color-accent)' }}>*</span>
                </label>
                <input
                  id="deadline"
                  name="deadline"
                  type="date"
                  required
                  value={formData.deadline}
                  onChange={handleChange}
                  className="form-control"
                  style={inputStyle}
                />
              </div>
            </div>

            {/* Repository URL (Optional) */}
            <div style={{ marginBottom: 'var(--space-2xl)' }}>
              <label htmlFor="repositoryUrl" style={labelStyle}>
                Repository URL <span style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-subtle)' }}>(Optional)</span>
              </label>
              <input
                id="repositoryUrl"
                name="repositoryUrl"
                type="url"
                placeholder="e.g. https://github.com/username/repository"
                value={formData.repositoryUrl}
                onChange={handleChange}
                className="form-control"
                style={inputStyle}
              />
            </div>

            {/* Form Actions */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'flex-end',
              gap: 'var(--space-md)',
              borderTop: '1px solid var(--color-border-subtle)',
              paddingTop: 'var(--space-xl)',
            }}>
              <Link to={ROUTES.PROJECTS} className="btn btn-secondary" style={{ padding: '0.65rem 1.2rem' }}>
                Cancel
              </Link>
              <button
                type="submit"
                disabled={isSubmitting}
                className="btn btn-primary"
                style={{ padding: '0.65rem 1.6rem', minWidth: '140px', justifyContent: 'center' }}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 size={16} className="spin-icon" />
                    Creating...
                  </>
                ) : (
                  <>
                    <Rocket size={16} />
                    Publish Project
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
      <style>{`
        .spin-icon {
          animation: spin 1s linear infinite;
        }
        @keyframes spin {
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

const labelStyle = {
  display: 'block',
  fontSize: 'var(--font-size-sm)',
  fontWeight: 'var(--font-weight-bold)',
  color: 'var(--color-text-main)',
  marginBottom: 'var(--space-xs)',
};

const inputStyle = {
  width: '100%',
  fontSize: 'var(--font-size-sm)',
  borderRadius: 'var(--radius-md)',
};

const helpTextStyle = {
  display: 'block',
  fontSize: 'var(--font-size-xs)',
  color: 'var(--color-text-subtle)',
  marginTop: '4px',
};
