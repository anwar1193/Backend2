const { v4: uuidv4 } = require('uuid');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const {selectAll,
    select,
    insert,
    update,
    deleteSeller,
    countSeller,
    searching,
    findEmail} = require('../models/seller');
const createError = require('http-errors');
const commonHelper = require('../helper/common');
const authHelper = require('../helper/auth');

const sellerController = {
    getAllSeller: async (req, res) => {
        try {
            const page = parseInt(req.query.page) || 1;
            const limit = parseInt(req.query.limit) || 5;
            const offset = (page - 1) * limit;
            const result = await selectAll({limit, offset});
            const {rows:[count]} = await countSeller();
            const totalData = parseInt(count.count);
            const totalPage = Math.ceil(totalData/limit);
            const pagination = {
                page: page,
                limit: limit,
                totalData: totalData,
                totalPage: totalPage
            }
            commonHelper.response(res, result.rows, 200, "Get data success", pagination)
        } catch (error) {
            res.send(createError(404));
        }
    },
    profile: async (req, res) => {
        const email = req.payload.email 
        const {rows:[seller]} = await findEmail(email) 
        delete seller.password
        commonHelper.response(res, seller, 200, 'get profile success')
    },
    registerSeller: async (req, res, next) => {
        try {
            const {email, password, fullname, store_name, phone} = req.body;
            const {rowCount} = await findEmail(email)
            const salt = bcrypt.genSaltSync(10);
            const passwordHash = bcrypt.hashSync(password, salt);
            const role = "seller";
            const id = uuidv4().toLocaleLowerCase();
            if(rowCount) {
                return next(new createError(403,'Email is already used')) 
            } 
            const data = {
                id, 
                email,
                password:passwordHash,
                fullname,
                store_name,
                phone,
                role
              }
            await insert(data)
            .then(
                result => commonHelper.response(res, result.rows, 201, "Registrasi successfull")
            )
            .catch(err => res.send(err))
        } catch (error) {
            console.log(error);
        }
    },
    login : async (req, res) => {
        try{
            const {email, password} = req.body
            const {rows:[seller]} = await findEmail(email)
            if(!seller){
              return commonHelper.response(res, null, 403, 'Email is invalid')
            }

            if(email == '' || password == '') {
              return commonHelper.response(res, null, 403, 'Email and Password must be filled')
            }

            const isValidPassword = bcrypt.compareSync(password, seller.password)  
            console.log(isValidPassword);

            if(!isValidPassword){
              return commonHelper.response(res, null, 403, 'Password is invalid')
            }
            delete seller.password
            const payload = {
              email: seller.email, 
              role : seller.role
            }

            seller.token = authHelper.generateToken(payload) 
            seller.refreshToken = authHelper.generateRefreshToken(payload) 
    
            commonHelper.response(res, users, 201, 'login is successful')
        }catch(error) {
          console.log(error);
        }
    },
    refreshToken : (req, res)=>{  
        const refreshToken = req.body.refreshToken
        const decoded = jwt.verify(refreshToken, process.env.SECRETE_KEY_JWT)
        const payload = {
          email : decoded.email,
          role : decoded.role
        }
        const result ={
          token : authHelper.generateToken(payload),
          refreshToken : authHelper.generateRefreshToken(payload)
        }
        commonHelper.response(res,result,200)
    }, 
    updateSeller: async (req, res) => {
        try {
            const id = uuidv4(req.params.id);
            const {fullname, password, store_name, email, phone, address_seller} = req.body;
            const {rowCount} = await findEmail(email)
            const salt = bcrypt.genSaltSync(10);
            const passwordHash = bcrypt.hashSync(password, salt);
            await update(id, fullname, password, store_name, email, phone, address_seller);
            res.status(201).json({message: "Profile Seller updated"});
        } catch (error) {
            res.send(createError(400))
        }
    },
    deleteSeller: async (req, res) => {
        try {
            const id = uuidv4(req.params.id);
            await deleteSeller(id);
            res.status(200).json({message: "Seller deleted"});
        } catch (error) {
            res.send(createError(400));
        }
    }
}

module.exports = sellerController