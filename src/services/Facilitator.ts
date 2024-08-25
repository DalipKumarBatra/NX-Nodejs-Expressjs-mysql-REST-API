import {query} from './dbQuery.services';
import {emptyOrRows, getOffset} from '../utils/helper.utils';
import {listPerPage} from '../configs/general.config';
import { Request, Response } from 'express';

export class Facilitator {
    getFacilitatorAsOption = async (req:Request, res:Response) => {
        let search = req.query.search;
        var page:number = 1;
        const offSet = getOffset(page, 20);
        var sqlQuery = `SELECT 
                            user_id as value, emp_code, email,
                            CONCAT(first_name, ' ', last_name) as label 
                        FROM user_info_requisition
                        WHERE first_name LIKE '${search}%' OR last_name LIKE '${search}%' limit ?,?`;
        var rows:any = await query(sqlQuery, [offSet, 20])
            .then((response)=>{
                res.status(200).json({ data: response });
            })
            .catch((err) => {
                res.status(500).send({message : 'An unknown error occurred.'});
            });
    };

    getFacilitatorList = async(req: Request, res: Response) => {
        var page:number = 1;
        const offSet = getOffset(page, 20);
        var sqlQuery = `SELECT 
                            fac.*, CONCAT(uir.first_name, ' ', uir.last_name) as fac_name,
                            uir.email as fac_email,
                            CONCAT(uircn.first_name, ' ', uircn.last_name) as CreatorName,
                            group_concat(DISTINCT(c.committee_name)) as committee,
                            group_concat(distinct(fm.eventId)) as event_id,
                            group_concat(distinct(e.title)) as events
                        FROM facilitators as fac 
                        LEFT JOIN user_info_requisition as uir ON(fac.fac_user_id = uir.user_id)
                        LEFT JOIN user_info_requisition as uircn ON(fac.createdBy = uircn.user_id)
                        LEFT JOIN committee_user_mapping as cum ON(fac.facId=cum.facId)
                        LEFT JOIN committees as c ON(cum.commId=c.committee_id)
                        LEFT JOIN facilitator_map as fm ON(fac.facId=fm.facId)
                        LEFT JOIN events as e ON(fm.eventId=e.id)
                        GROUP BY fac.facId;`
        var rows:any = await query(sqlQuery, [offSet, 20])
        .then((response)=>{
            res.status(200).json({ data: response });
        })
        .catch((err) => {
            res.status(500).send({message : 'An unknown error occurred.'});
        });
    }

    addFacilitator = async (req: Request, res: Response) => {
        await req.body.facilitators.map(async function (facilitator, index) {
            var sqlQuery = await query(`INSERT INTO facilitators ( createdOn, createdBy, fac_user_id, status) VALUES ( ?, ?, ?, ?)`,
            [
                new Date(),
                "9112",
                facilitator.value,
                req.body.status.value
            ])
            .then((response) => {
                let obj = Object(response);

                let objFacilitator = {
                facId: obj.insertId,
                commId: req.body.committee.value,
                };
                this.addFacilitatorIntoCommittee(objFacilitator);
                return res.status(201).json({ data: response });
            })
            .catch((error) => {
                res.status(500).send({message : 'An unknown error occurred'})
            })
        })
    }

    addFacilitatorIntoCommittee = async (objFacilitator: any) => {
        var sqlQuery = await query(`INSERT INTO committee_user_mapping (commId, facId) VALUES (?, ?)`, 
        [objFacilitator.commId, objFacilitator.facId]);
        return true;
    }

    // updateFacilitator = async(req: Request, res: Response) => {
    //     await req.
    // }
}