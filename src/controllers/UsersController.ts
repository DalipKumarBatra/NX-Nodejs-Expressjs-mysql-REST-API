import { Request, Response } from 'express';
import { Users } from 'src/services/Users';

export class UsersController {
    user = new Users();

    get:any = async (req:Request, res:Response, method:string) => {
        try {           
            switch (method) {
                case 'facilitatorByCommId':
                    return this.user.facilitatorByCommId(req, res);
                default:
                  return res.status(404).json({ error: 'Invalid action' });
            }
        }
        catch {
            res.status(404).send({message : "Error while adding event"});
        }
    };    

    /**
     * @description Function to get users
     * @param req 
     * @param res 
     * @returns 
     */
    getUsers: any = async (req:Request, res:Response) => {
        try { 
            return this.user.getUsersList(req, res);
        }
        catch {
            res.status(404).send({message : "Error while getting users"});
        }
    };

    /**
     * @description Function to get users
     * @param req 
     * @param res 
     * @returns 
     */
    getUserById: any = async (req:Request, res:Response) => {
        try { 
            return this.user.getUserById(req, res);
        }
        catch {
            res.status(404).send({message : "Error while getting users"});
        }
    };
    
    /**
     * @description Function to add new user
     * @param req 
     * @param res 
     */
    createUser:any = async (req:Request, res:Response) => {
        try {
            return this.user.addUser(req, res);
        }
        catch {
            res.status(404).send({message : "Error while adding users"});
        }
    };

    /**
     * @description Function to get Facilitator by committee ID
     * @param req 
     * @param res 
     * @returns 
     */
    facilitatorByCommId:any = async (req:Request, res:Response) => {
        try {
            return this.user.facilitatorByCommId(req, res);
        }
        catch {
            res.status(404).send({message : "Error while adding users"});
        }
    }

    /**
     * @description Function to delete user
     * @param req 
     * @param res 
     */
    removeUser:any = async (req:Request, res:Response) => {
        try {
            return this.user.deleteUser(req, res);
        }
        catch {
            console.log("Error while adding event");
        }
    };

    /**
     * @description Function to edit user
     * @param req 
     * @param res 
     */
    editUser = async (req:Request, res:Response) => {
        try {
            return this.user.updateUser(req, res);
        }
        catch {
            res.status(404).send({message : "Error while adding event"});
        }
    };
}