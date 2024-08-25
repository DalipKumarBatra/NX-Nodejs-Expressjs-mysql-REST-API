import { Request, Response } from 'express';
import { Facilitator } from 'src/services/Facilitator';

export class FacilitatorController {
    facilitator = new Facilitator();

    /**
     * @description Function to get facilitator
     * @param req 
     * @param res 
     * @returns 
     */
    getFacilitatorList: any = async (req:Request, res:Response) => {
        try { 
            return this.facilitator.getFacilitatorList(req, res);
        }
        catch {
            res.status(404).send({message : "Error while getting facilitator"});
        }
    };
    /**
     * @description Function to get facilitator as option
     * @param req 
     * @param res 
     * @returns 
     */
    getFacilitatorAsOption: any = async (req:Request, res:Response) => {
        try { 
            return this.facilitator.getFacilitatorAsOption(req, res);
        }
        catch {
            res.status(404).send({message : "Error while getting facilitator as option"});
        }
    };

    /**
     * @description Function to add facilitator
     * @param req 
     * @param res 
     * @returns 
     */
    addFacilitator: any = async (req:Request, res:Response) => {
        try { 
            return this.facilitator.addFacilitator(req, res);
        }
        catch {
            res.status(404).send({message : "Error while getting facilitator as option"});
        }
    };
}