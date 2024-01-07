require('dotenv').config();
const pgp = require('pg-promise')({
    capSQL: true
})

const cn = {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    database: process.env.DATABASE,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD
}

const db = pgp(cn);

module.exports = {
    findAll: async (tbName,page,perPage) => {
        let con = null;
        try{
            con= await db.connect();
            const rs = await con.any(`SELECT * FROM "${tbName}" LIMIT ${perPage} OFFSET ${(page-1)*perPage}`);
            return rs;
        }catch(error){
            throw error;
        } finally{
            if(con){
                con.done();
            }
        }
    },
    findOne: async (tbName, fieldName, value) => {
        let con = null;
        try{
            con = await db.connect();
            const rs = await con.oneOrNone(`SELECT * FROM "${tbName}" WHERE "${fieldName}" = $1`, [value]);
            return rs;
        }catch(error){
            throw error;
        }finally{
            if(con){
                con.done();
            }
        }
    },
    findByField: async (tbName, fieldName, value,page,perPage) => {
        let con = null;
        try{
            con = await db.connect();
            const rs = await con.manyOrNone(`SELECT * FROM "${tbName}" WHERE "${fieldName}" = $1
             LIMIT ${perPage} OFFSET ${(page-1)*perPage} `, [value]);
            return rs;
        }catch(error){
            throw error;
        }finally{
            if(con){
                con.done();
            }
        }
    },
    filterByField:  async (tbName, fieldName, value, page,perPage) => {
        let con = null;
        try{
            con = await db.connect();
            const rs = await con.manyOrNone(`SELECT * FROM "${tbName}" WHERE "${fieldName}" ILIKE '%${value}%'
             LIMIT ${perPage} OFFSET ${(page-1)*perPage} `);
            return rs;
        }catch(error){
            throw error;
        }finally{
            if(con){
                con.done();
            }
        }
    },
    searchAndFilter:  async (tbName, page,perPage, query, filters, sort) => {
        let con = null;
        try{
            con = await db.connect();
            let sql = `SELECT * FROM "${tbName}" WHERE "${query.key}" ILIKE '%${query.value}%'`;
            let count_sql = `SELECT COUNT(*) FROM "${tbName}" WHERE "${query.key}" ILIKE '%${query.value}%'`;
            let filters_sql = "";
            for(let filter of filters){
                filters_sql += ` AND ${filter}`;
            }
            let rs = await con.one(count_sql + filters_sql); 

            sql += filters_sql;
            sql += ` ORDER BY "${sort.field}" ${sort.order}`;
            sql += ` LIMIT ${perPage} OFFSET ${(page-1)*perPage} `;
            console.log(sql);
            rs["data"] = await con.manyOrNone(sql);
            return rs;
        }catch(error){
            throw error;
        }finally{
            if(con){
                con.done();
            }
        }
    },
    
    
    add: async (tbName, obj)=>{
        let con = null;
        try{
            con = await db.connect();
            let sql = pgp.helpers.insert(obj, null, tbName);
            await con.none(sql);
        }catch(error){
            throw error;
        }finally{
            if(con){
                con.done();
            }
        }
    },
    del: async (tbName, fieldName, value) => {
        let con = null;
        try {
            con = await db.connect();
            let sql = `DELETE FROM "${tbName}" WHERE "${fieldName}" = ${value}`;
            await con.none(sql);
        } catch (error){
            throw error;
        } finally {
            if(con){
                con.done();
            }
        }
    },
    update: async (tbName, condition, obj) => {
        let con = null;
        try {
            con = await db.connect();
            let sql = pgp.helpers.update(obj,null, tbName) + ` WHERE "${condition.field}" = '${condition.value}'`;
            const rs = await con.none(sql);
            return rs;
        } catch (error){
            throw error;
        } finally {
            if(con){
                con.done();
            }
        }
    },
    filterByRange: async (tbName,fieldName,value1,value2,page,perPage) =>{
        let con = null;
        try{
            con = await db.connect();
            const rs = await con.manyOrNone(`SELECT * FROM "${tbName}" WHERE "${fieldName}" > ${value1} and 
            "${fieldName}" <= ${value2} 
             LIMIT ${perPage} OFFSET ${(page-1)*perPage} `);
            return rs;
        }catch(error){
            throw error;
        }finally{
            if(con){
                con.done();
            }
        }
    }
}