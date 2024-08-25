// import { Request, Response } from 'express';
// import {dbOperations} from '../services/dbOperations.services'
// import {Login} from '../services/Login'
// import {EventData, GetEvent} from '../utils/common';

// export class operations {
//     dbOperation = new dbOperations();
//     login = new Login();

//     get:any = async (req:Request, res:Response, method:string) => {
//         try {           
//             switch (method) {
//                 case 'getLoggedInDetils':
//                     return this.login.loginAction(req, res);
//                 case 'getAllEvents':
//                   return this.dbOperation.getAllEvents(req, res);
//                 case 'getEventById':
//                     return this.dbOperation.getEventById(req, res);
//                 case 'getEventsByStatusAndId':
//                     return this.dbOperation.getEventsByStatusAndId(req, res);
//                 case 'committees':
//                     return this.dbOperation.getCommitteesList(req, res);
//                 case 'users':
//                     return this.dbOperation.getUsersList(req, res);
//                 case 'facilitatorByCommId':
//                     return this.dbOperation.facilitatorByCommId(req, res);
//                 case 'eventParticipants':
//                     return this.dbOperation.eventParticipants(req, res);
//                 default:
//                   return res.status(404).json({ error: 'Invalid action' });
//             }
//         }
//         catch {
//             res.status(404).send({message : "Error while adding event"});
//         }
//     };

//     create = async (req:Request, res:Response) => {
//         try {
//             this.dbOperation.addEvent(req, res);
//         }
//         catch {
//             res.status(404).send({message : "Error while adding event"});
//         }
//     };

//     update = async (req:Request, res:Response) => {
//         try {
//             this.dbOperation.updateEvent(req, res);
//         }
//         catch {
//             res.status(404).send({message : "Error while adding event"});
//         }
//     };

//     updateEventStatus = async (req:Request, res:Response) => {
//         try {
//             this.dbOperation.updateEventStatus(req, res);
//         }
//         catch {
//             res.status(404).send({message : "Error while updating event status"});
//         }
//     };

//     remove:any = async (req:Request, res:Response) => {
//         try {
//             this.dbOperation.deleteEvent(req, res);
//         }
//         catch {
//             console.log("Error while adding event");
//         }
//     };

//     removeCommittee:any = async (req:Request, res:Response) => {
//         try {
//             this.dbOperation.deleteCommittee(req, res);
//         }
//         catch {
//             console.log("Error while adding event");
//         }
//     };

//     createUser = async (req:Request, res:Response) => {
//         try {
//             this.dbOperation.addUser(req, res);
//         }
//         catch {
//             res.status(404).send({message : "Error while adding event"});
//         }
//     };

//     registerEventParticipant:any = async (req, res) => {
//         try {
//             this.dbOperation.registerEventParticipant(req,res);
//         }
//         catch {
//             console.log("Error while adding event");
//         }
//     };

// }