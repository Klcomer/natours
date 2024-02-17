const express = require('express')
const morgan = require('morgan')
const AppError = require('./utils/appError')
const globalErrorController = require('./controllers/errorController')
const tourRouter = require('./routes/tourRoutes')
const userRouter = require('./routes/userRoutes')

const app = express()

console.log(process.env.NODE_ENV)
if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'))
}
app.use(express.json())
app.use(express.static(`${__dirname}/public`))

// app.get('/api/v1/tours', getAllTours)
// app.get('/api/v1/tours/:id', getTour)
// app.post('/api/v1/tours', createTour)
// app.patch('/api/v1/tours/:id', updateTour)
// app.delete('/api/v1/tours/:id', deleteTour)


app.use('/api/v1/tours', tourRouter)
app.use('/api/v1/users', userRouter)
app.all('*', (req, res, next) => {
    //NOTE: next icine verilern parametrenin error oldugunu bilir
    next(new AppError(`can't find ${req.originalUrl} on the server`, 404))
})

app.use(globalErrorController)
module.exports = app