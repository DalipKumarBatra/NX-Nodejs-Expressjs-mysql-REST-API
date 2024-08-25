import {Request, Response} from 'express';
import Joi from 'joi';
import {EventController} from '../controllers/EventController';


export class validateRequest {
    event = new EventController();

    verifyParams = (req: Request, res: Response) => { 
        const schema = Joi.object({
            id:Joi.number().integer().min(1).required(),
        });

        const { error } = schema.validate(req.params);
        return error;
    };

    verifyEmailParams = (req: Request, res: Response) => { 
        const schema = Joi.object({
            email:Joi.string().min(3).required().email(),
        });

        const { error } = schema.validate(req.params);
        return error;
    };

    validateAddEventForm = (req: Request, res: Response) => {
        const schema = Joi.object({
            noOfAttendees:Joi.number(),
            title:Joi.string().required(),
            description:Joi.string().required(),
            committee:Joi.string().required(),
            facilitator:Joi.string().required(),
            startDate:Joi.date().required(),
            duration:Joi.string().required(),
            timezone:Joi.string().required(),
            imageUrl:Joi.string().required(),
            createdBy:Joi.string().required(),
        });

        const { error } = schema.validate(req.params);

        if (error) {
            return res.status(400).json({ error: error.details[0].message });
        } else {
            this.event.create(req, res);
        }
    };
};