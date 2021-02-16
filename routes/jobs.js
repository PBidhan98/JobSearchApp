const express = require('express');
const router = express.Router();
const db = require('../config/database');
const Job = require('../models/Job');
const Sequelize = require('sequelize');
const Op = Sequelize.Op;

// Get job list
router.get('/', (req, res) => 
  Job.findAll()
    .then(jobs => res.render('jobs', {
        jobs
      }))
    .catch(err => res.render('error', {error: err})));

// Display add job form
router.get('/add', (req, res) => res.render('add'));

// Add a job
router.post('/add', (req, res) => {
  let { role, skills, job_type, experience, city, company, salary, description, contact_email, contact_number } = req.body;
  let errors = [];
  
  role = role.toLowerCase();
  job_type = job_type.toLowerCase();
  city = city.toLowerCase();
  company = company.toLowerCase();
  
  // Make lowercase and remove space after comma
  skills = skills.toLowerCase().replace(/, /g, ',');
  
  // Validate Fields
  if(!role) {
    errors.push({ text: 'Please add a job role' });
  }
  if(!skills) {
    errors.push({ text: 'Please add some skills required' });
  }
  if(!job_type) {
    errors.push({ text: 'Please add the job type' });
  }
  if(!experience) {
    errors.push({ text: 'Please add experience required' });
  }
  if(!city) {
    errors.push({ text: 'Please add work location' });
  }
  if(!company) {
    errors.push({ text: 'Please add company name' });
  }
  if(!description) {
    errors.push({ text: 'Please add the job description' });
  }
  if(!contact_email) {
    errors.push({ text: 'Please add a contact email of the company' });
  }
  if(contact_number.toString().length > 0 && contact_number.toString().length < 10) {
    errors.push({ text: 'Please add a correct contact number of recruiter' });
  }

  // Check for errors
  if(errors.length > 0) {
    res.render('add', {
      errors,
      role,
      skills,
      job_type,
      experience,
      city,
      company,
      salary, 
      description, 
      contact_email,
      contact_number
    });
  } else {

    if(contact_number.toString().length == 0) {
      contact_number = 0;
    } 

    // Insert into table
    Job.create({
      role,
      skills,
      job_type,
      experience,
      city,
      company,
      salary,
      description,
      contact_email,
      contact_number
    })
      .then(job => res.redirect('/jobs'))
      .catch(err => res.render('error', {error:err.message}))
  }
});

// Search for jobs
router.get('/search', (req, res) => {
  // let { role, company, city, salary, job_type, experience, skills } = req.query;
  let { role, city} = req.query;
  
  // Make lowercase
  role = role.toLowerCase();
  city = city.toLowerCase();
  
  if(role.length == 0 && city.length != 0) role = "unknown";
  if(role.length != 0 && city.length == 0) city = "unknown";
  
  Job.findAll({ where: { 
    [Op.or]: [ 
      { 
        role: {
         [Op.like]: '%' + role + '%'
         },
       },
      { 
        city: {
         [Op.like]: '%' + city + '%'
         }
      }
    ]
  }})
    .then(jobs => res.render('jobs', { jobs }))
    .catch(err => res.render('error', {error: err}));
});

module.exports = router;
