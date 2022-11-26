require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const helmet = require('helmet')
const createError = require('http-errors');

const bodyParser = require('body-parser')
// const path = require('path')

const app = express();

const productRouter = require('./src/routes/products');
const categoryRouter = require('./src/routes/categories');
const sellerRouter = require('./src/routes/seller');
const transactionRouter = require('./src/routes/transactions');
const transaction_detailRouter = require('./src/routes/transaction_detail');
const userRouter = require('./src/routes/users');

app.use(morgan('dev'));
app.use(cors());
app.use(express.json());
app.use(helmet());
// app.use(bodyParser.json())

app.use('/products', productRouter);
app.use('/categories', categoryRouter);
app.use('/seller', sellerRouter);
app.use('/transactions', transactionRouter);
app.use('/transaction_detail', transaction_detailRouter);
app.use('/users', userRouter);

app.use(express.static('./upload'))
app.all('*', (req, res, next) => {
    next(new createError.NotFound())
})

app.use((err, req, res, next) => {
    const messageError = err.message || "internal server error"
    const statusCode = err.status || 500

    res.status(statusCode).json({
        message : messageError
    })
    next()
})

const host = process.env.DB_HOST;
const port = process.env.PORT;
app.listen(port, () => {
    console.log(`You are running on http://${host}:${port}`)
})