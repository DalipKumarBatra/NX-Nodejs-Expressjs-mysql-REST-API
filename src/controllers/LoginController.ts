import { Request, Response } from 'express';
import { Login } from '../services/Login'

export class LoginController {
    login = new Login();

    /**
     * @description Function to get logged in member details
     * @param req 
     * @param res 
     * @param method 
     * @returns 
     */
    getLoggedInDetils:any = async (req:Request, res:Response, method:string) => {
        try { 
            return this.login.loginAction(req, res);
        }
        catch {
            res.status(404).send({message : "Error while logging in"});
        }
    };

}