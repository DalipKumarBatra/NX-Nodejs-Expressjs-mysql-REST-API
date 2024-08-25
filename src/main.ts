import express, { Request, Response } from 'express';
import multer from "multer";
import { validateRequest } from './middleware/validateRequest';
import { EventController } from './controllers/EventController';
import { LoginController } from './controllers/LoginController';
import { CommitteeController } from './controllers/CommitteeController';
import { UsersController } from './controllers/UsersController';
import { FacilitatorController } from './controllers/FacilitatorController';

// configuration for image upload
const storage = multer.diskStorage({
  destination: (req: Request, file: any, callback: any) => {
    callback(null, './src/assets');
  },
  filename: (req: Request, file: any, callback: any) => {
    callback(null, file.originalname);
  }
});

const upload = multer({storage: storage});

const port = process.env.PORT ? Number(process.env.PORT) : 4000;
var bodyParser = require('body-parser')

// Express Configurations
const app = express();
var cors = require('cors')
app.use(bodyParser.urlencoded({ extended: false })) // parse application/x-www-form-urlencoded
//app.use(bodyParser.json()) // parse application/json
app.use(bodyParser.json({limit: '10mb', extended: true}))
app.use(cors())


// Calling Controllers
const committee = new CommitteeController();
const login = new LoginController();
const event = new EventController();
const validate = new validateRequest();
const user = new UsersController();
const facilitator = new FacilitatorController();

// API for upload images 
app.post('/upload-images', upload.array('images'), (req: Request, res: Response) => {
  console.log('images details>>>>>>>>>', req.files as Express.Multer.File[])
  // const images = req.files;
})

app.get('/', (req, res) => {
  res.send({ message: 'You are logged in successfully, API' });
});

//Login
app.get('/loginAction', (req, res) => {
  login.getLoggedInDetils(req, res);
});

// Get Events with and without condition
app.get('/event/:id', (req, res) => {
  let error = validate.verifyParams(req, res);
  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  } else {
    event.getEventById(req, res);
  }
});

app.get('/field/getDynamicInputFields/:id', (req, res) => {
  event.dynamicInputField(req, res);
});

app.get('/field/getDynamicSelect/:id', (req, res) => {
  event.getDynamicSelectField(req, res);
});

app.get('/userEvent/:email', (req, res) => {
  let error = validate.verifyEmailParams(req, res);
  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  } else {
    event.getRegEventByUserEmail(req, res);
  }
});

// Event
app.get('/events/getUpcomingAndLiveEvents', (req, res) => {
  event.getUpcomingAndLiveEvents(req, res);
});

app.get('/filterEvents', (req, res) => {
  event.getFilteredEvents(req, res);
});

app.get('/events/:status', (req, res) => {
  event.getEventsByStatus(req, res);
});

app.get('/events', (req, res) => {
  event.getAllEvents(req, res);
});

app.get('/eventParticipants', (req, res) => {
  event.eventParticipants(req, res);
});

app.get('/totalParticipants', (req, res) => {
  event.getTotalParticipants(req, res);
})

app.get('/getMyEvents', (req, res) => {
  event.getMyEventsByUserEmail(req, res);
})

app.post('/events/add', (req, res) => {
  event.create(req, res);
  // validate.validateAddEventForm(req, res);
});

app.put('/events/updateStatus',event.updateEventStatus)

app.put('/events/updateConfirmParticipation',event.updateConfirmParticipation)

app.delete('/events/delete/:id', event.remove);

app.delete('/events/removeParticipants', event.removeParticipationFromEvent);

// Get Committiees
app.get('/committees', (req, res) => {
  committee.getCommittees(req, res);
});

app.post('/getCommitteeHeadAsOption', (req, res) => {
  committee.getCommitteeHeadAsOption(req, res);
})

app.post('/getCommittees', (req, res) => {
  committee.getCommittee(req, res)
})

app.post('/committees', (req, res) => {
  committee.getCommittees(req, res);
});

app.get('/committees/:id', (req, res) => {
  committee.getCommitteesById(req, res);
})

app.post('/committees/add', (req, res) => {
  committee.create(req, res);
})

app.put('/committees/update/:id',committee.editCommittee)

app.get('/users', (req, res) => {
  user.getUsers(req, res);
});

app.get('/user/:user_id', (req, res) => {
  user.getUserById(req, res);
});

app.put('/user/update/:user_id', (req, res) => {
  user.editUser(req, res)
});

app.get('/facilitatorByCommId', (req, res) => {
  user.facilitatorByCommId(req, res);
});

app.post('/users/add', (req, res) => {
  user.createUser(req, res);
  // validate.validateAddEventForm(req, res);
});

app.delete('/users/delete/:user_id', user.removeUser);

app.post('/registerEventParticipant', (req, res) => {
  event.registerEventParticipant(req, res);
});

app.put('/events/update/:id', event.update);

app.delete('/committees/delete/:committee_id', committee.removeCommittee);

// Facilitator API's
app.post('/bebonetUsers', (req, res) => {
  facilitator.getFacilitatorAsOption(req, res);
});

app.post('/getFacilitatorList', (req, res) => {
  facilitator.getFacilitatorList(req, res);
});

app.post('/addFacilitator', (req, res) => {
  facilitator.addFacilitator(req, res);
});

// Post methods for Events
app.post('/getMyEvents', (req, res) => {
  event.getMyEventsByUserEmail(req, res);
})

app.post('/events/:status', (req, res) => {
  event.getEventsByStatus(req, res);
});

app.post('/getUpcomingAndLiveEvents', (req, res) => {
  event.getUpcomingAndLiveEvents(req, res);
});

app.post('/getCommitteeEvents/:committee', (req, res) => {
  event.getEventsBasedOnCommittee(req, res);
});

app.post('/getCommitteeEventsByStatus', (req, res) => {
  event.getEventsForCommitteeByStatus(req, res);
});

app.listen(port, () => {
  console.log(`[ ready ] http://localhost:${port}`);
});
