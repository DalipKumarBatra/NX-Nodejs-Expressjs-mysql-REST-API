import {Request, Response} from 'express';
import { EventController } from 'src/controllers/EventController';

export const fetchEvents = (req:Request, res:Response) => {
    // res.send({ message: 'You are in fetchEvents' });
    const {id, status, dept} = req.params;
    const event = new EventController();

    console.log(req.params);
    if (!id || !status && !dept) {
        res.send({ message: 'You are in fetchEvents' });
        event.getAllEvents(req, res);
    }

    if(id != '0') {
        event.getEventById(req, res);
    }

    // if(status != '0' && dept != '0') {
    //     event.getEventsByStatusAndId(req, res);
    // }
};