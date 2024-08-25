import { query } from './dbQuery.services';
import { getOffset } from '../utils/helper.utils';
import { listPerPage } from '../configs/general.config';
import { Request, Response, response } from 'express';

export class Committee {
    getCommitteesList = async (req:Request, res:Response) => {
        var page:number = 1;
        const offSet = getOffset(page, listPerPage());
        var sqlQuery = `SELECT 
                            comm.*, CONCAT(uir.first_name, ' ', uir.last_name) as committee_head, uir.email as committee_head_email,
                            uir.user_id as committee_head_user_id,
                            GROUP_CONCAT(CONCAT(uirFac.first_name, ' ', uirFac.last_name)) as committee_facilitator,
                            GROUP_CONCAT(uirFac.user_id) as user_id
                        from committees as comm
                        LEFT JOIN user_info_requisition as uir ON(uir.user_id=comm.committee_head)
                        LEFT JOIN committee_user_mapping as cum ON (cum.commId=comm.committee_id)
                        LEFT JOIN user_info_requisition as uirFac ON(uirFac.user_id=cum.facId)
                        GROUP BY comm.committee_id`;
        
        console.log(sqlQuery);
        var rows1: any = await query(sqlQuery, [offSet, listPerPage()])
        console.log(rows1);
        var rows:any = await query(sqlQuery, [offSet, listPerPage()])
            .then((response)=>{
                res.status(200).json({ data: response });
            })
            .catch((err) => {
                res.status(500).send({message : 'An unknown error occurred.'});
            });
    };

    getCommittees = async (req:Request, res:Response) => {
        var page:number = 1;
        const offSet = getOffset(page, listPerPage());
        var sqlQuery = `SELECT * from committees`;
        var rows:any = await query(sqlQuery, [offSet, listPerPage()])
            .then((response)=>{
                res.status(200).json({ data: response });
            })
            .catch((err) => {
                res.status(500).send({message : 'An unknown error occurred.'});
            });
    };

    getCommitteesById = async (req: Request, res: Response) => {
        var sqlQuery = `SELECT 
                            comm.*, u.fullname as committee_head, u.email as committee_head_email,
                            GROUP_CONCAT(uFac.fullname) as committee_facilitator
                        from committees as comm
                        LEFT JOIN users as u ON(u.user_id=comm.committee_head)
                        LEFT JOIN committee_user_mapping as cum ON (cum.commId=comm.committee_id)
                        LEFT JOIN users as uFac ON(uFac.user_id=cum.facId)
                        where committee_id= ?`;
        var rows:any = await query(sqlQuery, [req.params.id])
        .then((response)=>{
            res.status(200).json({ data: response });
        })
        .catch((err) => {
            res.status(500).send({message : 'An unknown error occurred.'});
        });
    }

    deleteCommittee =async (req:Request, res:Response) => {
        var sqlQuery = await query('DELETE FROM committees WHERE committee_id=?', [req.params.committee_id]);
        
        let message = 'Error in deleting Committee';
    
        if (sqlQuery) {
            message = 'Committee deleted successfully';
        }
    
        res.status(201).json({ message });
    }

    addCommittee = async (req:Request, res:Response) => {
        var sqlQuery = await query(`Insert into committees ( committee_name, committee_head) values (?, ?)`,
        [
            req.body.committee_name,
            req.body.committee_head.value,
        ])
        .then((response)=>{
            res.status(201).json({ data: response });
        })
        .catch((err) => {
            console.log("CAUGHT ERROR", err);
            res.status(500).send({message : 'An unknown error occurred.'});
        });
    };

    addCommitteeFacilitators = async (objFacilitator: any) => {
        objFacilitator.facId.map(async function(facId) {
            var sqlQuery = await query(`Insert into committee_user_mapping ( commId, facId ) values (?, ?)`,
            [
                objFacilitator.commId,
                facId
            ]).then((response) => console.log('add facilitator in committee>>>>>>', response))
        })
        return true;
    };

    removeCommitteeFacilitators = async (objFacilitator: any) => {
        var sqlQuery = await query(`DELETE FROM committee_user_mapping WHERE commId = ?`, [objFacilitator.commId])
        .then((response)=> {
            console.log('response delete >>>>>>>', response)
            this.addCommitteeFacilitators(objFacilitator)
        });
        return true;
    }

    updateCommittee = async (req:Request, res:Response) => {
        var sqlQuery = await query('Update committees SET committee_name=?, committee_head=? where committee_id=?',
        [
            req.body.committee_name,
            req.body.committee_head,
            req.params.id
        ])
        .then((response)=>{
            res.status(201).json({ data: response });
        })
        .catch((err) => {
            console.log("CAUGHT ERROR", err);
            res.status(500).send({message : 'An unknown error occurred.'});
        });
    };

    getCommitteeHeadAsOption = async (req: Request, res: Response) => {
        let search = req.query.search;
        var page:number = 1;
        const offSet = getOffset(page, 20);
        var sqlQuery = `SELECT 
                            CONCAT(uir.first_name, ' ', uir.last_name, '   [', uir.emp_code, ']') as label, uir.user_id as value
                        from user_info_requisition as uir
                        LEFT JOIN facilitators as fac ON uir.user_id = fac.fac_user_id
                        LEFT JOIN facilitators as facCom on uir.user_id = facCom.createdBy
                        WHERE (fac.fac_user_id IS NULL AND facCom.createdBy IS NULL) 
                        limit ?,?;`;
        // AND (uir.first_name LIKE '${search}%' OR uir.last_name LIKE '${search}%')
        var rows:any = await query(sqlQuery, [offSet, 20])
        .then((response)=>{
            res.status(200).json({ data: response });
        })
        .catch((err) => {
            res.status(500).send({message : 'An unknown error occurred.'});
        });
    }
}