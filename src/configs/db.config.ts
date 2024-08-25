// import {mysql} from 'mysql';
import * as mysql from 'mysql2';
// import * as mysqlPromise from "mysql2/promise";

export const dbConnect = mysql.createPool ({
    host: 'localhost',
    user: 'root',
    password: 'pass',
    database: 'db-name',
    port: 3306,
});
