import { Request, Response } from 'express';
import { Committee } from 'src/services/Committee';

export class CommitteeController {
    committee = new Committee();

    /**
     * @description Function to get committees
     * @param req 
     * @param res 
     * @returns 
     */
    getCommittees: any = async (req:Request, res:Response) => {
        try {
            return this.committee.getCommitteesList(req, res);
        }
        catch {
            console.log("Error while adding event");
        }
    };
    /**
    * @description Function to get committees
    * @param req 
    * @param res 
    * @returns 
    */
    getCommittee: any = async (req:Request, res:Response) => {
        try {
            return this.committee.getCommittees(req, res);
        }
        catch {
            console.log("Error while adding event");
        }
    };

    /**
     * @description Function to get committees by Id
     * @param req 
     * @param res 
     * @returns 
     */
    getCommitteesById: any = async (req:Request, res:Response) => {
        try {
            return this.committee.getCommitteesById(req, res);
        }
        catch {
            console.log("Error while getting committee");
        }
    };

    /**
     * @description Function to delete committee
     * @param req 
     * @param res 
     */
    removeCommittee:any = async (req:Request, res:Response) => {
        try {
            return this.committee.deleteCommittee(req, res);
        }
        catch {
            console.log("Error while adding event");
        }
    };

    /**
     * @description Function to create new event
     * @param req 
     * @param res 
     */
    create = async (req:Request, res:Response) => {
        try {
            return this.committee.addCommittee(req, res);
        }
        catch {
            res.status(404).send({message : "Error while adding event"});
        }
    };

    /**
     * @description Function to create new event
     * @param req 
     * @param res 
     */
    editCommittee = async (req:Request, res:Response) => {
        try {
            return this.committee.updateCommittee(req, res);
        }
        catch {
            res.status(404).send({message : "Error while adding event"});
        }
    };

    /**
    * @description Function to get committees head as Option
    * @param req 
    * @param res 
    * @returns 
    */
    getCommitteeHeadAsOption: any = async (req:Request, res:Response) => {
        try {
            return this.committee.getCommitteeHeadAsOption(req, res);
        }
        catch {
            console.log("Error while getting committee Head");
        }
    };
}