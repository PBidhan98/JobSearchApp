const Sequelize = require('sequelize');
const db = require('../config/database');

const Job = db.define('job', {
  company: {
    type: Sequelize.STRING
  },
  role: {
    type: Sequelize.TEXT
  },
  city: {
    type: Sequelize.STRING
  },
  description: {
    type: Sequelize.TEXT
  },
  salary: {
    type: Sequelize.INTEGER
  },
  job_type: {
    type: Sequelize.STRING
  },
  experience: {
    type: Sequelize.INTEGER
  },
  skills: {
    type: Sequelize.STRING
  },
  contact_email: {
    type: Sequelize.STRING
  },
  contact_number: {
    type: Sequelize.BIGINT
  }
});

Job.sync().then(() => {
  console.log('table is created successfully :)');
});

module.exports = Job;