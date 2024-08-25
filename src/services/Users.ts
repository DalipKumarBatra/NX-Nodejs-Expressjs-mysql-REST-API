import {query} from './dbQuery.services';
import {emptyOrRows, getOffset} from '../utils/helper.utils';
import {EventData, GetEvent} from '../utils/common';
import {listPerPage} from '../configs/general.config';
import { Request, Response } from 'express';

export class Users {
    getUsersList = async (req:Request, res:Response) => {
        var page:number = 1;
        const offSet = getOffset(page, listPerPage());
        var sqlQuery = `SELECT 
                            u.*, 
                            GROUP_CONCAT(distinct comm.committee_name) as committee_head_in,
                            GROUP_CONCAT(commFac.committee_name) as committee_facilitator
                        FROM users as u
                        LEFT JOIN committees as comm ON (u.user_id=comm.committee_head)
                        LEFT JOIN committee_user_mapping as cum ON (cum.facId=u.user_id)
                        LEFT JOIN committees as commFac ON (commFac.committee_id=cum.commId)
                        GROUP BY u.user_id`;
        var rows:any = await query(sqlQuery, [offSet, listPerPage()])
            .then((response)=>{
                res.status(200).json({ data: response });
            })
            .catch((err) => {
                res.status(500).send({message : 'An unknown error occurred.'});
            });
    };
    

    addUser = async (req:Request, res:Response) => {
        var sqlQuery = await query(`Insert into users ( fullname, empcode, email ) values (?, ?, ?)`,
        [
            req.body.fullname, 
            req.body.empcode,
            req.body.email
        ])
        .then((response)=>{
            console.log("User Added successfully", response);
            res.status(201).json({ data: response });
        })
        .catch((err) => {
            console.log("CAUGHT ERROR", err);
            res.status(500).send({message : 'An unknown error occurred.'});
        });
    };
    
    facilitatorByCommId = async (req:Request, res:Response) => {
        let commID = req.query.committee_id;
        var page:number = 1;
        const offSet = getOffset(page, listPerPage());
        var sqlQuery = `SELECT 
                            cum.*, u.fullname as user_name
                        FROM committee_user_mapping as cum
                        LEFT JOIN users as u ON(u.user_id=cum.facId)
                        WHERE commId = '${commID}'`;
        var rows:any = await query(sqlQuery, [req.params.id, offSet, listPerPage()])
            .then((response)=>{
                res.status(200).json({ data: response });
            })
            .catch((err) => {
                res.status(500).send({message : 'An unknown error occurred.'});
            });
    };

    getUserById = async(req, res) => {
        var sqlQuery = `SELECT * FROM users WHERE user_id = ?`
        var rows:any = await query(sqlQuery, [req.params.user_id])
        .then((response)=>{
            res.status(200).json({ data: response });
        })
        .catch((err) => {
            res.status(500).send({message : 'An unknown error occurred.'});
        });
    }

    deleteUser = async(req, res) => {
        var sqlQuery = await query('DELETE FROM users WHERE user_id=?', [req.params.user_id]);
        
        let message = 'Error in deleting Event';
    
        if (sqlQuery) {
            message = 'Event deleted successfully';
        }
    
        res.status(200).json({ message });
    };

    updateUser = async (req:Request, res:Response) => {
        var sqlQuery = await query('Update users SET fullname=?, empcode=?, email=? where user_id=?',
        [
            req.body.fullname,
            req.body.empcode,
            req.body.email,
            req.params.user_id
        ])
        .then((response)=>{
            res.status(200).json({ data: response });
        })
        .catch((err) => {
            console.log("CAUGHT ERROR", err);
            res.status(500).send({message : 'An unknown error occurred.'});
        });
    };
}

