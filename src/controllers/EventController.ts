import { Request, Response } from 'express';
import { Event } from '../services/Event';

export class EventController {
    event = new Event();

    /**
     * @description Function to get all events
     * @param req 
     * @param res 
     * @returns 
     */
    getAllEvents = async (req:Request, res:Response) => {
        try {
            return this.event.getAllEvents(req, res);
        }
        catch {
            res.status(404).send({message : "Error while adding event"});
        }
    };

    /**
     * @description Function to get all events registered with user
     * @param req 
     * @param res 
     * @returns 
     */
    getRegEventByUserEmail = async (req:Request, res:Response) => {
        try {
            return this.event.getRegEventByUserEmail(req, res);
        }
        catch {
            res.status(404).send({message : "Error while getting event"});
        }
    };

    /**
     * @description Function to get event details by Event ID
     * @param req 
     * @param res 
     * @returns 
     */
    getEventById = async (req:Request, res:Response) => {
        try {
            this.event.getEventById(req, res);
        }
        catch {
            res.status(404).send({message : "Error while adding event"});
        }
    };

    dynamicInputField = async (req:Request, res:Response) => {
        try {
            this.event.dynamicInputField(req, res);
        }
        catch {
            res.status(404).send({message : "Error while adding event"});
        }
    }

    getDynamicSelectField = async (req:Request, res:Response) => {
        try {
            this.event.dynamicSelectField(req, res);
        }
        catch {
            res.status(404).send({message : "Error while adding event"});
        }
    }

    /**
     * @description Function to get event participants by event id
     * @param req 
     * @param res 
     * @returns 
     */
    eventParticipants = async (req:Request, res:Response) => {
        try {
            return this.event.eventParticipants(req, res);
        }
        catch {
            res.status(404).send({message : "Error while adding event"});
        }
    };

    /**
     * @description Function to get total participants register in all events
     * @param req 
     * @param res 
     * @returns 
     */
    getTotalParticipants = async (req:Request, res:Response) => {
        try {
            return this.event.getTotalParticipants(req, res);
        }
        catch {
            res.status(404).send({message : "Error while fetching total participants"});
        }
    };

    /**
     * @description Function to get events by status and ID
     * @param req 
     * @param res 
     * @returns 
     */
    getEventsByStatus = async (req:Request, res:Response) => {
        try {
            return this.event.getEventsByStatus(req, res);
        }
        catch {
            res.status(404).send({message : "Error while getting event by status"});
        }
    };

    getUpcomingAndLiveEvents = async (req:Request, res:Response) => {
        try {
            return this.event.getUpcomingAndLiveEvents(req, res);
        }
        catch {
            res.status(404).send({message : "Error while getting Upcoming and Live events"});
        }
    };
    
    getFilteredEvents = async (req:Request, res:Response) => {
        try {
            return this.event.getFilteredEvents(req, res);
        }
        catch {
            res.status(404).send({message : "Error while getting Upcoming and Live events"});
        }
    };
    /**
     * @description Function to create new event
     * @param req 
     * @param res 
     */
    create = async (req:Request, res:Response) => {
        try {
            // Add event details
            this.event.addEvent(req, res);
        }
        catch {
            res.status(404).send({message : "Error while adding event"});
        }
    };

    /**
     * @description Function to update event details
     * @param req 
     * @param res 
     */
    update = async (req:Request, res:Response) => {
        try {
            this.event.updateEvent(req, res);
        }
        catch {
            res.status(404).send({message : "Error while adding event"});
        }
    };

    /**
     * @description Function to update event status
     * @param req 
     * @param res 
     */
    updateEventStatus = async (req:Request, res:Response) => {
        try {
            this.event.updateEventStatus(req, res);
        }
        catch {
            res.status(404).send({message : "Error while updating event status"});
        }
    };

    /**
     * @description Function to update event status
     * @param req 
     * @param res 
     */
    updateConfirmParticipation = async (req:Request, res:Response) => {
        try {
            this.event.updateConfirmParticipation(req, res);
        }
        catch {
            res.status(404).send({message : "Error while updating event status"});
        }
    };

    /**
     * @description Function to delete an event
     * @param req 
     * @param res 
     */
    remove:any = async (req:Request, res:Response) => {
        try {
            this.event.deleteEvent(req, res);
        }
        catch {
            console.log("Error while adding event");
        }
    };
    
    /**
     * @description Function to participate/register in an event
     * @param req 
     * @param res 
     */
    registerEventParticipant:any = async (req, res) => {
        try {
            this.event.registerEventParticipant(req,res);
        }
        catch {
            console.log("Error while registering for event");
        }
    };

    /**
     * @description Function to delete an participation from event
     * @param req 
     * @param res 
     */
    removeParticipationFromEvent:any = async (req:Request, res:Response) => {
        try {
            this.event.removeParticipationFromEvent(req, res);
        }
        catch {
            console.log("Error while removing participation from event");
        }
    };

    /**
     * @description Function to delete an participation from event
     * @param req 
     * @param res 
     */
    getMyEventsByUserEmail:any = async (req:Request, res:Response) => {
        try {
            this.event.getMyEventsByUserEmail(req, res);
        }
        catch {
            console.log("Error while removing participation from event");
        }
    };

    /**
     * @description Function to delete an participation from event
     * @param req 
     * @param res 
     */
    getEventsBasedOnCommittee:any = async (req:Request, res:Response) => {
        try {
            this.event.getEventsBasedOnCommittee(req, res);
        }
        catch {
            console.log("Error while removing participation from event");
        }
    };

    /**
     * @description Function to delete an participation from event
     * @param req 
     * @param res 
     */
    getEventsForCommitteeByStatus:any = async (req:Request, res:Response) => {
        try {
            this.event.getEventsForCommitteeByStatus(req, res);
        }
        catch {
            console.log("Error while removing participation from event");
        }
    };
}