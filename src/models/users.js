const Pool = require('../config/db')

const findEmail = (email) => {
  return  new Promise ((resolve,reject) => 
    Pool.query(`SELECT * FROM users WHERE email='${email}'`, (error,result) => {
      if(!error){
        resolve(result)
      }else{
        reject(error)
      }
    })
  )
}

const findFullname = (fullname) => {
  return Pool.query(`select * from users where fullname='${fullname}'`);
}

const create = (data) => {
  const {id, email, password, fullname, role} = data
  return new Promise ((resolve,reject) => 
    Pool.query(`INSERT INTO users(id, email, password, fullname, role) VALUES('${id}','${email}','${password}','${fullname}', '${role}')`,(error,result) => {
      if(!error){
        resolve(result)
      }else{
        reject(error)
      }
    })
  )
}

const createSeller = (data) => {
  const {id, email, password, fullname, store_name, phone, role} = data
  return new Promise ((resolve, reject) => 
      Pool.query(`INSERT INTO users(id, email, password, fullname, phone, store_name, role) VALUES ('${id}', '${email}', '${password}', '${fullname}', '${phone}', '${store_name}', '${role}')`, 
      (error, result) => {
          if(!error){
              resolve(result)
          }else{
          reject(error)
          }
      })
  )
}

const update = (data) => {
  const {id, email, password, fullname} = data 
  return new Promise ((resolve, reject) =>
  Pool.query(`UPDATE users SET email='${email}', password='${password}', fullname='${fullname}' WHERE id='${id}'`, (error, result) => {
    if(!error){
      resolve(result)
    }else{
      reject(error)
    }
  }))
}

const updateSell = (id, fullname, password, store_name, email, phone, address_seller) => {
  return Pool.query(`UPDATE seller SET fullname='${fullname}', password='${password}', store_name='${store_name}', email='${email}', phone='${phone}', address_seller='${address_seller}' WHERE id='${id}'`);
}

const deleteAccount = (email) => {
  return Pool.query(`delete from users where email='${email}'`)
}
    
module.exports = {
  findEmail,
  findFullname,
  create,
  update,
  deleteAccount,
  createSeller,
  updateSell
}