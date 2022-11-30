const Pool = require('../config/db');


const findEmail = (email) => {
    return  new Promise ((resolve,reject) => 
      Pool.query(`SELECT * FROM seller WHERE email='${email}'`, (error,result) => {
        if(!error){
          resolve(result)
        }else{
          reject(error)
        }
      })
    )
}
const selectAll = ({limit, offset}) => {
    return Pool.query(`select * from seller LIMIT ${limit} OFFSET ${offset}`);
}
const searching = (search) => {
    return Pool.query("select * from seller WHERE store_name ILIKE $1", [`%${search}%`]);
}
const select = (id) => {
    return Pool.query(`select * from seller WHERE id='${id}'`);
}
const insert = (data) => {
    const {id, email, password, fullname, store_name, phone, role} = data
    return new Promise ((resolve, reject) => 
        Pool.query(`INSERT INTO seller (id, email, password, fullname, phone, store_name, role) VALUES ('${id}', '${email}', '${password}', '${fullname}', '${phone}', '${store_name}', '${role}')`, 
        (error, result) => {
            if(!error){
                resolve(result)
            }else{
            reject(error)
            }
        })
    )
}
const update = (id, fullname, password, store_name, email, phone, address_seller) => {
    return Pool.query(`UPDATE seller SET fullname='${fullname}', password='${password}', store_name='${store_name}', email='${email}', phone='${phone}', address_seller='${address_seller}' WHERE id='${id}'`);
}
const deleteSeller = (id) => {
    return Pool.query(`DELETE FROM seller WHERE id='${id}'`);
}
const countSeller = () => {
    return Pool.query('SELECT COUNT(*) FROM seller')
}


module.exports = {
    selectAll,
    select,
    insert,
    update,
    deleteSeller,
    countSeller,
    searching,
    findEmail
}