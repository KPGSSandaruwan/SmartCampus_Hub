import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { jobsAPI } from '../services/api';
import { 
  Briefcase, 
  Search, 
  PlusCircle, 
  MapPin, 
  Clock, 
  DollarSign, 
  Users, 
  CheckCircle2, 
  AlertCircle, 
  X, 
  Sparkles, 
  Building2, 
  Send, 
  Eye, 
  ShieldCheck,
  ChevronRight,
  Filter
} from 'lucide-react';

const PartTimeJobs = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialSearch = searchParams.get('search') || '';

  const [activeTab, setActiveTab] = useState('find'); // 'find' | 'post'
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState(initialSearch);
  const [selectedCategory, setSelectedCategory] = useState('All Categories');
  const [selectedJobType, setSelectedJobType] = useState('All Types');
  
  // Notification Toast State
  const [toast, setToast] = useState(null);

  // Application Modal State
  const [applyModalJob, setApplyModalJob] = useState(null);
  const [applyForm, setApplyForm] = useState({
    applicantName: '',
    applicantEmail: '',
    applicantPhone: '',
    note: ''
  });
  const [applying, setApplying] = useState(false);

  // Post Job Form State
  const [postForm, setPostForm] = useState({
    title: '',
    providerName: '',
    category: 'Retail & Sales',
    location: '',
    jobType: 'Hourly Rate',
    payRate: '',
    maxApplicants: 2,
    contactEmail: '',
    contactPhone: '',
    description: ''
  });
  const [posting, setPosting] = useState(false);
  const [showPreview, setShowPreview] = useState(false);

  // Track applied jobs locally
  const [appliedJobIds, setAppliedJobIds] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('uniconnect_applied_jobs') || '[]');
    } catch {
      return [];
    }
  });

  const categories = [
    'All Categories',
    'Retail & Sales',
    'Tutoring & Academic',
    'Catering & Events',
    'IT & Services',
    'Delivery & Logistics',
    'Campus Admin'
  ];

  const jobTypes = [
    'All Types',
    'Hourly Rate',
    'Fixed Rate',
    'Shift-based'
  ];

  // Sync URL search params
  useEffect(() => {
    const q = searchParams.get('search');
    if (q !== null && q !== searchQuery) {
      setSearchQuery(q);
    }
  }, [searchParams]);

  useEffect(() => {
    fetchJobs();
  }, [selectedCategory, selectedJobType, searchQuery]);

  const fetchJobs = async () => {
    setLoading(true);
    try {
      const catParam = (!selectedCategory || selectedCategory === 'All Categories' || selectedCategory === 'all') ? 'all' : selectedCategory;
      const typeParam = (!selectedJobType || selectedJobType === 'All Types' || selectedJobType === 'all') ? 'all' : selectedJobType;

      const res = await jobsAPI.getAll({
        category: catParam,
        jobType: typeParam,
        search: searchQuery.trim()
      });
      if (Array.isArray(res.data)) {
        setJobs(res.data);
      } else {
        setJobs([]);
      }
    } catch (err) {
      console.error('Failed to load part-time jobs:', err);
      showToast('error', 'Could not load job vacancies. Please refresh.');
    } finally {
      setLoading(false);
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchJobs();
  };

  const showToast = (type, message) => {
    setToast({ type, message });
    setTimeout(() => setToast(null), 4000);
  };

  // Handle Post Job Submission
  const handlePostSubmit = async (e) => {
    e.preventDefault();
    if (!postForm.title || !postForm.providerName || !postForm.payRate || !postForm.contactEmail || !postForm.contactPhone || !postForm.description) {
      showToast('error', 'Please fill in all required job fields.');
      return;
    }

    setPosting(true);
    try {
      const res = await jobsAPI.create(postForm);
      showToast('success', res.data.message || 'Job vacancy posted successfully!');
      
      // Reset form and switch tab to find
      setPostForm({
        title: '',
        providerName: '',
        category: 'Retail & Sales',
        location: '',
        jobType: 'Hourly Rate',
        payRate: '',
        maxApplicants: 2,
        contactEmail: '',
        contactPhone: '',
        description: ''
      });
      setShowPreview(false);
      setActiveTab('find');
      fetchJobs();
    } catch (err) {
      console.error('Error posting job:', err);
      showToast('error', err.response?.data?.message || 'Failed to post job vacancy.');
    } finally {
      setPosting(false);
    }
  };

  // Handle Apply Submission
  const handleApplySubmit = async (e) => {
    e.preventDefault();
    if (!applyForm.applicantName || !applyForm.applicantEmail || !applyForm.applicantPhone) {
      showToast('error', 'Please fill in your name, email, and phone number.');
      return;
    }

    setApplying(true);
    try {
      const res = await jobsAPI.apply(applyModalJob.id || applyModalJob._id, applyForm);
      showToast('success', res.data.message || 'Application submitted successfully!');

      // Save locally to track already applied
      const updatedApplied = [...appliedJobIds, (applyModalJob.id || applyModalJob._id).toString()];
      setAppliedJobIds(updatedApplied);
      localStorage.setItem('uniconnect_applied_jobs', JSON.stringify(updatedApplied));

      setApplyModalJob(null);
      setApplyForm({ applicantName: '', applicantEmail: '', applicantPhone: '', note: '' });
      fetchJobs();
    } catch (err) {
      console.error('Error applying for job:', err);
      showToast('error', err.response?.data?.message || 'Failed to submit application.');
    } finally {
      setApplying(false);
    }
  };

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', paddingBottom: '4rem' }} className="animate-fade-in">
      
      {/* Toast Notification */}
      {toast && (
        <div style={{
          position: 'fixed',
          top: '80px',
          right: '20px',
          zIndex: 1000,
          background: toast.type === 'success' ? '#10b981' : '#ef4444',
          color: '#ffffff',
          padding: '0.85rem 1.25rem',
          borderRadius: '12px',
          boxShadow: '0 10px 25px rgba(0,0,0,0.15)',
          display: 'flex',
          alignItems: 'center',
          gap: '0.65rem',
          fontWeight: 600,
          fontSize: '0.92rem'
        }}>
          {toast.type === 'success' ? <CheckCircle2 size={20} /> : <AlertCircle size={20} />}
          <span>{toast.message}</span>
        </div>
      )}

      {/* 1. HERO SECTION */}
      <div style={{
        background: 'linear-gradient(135deg, #09090B 0%, #064e3b 100%)',
        borderRadius: '24px',
        padding: '3.5rem 2rem',
        color: '#ffffff',
        textAlign: 'center',
        position: 'relative',
        overflow: 'hidden',
        boxShadow: '0 20px 40px rgba(9, 9, 11, 0.15)',
        marginBottom: '2.5rem'
      }}>
        <div style={{ position: 'relative', zIndex: 2, maxWidth: '800px', margin: '0 auto' }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem',
            background: 'rgba(0, 153, 102, 0.2)',
            border: '1px solid rgba(0, 153, 102, 0.4)',
            padding: '0.4rem 1rem',
            borderRadius: '9999px',
            fontSize: '0.82rem',
            fontWeight: 700,
            color: '#34d399',
            letterSpacing: '0.5px',
            marginBottom: '1.25rem'
          }}>
            <Sparkles size={16} />
            <span>STUDENT ECONOMIC OPPORTUNITIES</span>
          </div>

          <h1 style={{
            fontFamily: "'Outfit', sans-serif",
            fontSize: '2.7rem',
            fontWeight: 800,
            lineHeight: 1.15,
            marginBottom: '1rem',
            letterSpacing: '-0.5px'
          }}>
            Find Flexible Work. Create Opportunities.
          </h1>

          <p style={{
            fontSize: '1.05rem',
            color: '#d1fae5',
            lineHeight: 1.6,
            marginBottom: '2rem',
            fontWeight: 400
          }}>
            Discover part-time jobs that fit your skills, schedule and location — or create an opportunity for someone in your community. No sign-up required to get started.
          </p>

          <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap' }}>
            <button 
              onClick={() => setActiveTab('find')} 
              className="btn btn-primary"
              style={{
                backgroundColor: '#0066FF',
                padding: '0.85rem 1.75rem',
                fontSize: '1rem'
              }}
            >
              <Search size={18} />
              <span>Find a Job</span>
            </button>

            <button 
              onClick={() => setActiveTab('post')} 
              className="btn"
              style={{
                background: 'rgba(255, 255, 255, 0.12)',
                color: '#ffffff',
                border: '1px solid rgba(255, 255, 255, 0.25)',
                padding: '0.85rem 1.75rem',
                fontSize: '1rem'
              }}
            >
              <PlusCircle size={18} />
              <span>Post a Job Vacancy</span>
            </button>
          </div>
        </div>
      </div>

      {/* 2. SEGMENTED TAB CONTROL */}
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        marginBottom: '2rem'
      }}>
        <div style={{
          background: '#f4f4f5',
          padding: '0.35rem',
          borderRadius: '14px',
          display: 'inline-flex',
          gap: '0.35rem',
          border: '1px solid #e4e4e7',
          boxShadow: '0 2px 8px rgba(0,0,0,0.04)'
        }}>
          <button
            onClick={() => setActiveTab('find')}
            style={{
              padding: '0.7rem 1.75rem',
              borderRadius: '10px',
              fontSize: '0.95rem',
              fontWeight: 700,
              border: 'none',
              background: activeTab === 'find' ? '#0066FF' : 'transparent',
              color: activeTab === 'find' ? '#ffffff' : '#71717a',
              boxShadow: activeTab === 'find' ? '0 4px 12px rgba(0, 102, 255, 0.25)' : 'none',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}
          >
            <Briefcase size={17} />
            <span>Find Part-Time Jobs</span>
          </button>

          <button
            onClick={() => setActiveTab('post')}
            style={{
              padding: '0.7rem 1.75rem',
              borderRadius: '10px',
              fontSize: '0.95rem',
              fontWeight: 700,
              border: 'none',
              background: activeTab === 'post' ? '#0066FF' : 'transparent',
              color: activeTab === 'post' ? '#ffffff' : '#71717a',
              boxShadow: activeTab === 'post' ? '0 4px 12px rgba(0, 102, 255, 0.25)' : 'none',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}
          >
            <PlusCircle size={17} />
            <span>Post a Job</span>
          </button>
        </div>
      </div>

      {/* TAB A: FIND PART-TIME JOBS */}
      {activeTab === 'find' && (
        <div>
          {/* SEARCH & FILTERS AREA */}
          <div className="clean-panel" style={{ padding: '1.5rem', marginBottom: '2rem', backgroundColor: '#ffffff' }}>
            <form onSubmit={handleSearchSubmit} style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', marginBottom: '1.25rem' }}>
              <div style={{
                flex: 1,
                minWidth: '260px',
                display: 'flex',
                alignItems: 'center',
                gap: '0.65rem',
                background: '#f4f4f5',
                borderRadius: '10px',
                padding: '0.6rem 1rem',
                border: '1px solid #e4e4e7'
              }}>
                <Search size={18} color="#71717a" />
                <input 
                  type="text" 
                  placeholder="Search by job title, location, store name..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  style={{
                    width: '100%',
                    background: 'transparent',
                    border: 'none',
                    outline: 'none',
                    color: '#09090B',
                    fontSize: '0.95rem'
                  }}
                />
                {searchQuery && (
                  <button 
                    type="button" 
                    onClick={() => setSearchQuery('')} 
                    style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#71717a', display: 'flex', alignItems: 'center' }}
                    title="Clear search"
                  >
                    <X size={16} />
                  </button>
                )}
              </div>

              <button type="submit" className="btn btn-primary" style={{ backgroundColor: '#0066FF' }}>
                Search Jobs
              </button>
            </form>

            {/* Category Filter Pills */}
            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', alignItems: 'center' }}>
              <span style={{ fontSize: '0.85rem', fontWeight: 600, color: '#71717a', marginRight: '0.3rem' }}>Categories:</span>
              {categories.map((cat, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedCategory(cat)}
                  style={{
                    padding: '0.35rem 0.85rem',
                    borderRadius: '9999px',
                    fontSize: '0.82rem',
                    fontWeight: selectedCategory === cat ? 700 : 500,
                    background: selectedCategory === cat ? '#e0e7ff' : '#f4f4f5',
                    color: selectedCategory === cat ? '#0066FF' : '#52525b',
                    border: selectedCategory === cat ? '1px solid #c7d2fe' : '1px solid #e4e4e7',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease'
                  }}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* JOB LIST GRID */}
          {loading ? (
            <div style={{ padding: '4rem', textAlign: 'center', color: '#71717a' }}>
              Loading part-time job opportunities...
            </div>
          ) : jobs.length === 0 ? (
            <div className="clean-panel" style={{ padding: '3.5rem', textAlign: 'center', backgroundColor: '#ffffff' }}>
              <Briefcase size={40} color="#94a3b8" style={{ marginBottom: '1rem' }} />
              <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#09090B', marginBottom: '0.5rem' }}>
                No Vacancies Found
              </h3>
              <p style={{ color: '#71717a', marginBottom: '1.5rem', maxWidth: '450px', margin: '0 auto 1.5rem auto' }}>
                There are currently no active jobs matching your search filters. Be the first to post an opportunity for fellow students!
              </p>
              <button onClick={() => setActiveTab('post')} className="btn btn-primary" style={{ backgroundColor: '#0066FF' }}>
                <PlusCircle size={18} />
                <span>Post a Job Opportunity</span>
              </button>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '1.5rem' }}>
              {jobs.map((job) => {
                const jobIdStr = (job.id || job._id).toString();
                const isApplied = appliedJobIds.includes(jobIdStr);
                const isFull = job.applicantsCount >= job.maxApplicants || job.status === 'closed';

                return (
                  <div 
                    key={jobIdStr}
                    className="clean-panel"
                    style={{
                      borderRadius: '16px',
                      padding: '1.5rem',
                      backgroundColor: '#ffffff',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'space-between',
                      position: 'relative',
                      border: isFull ? '1px solid #fee2e2' : '1px solid #e4e4e7',
                      transition: 'transform 0.2s ease, box-shadow 0.2s ease'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = 'translateY(-3px)';
                      e.currentTarget.style.boxShadow = '0 10px 25px rgba(9, 9, 11, 0.08)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'translateY(0)';
                      e.currentTarget.style.boxShadow = 'var(--shadow-md)';
                    }}
                  >
                    <div>
                      {/* Top Badges */}
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.85rem' }}>
                        <span style={{
                          fontSize: '0.75rem',
                          fontWeight: 700,
                          padding: '0.25rem 0.65rem',
                          borderRadius: '6px',
                          background: '#e0e7ff',
                          color: '#0066FF'
                        }}>
                          {job.category}
                        </span>

                        {isFull ? (
                          <span style={{
                            fontSize: '0.75rem',
                            fontWeight: 800,
                            padding: '0.25rem 0.65rem',
                            borderRadius: '6px',
                            background: '#fef2f2',
                            color: '#dc2626',
                            border: '1px solid #fecaca'
                          }}>
                            ALREADY FULL
                          </span>
                        ) : isApplied ? (
                          <span style={{
                            fontSize: '0.75rem',
                            fontWeight: 800,
                            padding: '0.25rem 0.65rem',
                            borderRadius: '6px',
                            background: '#dcfce7',
                            color: '#15803d'
                          }}>
                            APPLIED
                          </span>
                        ) : (
                          <span style={{
                            fontSize: '0.75rem',
                            fontWeight: 700,
                            padding: '0.25rem 0.65rem',
                            borderRadius: '6px',
                            background: '#f0fdf4',
                            color: '#16a34a'
                          }}>
                            OPEN
                          </span>
                        )}
                      </div>

                      {/* Job Title & Provider */}
                      <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#09090B', marginBottom: '0.35rem' }}>
                        {job.title}
                      </h3>

                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.88rem', color: '#0066FF', fontWeight: 600, marginBottom: '0.85rem' }}>
                        <Building2 size={15} />
                        <span>{job.providerName}</span>
                      </div>

                      {/* Location & Pay */}
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', fontSize: '0.88rem', color: '#52525b', marginBottom: '1rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
                          <MapPin size={16} color="#71717a" />
                          <span>{job.location}</span>
                        </div>

                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
                          <DollarSign size={16} color="#16a34a" />
                          <strong style={{ color: '#16a34a', fontSize: '0.98rem' }}>{job.payRate}</strong>
                          <span style={{ fontSize: '0.78rem', color: '#71717a' }}>({job.jobType})</span>
                        </div>
                      </div>

                      <p style={{ fontSize: '0.88rem', color: '#71717a', lineHeight: 1.5, marginBottom: '1.25rem', display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                        {job.description}
                      </p>
                    </div>

                    {/* Bottom Applicant Count & Action Button */}
                    <div style={{ paddingTop: '1rem', borderTop: '1px solid #f4f4f5' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.85rem', fontSize: '0.82rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: '#64748b', fontWeight: 600 }}>
                          <Users size={15} color="#0066FF" />
                          <span>Applicants:</span>
                        </div>
                        <span style={{ fontWeight: 800, color: isFull ? '#dc2626' : '#09090B' }}>
                          {job.applicantsCount} / {job.maxApplicants} slots filled
                        </span>
                      </div>

                      <button
                        onClick={() => setApplyModalJob(job)}
                        disabled={isFull || isApplied}
                        className="btn btn-full"
                        style={{
                          backgroundColor: isFull ? '#e4e4e7' : isApplied ? '#dcfce7' : '#0066FF',
                          color: isFull ? '#a1a1aa' : isApplied ? '#15803d' : '#ffffff',
                          fontWeight: 700,
                          cursor: isFull || isApplied ? 'not-allowed' : 'pointer'
                        }}
                      >
                        {isFull ? 'Application Closed (Full)' : isApplied ? 'Already Applied' : 'View Details & Apply'}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* TAB B: POST A JOB */}
      {activeTab === 'post' && (
        <div className="clean-panel" style={{ maxWidth: '800px', margin: '0 auto', padding: '2.5rem', backgroundColor: '#ffffff' }}>
          <div style={{ marginBottom: '2rem', borderBottom: '1px solid #f4f4f5', paddingBottom: '1rem' }}>
            <h2 style={{ fontFamily: "'Outfit', sans-serif", fontSize: '1.6rem', fontWeight: 800, color: '#09090B', marginBottom: '0.35rem' }}>
              Create a Part-Time Job Opportunity
            </h2>
            <p style={{ fontSize: '0.9rem', color: '#71717a' }}>
              Post a job vacancy for university students. No login required — enter your details below.
            </p>
          </div>

          <form onSubmit={handlePostSubmit}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem' }}>
              <div className="form-group">
                <label>Job Title *</label>
                <input 
                  type="text"
                  className="form-control"
                  placeholder="e.g. Part-Time Shop Assistant"
                  required
                  value={postForm.title}
                  onChange={(e) => setPostForm({ ...postForm, title: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label>Employer / Store Name *</label>
                <input 
                  type="text"
                  className="form-control"
                  placeholder="e.g. Campus Bookshop / Local Cafe"
                  required
                  value={postForm.providerName}
                  onChange={(e) => setPostForm({ ...postForm, providerName: e.target.value })}
                />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem' }}>
              <div className="form-group">
                <label>Category *</label>
                <select 
                  className="form-control"
                  value={postForm.category}
                  onChange={(e) => setPostForm({ ...postForm, category: e.target.value })}
                >
                  {categories.filter(c => c !== 'All Categories').map((c, idx) => (
                    <option key={idx} value={c}>{c}</option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label>Location *</label>
                <input 
                  type="text"
                  className="form-control"
                  placeholder="e.g. Faculty of Technology / Matara Town"
                  required
                  value={postForm.location}
                  onChange={(e) => setPostForm({ ...postForm, location: e.target.value })}
                />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1.25rem' }}>
              <div className="form-group">
                <label>Job Type</label>
                <select 
                  className="form-control"
                  value={postForm.jobType}
                  onChange={(e) => setPostForm({ ...postForm, jobType: e.target.value })}
                >
                  <option value="Hourly Rate">Hourly Rate</option>
                  <option value="Fixed Rate">Fixed Rate</option>
                  <option value="Shift-based">Shift-based</option>
                </select>
              </div>

              <div className="form-group">
                <label>Pay Amount (Rs.) *</label>
                <input 
                  type="text"
                  className="form-control"
                  placeholder="e.g. Rs. 600 / hr"
                  required
                  value={postForm.payRate}
                  onChange={(e) => setPostForm({ ...postForm, payRate: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label>Max Applicants Open *</label>
                <input 
                  type="number"
                  className="form-control"
                  min="1"
                  max="50"
                  required
                  value={postForm.maxApplicants}
                  onChange={(e) => setPostForm({ ...postForm, maxApplicants: parseInt(e.target.value) || 1 })}
                />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem' }}>
              <div className="form-group">
                <label>Contact Email *</label>
                <input 
                  type="email"
                  className="form-control"
                  placeholder="e.g. manager@shop.com"
                  required
                  value={postForm.contactEmail}
                  onChange={(e) => setPostForm({ ...postForm, contactEmail: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label>Contact Phone / WhatsApp *</label>
                <input 
                  type="text"
                  className="form-control"
                  placeholder="e.g. +94 77 123 4567"
                  required
                  value={postForm.contactPhone}
                  onChange={(e) => setPostForm({ ...postForm, contactPhone: e.target.value })}
                />
              </div>
            </div>

            <div className="form-group">
              <label>Job Description & Requirements *</label>
              <textarea 
                className="form-control"
                rows="5"
                placeholder="Describe key responsibilities, working hours, and student qualifications..."
                required
                value={postForm.description}
                onChange={(e) => setPostForm({ ...postForm, description: e.target.value })}
              ></textarea>
            </div>

            <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem' }}>
              <button 
                type="button"
                onClick={() => setShowPreview(!showPreview)}
                className="btn btn-secondary"
                style={{ flex: 1 }}
              >
                <Eye size={18} />
                <span>{showPreview ? 'Hide Preview' : 'Preview Vacancy'}</span>
              </button>

              <button 
                type="submit"
                disabled={posting}
                className="btn btn-primary"
                style={{ flex: 1, backgroundColor: '#0066FF' }}
              >
                <Send size={18} />
                <span>{posting ? 'Publishing Job...' : 'Publish Vacancy Now'}</span>
              </button>
            </div>
          </form>

          {/* PREVIEW DRAWER */}
          {showPreview && (
            <div style={{
              marginTop: '2rem',
              padding: '1.5rem',
              borderRadius: '16px',
              border: '2px dashed #0066FF',
              backgroundColor: '#f8fafc'
            }}>
              <div style={{ fontSize: '0.75rem', fontWeight: 800, color: '#0066FF', textTransform: 'uppercase', marginBottom: '0.75rem' }}>
                Vacancy Preview Card
              </div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#09090B', marginBottom: '0.2rem' }}>
                {postForm.title || 'Untitled Job Position'}
              </h3>
              <div style={{ fontSize: '0.9rem', color: '#0066FF', fontWeight: 700, marginBottom: '0.65rem' }}>
                {postForm.providerName || 'Employer Name'} • {postForm.category}
              </div>
              <div style={{ fontSize: '0.88rem', color: '#52525b', marginBottom: '0.85rem' }}>
                📍 {postForm.location || 'Location'} | 💰 <strong>{postForm.payRate || 'Pay Amount'}</strong> ({postForm.jobType})
              </div>
              <p style={{ fontSize: '0.88rem', color: '#64748b', lineHeight: 1.5, marginBottom: '1rem' }}>
                {postForm.description || 'Job description preview text...'}
              </p>
              <div style={{ fontSize: '0.82rem', color: '#0066FF', fontWeight: 600 }}>
                Applicants Open: 0 / {postForm.maxApplicants} slots
              </div>
            </div>
          )}
        </div>
      )}

      {/* 3. APPLICATION MODAL */}
      {applyModalJob && (
        <div style={{
          position: 'fixed',
          inset: 0,
          backgroundColor: 'rgba(9, 9, 11, 0.65)',
          backdropFilter: 'blur(4px)',
          zIndex: 1000,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '1rem'
        }} onClick={() => setApplyModalJob(null)}>
          <div style={{
            background: '#ffffff',
            maxWidth: '560px',
            width: '100%',
            borderRadius: '20px',
            padding: '2rem',
            boxShadow: '0 25px 50px rgba(9, 9, 11, 0.25)'
          }} onClick={(e) => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
              <div>
                <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#0066FF', background: '#e0e7ff', padding: '0.2rem 0.6rem', borderRadius: '6px' }}>
                  {applyModalJob.category}
                </span>
                <h3 style={{ fontSize: '1.35rem', fontWeight: 800, color: '#09090B', marginTop: '0.4rem' }}>
                  {applyModalJob.title}
                </h3>
              </div>
              <button onClick={() => setApplyModalJob(null)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
                <X size={20} color="#71717a" />
              </button>
            </div>

            <div style={{ background: '#f8fafc', padding: '1rem', borderRadius: '12px', marginBottom: '1.5rem', border: '1px solid #e2e8f0', fontSize: '0.88rem' }}>
              <div style={{ fontWeight: 700, color: '#09090B', marginBottom: '0.25rem' }}>{applyModalJob.providerName}</div>
              <div style={{ color: '#52525b', marginBottom: '0.4rem' }}>📍 {applyModalJob.location} | 💰 <strong style={{ color: '#16a34a' }}>{applyModalJob.payRate}</strong></div>
              <div style={{ color: '#64748b', fontSize: '0.85rem' }}>{applyModalJob.description}</div>
            </div>

            <h4 style={{ fontSize: '1rem', fontWeight: 800, color: '#09090B', marginBottom: '1rem' }}>
              Submit Your Job Application
            </h4>

            <form onSubmit={handleApplySubmit}>
              <div className="form-group">
                <label>Your Full Name *</label>
                <input 
                  type="text"
                  className="form-control"
                  placeholder="e.g. Kasun Fernando"
                  required
                  value={applyForm.applicantName}
                  onChange={(e) => setApplyForm({ ...applyForm, applicantName: e.target.value })}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="form-group">
                  <label>Email Address *</label>
                  <input 
                    type="email"
                    className="form-control"
                    placeholder="student@uni.edu"
                    required
                    value={applyForm.applicantEmail}
                    onChange={(e) => setApplyForm({ ...applyForm, applicantEmail: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label>Phone / WhatsApp *</label>
                  <input 
                    type="text"
                    className="form-control"
                    placeholder="+94 77 123 4567"
                    required
                    value={applyForm.applicantPhone}
                    onChange={(e) => setApplyForm({ ...applyForm, applicantPhone: e.target.value })}
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Short Note / Relevant Experience</label>
                <textarea 
                  className="form-control"
                  rows="3"
                  placeholder="Briefly state your availability and why you are suitable for this position..."
                  value={applyForm.note}
                  onChange={(e) => setApplyForm({ ...applyForm, note: e.target.value })}
                ></textarea>
              </div>

              <button 
                type="submit" 
                disabled={applying}
                className="btn btn-primary btn-full"
                style={{ backgroundColor: '#0066FF', padding: '0.85rem', marginTop: '0.5rem' }}
              >
                {applying ? 'Submitting Application...' : 'Confirm & Apply Now'}
              </button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default PartTimeJobs;
