const express = require('express');
const authRequired = require('../middleware/authRequired');
const Application = require('./applicationModel');
const Profile = require('../profile/profileModel');
const router = express.Router();
const jwt = require('jwt-decode');
const { adminRequired } = require('../middleware/permissionsRequired.js');

// get all pending tickets

router.get('/', authRequired, adminRequired, (req, res, next) => {
  Application.getPendingTickets()
    .then((applicationList) => {
      res.status(200).json(applicationList);
    })
    .catch(next);
});

// get pending tickets by role

router.get('/:role', authRequired, adminRequired, (req, res, next) => {
  Application.getPendingTicketsByRole(req.params.role)
    .then((applicationList) => {
      res.status(200).json(applicationList);
    })
    .catch(next);
});

// get application by application id

router.get('/id/:id', authRequired, adminRequired, (req, res, next) => {
  Application.getTicketById(req.params.id)
    .then((applicationList) => {
      res.status(200).json(applicationList);
    })
    .catch(next);
});

// post a new application for the current logged in user

router.post('/new-application', authRequired, function (req, res, next) {
  const token = req.headers.authorization;
  const User = jwt(token);
  const newApplication = req.body;
  Application.add(User.sub, newApplication)
    .then(() => {
      res.status(201).json({ message: 'Application has been submitted' });
    })
    .catch(next);
});

// update the role_id for the profile of the applicant and update the application approved value to true

router.put('/update-role', authRequired, adminRequired, (req, res, next) => {
  const profile_id = req.body.profile_id;
  const application_id = req.body.application_id;
  const role_id = req.body.position;
  Profile.update(profile_id, { role_id: role_id })
    .then(() => {
      Application.updateTicket(application_id, { approved: true })
        .then(() => {
          res.status(202).json({
            message:
              'This application has been approved, and User role has been updated',
          });
        })
        .catch(next);
    })
    .catch(next);
});

// post the information for the mentee intake for the currently logged in user

router.post('/new-mentee', authRequired, function (req, res, next) {
  const token = req.headers.authorization;
  const User = jwt(token);
  const newMenteeIntake = req.body;
  Application.insertMenteeIntake(User.sub, newMenteeIntake)
    .then(() => {
      res.status(201).json({ message: 'Information has been submitted' });
    })
    .catch(next);
});

// post the information for the mentor intake for the currently logged in user

router.post('/new-mentor', authRequired, function (req, res, next) {
  const token = req.headers.authorization;
  const User = jwt(token);
  const newMentorIntake = req.body;
  Application.insertMentorIntake(User.sub, newMentorIntake)
    .then(() => {
      res.status(201).json({ message: 'Information has been submitted' });
    })
    .catch(next);
});

module.exports = router;
