import { query } from './dbQuery.services';
import { emptyOrRows, getOffset } from '../utils/helper.utils';
import { EventData, GetEvent } from '../utils/common';
import { listPerPage } from '../configs/general.config';
import { Request, Response } from 'express';

export class Login {
    loginAction = async (req: Request, res: Response) => {
        let userEmail = req.query.userEmail;
        let globalInfo = {
            modules: [],
            userInfo: []
        };
        var page: number = 1;
        const offSet = getOffset(page, listPerPage());
        var sqlQuery = `SELECT 
                            r.role_name, u.user_id, u.fullname, u.email, mo.module_name,
                            GROUP_CONCAT(DISTINCT(perm.permission_name)) as permissions 
                        FROM event_roles as eRole
                        LEFT JOIN ems_roles as r ON(r.id=eRole.role)
                        LEFT JOIN users as u ON(u.user_id=eRole.user_id)
                        LEFT JOIN role_permission_mapping as rpm ON(r.id=rpm.role)
                        LEFT JOIN modules as mo ON(mo.id=rpm.module_id)
                        LEFT JOIN permissions as perm ON(perm.permission_id=rpm.permission_id)
                        WHERE email = '${userEmail}'
                        GROUP BY mo.id`;
        var rows: any = await query(sqlQuery, [offSet, listPerPage()])
        .then((response) => {
            // To alter response. Do the below code
            let objResponse = Object.values(response);

            globalInfo.modules
            objResponse.forEach(function (data,index) {
                let modulesObj = {
                    module_name: data.module_name,
                    permissions: data.permissions
                }

                globalInfo.modules.push(modulesObj)
            })
            let userInfo = createUserInfo(objResponse[0]);
            globalInfo.userInfo.push(userInfo)
            res.status(200).json({ globalInfo });
        })
        .catch((err) => {
            console.log(sqlQuery);
            res.status(500).send({ message: 'An unknown error occurred.' });
        });
    };
}



/**
 * Function to create/set module wise permissions
 * @param objResponse 
 * @returns array
 */
const createModulePermissions = (objResponse) => {
    const modulesPermissions = objResponse.reduce((acc, current) => {
        const matched = acc.find(item => item.module_id === current.module_id);
        if (!matched) {
            const newModule = {
                module_id: current.module_id,
                module_name: current.module_name,
                module_permission: [current.permission_name]
            }
            return acc.concat([newModule]);
        } else {
            const currModule = matched.module_permission.filter(d => d === current.data);
            if (!currModule.length) {
                const newData = matched.module_permission.push(current.permission_name);
                const newModule = {
                    module_id: current.module_id,
                    module_name: current.module_name,
                    module_permission: newData
                }
                return acc;
            } else {
                return acc;
            }
        }
    }, []);

    return modulesPermissions;
}

/**
 * Function to create userInfo object
 * @param obj 
 * @returns 
 */
const createUserInfo = (obj) => {
    let userInfo = {
        "user_id": obj.user_id,
        "fullname": obj.fullname,
        "email": obj.email,
        "role": obj.role
    };

    return userInfo;
}