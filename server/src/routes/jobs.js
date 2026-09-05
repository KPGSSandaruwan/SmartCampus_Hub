const express = require('express');
const router = express.Router();
const Job = require('../models/Job');
const JobApplication = require('../models/JobApplication');
const { Op } = require('sequelize');

// Helper to seed initial sample jobs if table is empty
const seedDefaultJobs = async () => {
  try {
    const count = await Job.count();
    if (count === 0) {
      console.log('Seeding initial Part-Time Jobs data...');
      await Job.bulkCreate([
        {
          title: 'Part-Time Shop Assistant',
          providerName: 'Campus Bookshop & Stationery',
          category: 'Retail & Sales',
          location: 'Faculty of Technology Entrance',
          jobType: 'Shift-based',
          payRate: 'Rs. 600 / hr',
          maxApplicants: 2,
          applicantsCount: 0,
          contactEmail: 'bookshop@uniconnect.edu',
          contactPhone: '+94 77 123 4567',
          description: 'Assisting students with textbook purchases, managing stationery inventory, and handling cash registers during peak hours (10 AM - 2 PM). Flexible morning shifts available.',
          status: 'open'
        },
        {
          title: 'High School Mathematics Tutor',
          providerName: 'Senior Student Peer Academy',
          category: 'Tutoring & Academic',
          location: 'Matara Town / Remote Zoom',
          jobType: 'Hourly Rate',
          payRate: 'Rs. 1,500 / hr',
          maxApplicants: 3,
          applicantsCount: 1,
          contactEmail: 'tutors@uniconnect.edu',
          contactPhone: '+94 71 987 6543',
          description: 'Conducting 1-on-1 algebra and calculus tutoring sessions for O/L and A/L students. Flexible evening hours according to your university lecture schedule.',
          status: 'open'
        },
        {
          title: 'Event Photographer & Video Assistant',
          providerName: 'UniConnect Media Club',
          category: 'Catering & Events',
          location: 'University Auditorium & Sports Complex',
          jobType: 'Fixed Rate',
          payRate: 'Rs. 4,500 / event',
          maxApplicants: 2,
          applicantsCount: 2,
          contactEmail: 'media@uniconnect.edu',
          contactPhone: '+94 76 555 4321',
          description: 'Capturing event photography and short highlights for campus cultural events and sports tournaments. Gear provided if needed.',
          status: 'closed'
        },
        {
          title: 'Front-End Web Development Assistant',
          providerName: 'TechVibe Software Solutions',
          category: 'IT & Services',
          location: 'Remote / ICT Dept Lab',
          jobType: 'Hourly Rate',
          payRate: 'Rs. 1,200 / hr',
          maxApplicants: 4,
          applicantsCount: 1,
          contactEmail: 'careers@techvibe.io',
          contactPhone: '+94 74 160 7777',
          description: 'Assisting senior developers with React component creation, CSS styling fixes, and user interface testing for local client projects.',
          status: 'open'
        }
      ]);
    }
  } catch (err) {
    console.error('Error seeding default jobs:', err);
  }
};

// GET /api/jobs - List all part-time jobs with optional search and filters
router.get('/', async (req, res) => {
  try {
    await seedDefaultJobs();

    const { category, search, jobType } = req.query;
    let whereClause = {};

    if (category && category !== 'all' && category !== 'All Categories') {
      whereClause.category = category;
    }

    if (jobType && jobType !== 'all' && jobType !== 'All Types') {
      whereClause.jobType = jobType;
    }

    if (search && search.trim() !== '') {
      const cleanSearch = search.trim().toLowerCase();
      whereClause[Op.or] = [
        sequelize.where(sequelize.fn('LOWER', sequelize.col('title')), 'LIKE', `%${cleanSearch}%`),
        sequelize.where(sequelize.fn('LOWER', sequelize.col('provider_name')), 'LIKE', `%${cleanSearch}%`),
        sequelize.where(sequelize.fn('LOWER', sequelize.col('location')), 'LIKE', `%${cleanSearch}%`),
        sequelize.where(sequelize.fn('LOWER', sequelize.col('description')), 'LIKE', `%${cleanSearch}%`),
        sequelize.where(sequelize.fn('LOWER', sequelize.col('category')), 'LIKE', `%${cleanSearch}%`)
      ];
    }

    const jobs = await Job.findAll({
      where: whereClause,
      order: [['createdAt', 'DESC']],
      include: [{ model: JobApplication, as: 'applications' }]
    });

    res.json(jobs);
  } catch (error) {
    console.error('Error fetching jobs:', error);
    res.status(500).json({ message: 'Failed to retrieve jobs', error: error.message });
  }
});

// GET /api/jobs/:id - Get specific job details
router.get('/:id', async (req, res) => {
  try {
    const job = await Job.findByPk(req.params.id, {
      include: [{ model: JobApplication, as: 'applications' }]
    });

    if (!job) {
      return res.status(404).json({ message: 'Job vacancy not found' });
    }

    res.json(job);
  } catch (error) {
    res.status(500).json({ message: 'Error loading job details', error: error.message });
  }
});

// POST /api/jobs - Post a new part-time job vacancy
router.post('/', async (req, res) => {
  try {
    const { 
      title, 
      providerName, 
      category, 
      location, 
      jobType, 
      payRate, 
      maxApplicants, 
      contactEmail, 
      contactPhone, 
      description 
    } = req.body;

    if (!title || !providerName || !category || !location || !payRate || !contactEmail || !contactPhone || !description) {
      return res.status(400).json({ message: 'Please fill in all required job details.' });
    }

    const maxAppCount = parseInt(maxApplicants) > 0 ? parseInt(maxApplicants) : 2;

    const newJob = await Job.create({
      title,
      providerName,
      category: category || 'General',
      location,
      jobType: jobType || 'Hourly Rate',
      payRate,
      maxApplicants: maxAppCount,
      applicantsCount: 0,
      contactEmail,
      contactPhone,
      description,
      status: 'open'
    });

    res.status(201).json({
      message: 'Part-time job vacancy posted successfully!',
      job: newJob
    });
  } catch (error) {
    console.error('Error posting job:', error);
    res.status(500).json({ message: 'Failed to post job vacancy', error: error.message });
  }
});

// POST /api/jobs/:id/apply - Apply for a part-time job vacancy
router.post('/:id/apply', async (req, res) => {
  try {
    const jobId = req.params.id;
    const { applicantName, applicantEmail, applicantPhone, note } = req.body;

    if (!applicantName || !applicantEmail || !applicantPhone) {
      return res.status(400).json({ message: 'Name, email, and phone number are required to submit an application.' });
    }

    const job = await Job.findByPk(jobId);
    if (!job) {
      return res.status(404).json({ message: 'Job vacancy not found' });
    }

    // Check if max applicants limit is reached
    if (job.applicantsCount >= job.maxApplicants || job.status === 'closed') {
      return res.status(400).json({ 
        message: `This vacancy is already full (${job.applicantsCount}/${job.maxApplicants} applicants). Applications are closed.` 
      });
    }

    // Check if applicant already applied with this email
    const existingApp = await JobApplication.findOne({
      where: {
        job_id: jobId,
        applicantEmail: applicantEmail
      }
    });

    if (existingApp) {
      return res.status(400).json({ message: 'You have already submitted an application for this vacancy.' });
    }

    // Create Application record
    const application = await JobApplication.create({
      jobId: job.id,
      applicantName,
      applicantEmail,
      applicantPhone,
      note: note || '',
      status: 'applied'
    });

    // Update job applicant count
    const newCount = job.applicantsCount + 1;
    const newStatus = newCount >= job.maxApplicants ? 'closed' : 'open';

    await job.update({
      applicantsCount: newCount,
      status: newStatus
    });

    res.status(201).json({
      message: 'Application submitted successfully!',
      application,
      jobStatus: {
        applicantsCount: newCount,
        maxApplicants: job.maxApplicants,
        status: newStatus
      }
    });
  } catch (error) {
    console.error('Error applying for job:', error);
    res.status(500).json({ message: 'Failed to submit job application', error: error.message });
  }
});

module.exports = router;
