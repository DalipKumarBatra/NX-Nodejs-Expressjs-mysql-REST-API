import { RowDataPacket } from 'mysql2';
import {dbConnect} from '../configs/db.config'

export const query  = async (sql, params) => {
  // console.log(dbConnect);
  return new Promise((resolve, reject) => {
    dbConnect.query(sql, params, (err, results) => {
      // console.log('>>>>sql query>>>>', sql)
      if (err) {
        reject(err);
      } else {
        resolve(results);
      }
    });
  });
}
