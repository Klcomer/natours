const mongoose = require('mongoose')
const dotenv = require('dotenv')

process.on('uncaughtException', err => {
    console.log('UNCAUGHT EXCEPTION 🔥🔥🔥 Shutting down...')
    console.log(err.name, err.message)
    process.exit(1)
})

dotenv.config({ path: './config.env' })
const app = require('./app')



const DB = process.env.DATABASE.replace(
    '<PASSWORD>',
    process.env.DATABASE_PASSWORD
)



mongoose.connect(DB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false, // useFindAndModify opsiyonunu false olarak ayarlayın, çünkü zaten depolanan bir yordam kullanmıyorsunuz.
    useUnifiedTopology: true, // useUnifiedTopology seçeneğini ekleyin
    poolSize: 10
}).then((con) => {
    console.log('DB connected succesfully')
})





const port = process.env.PORT || 3000
const server = app.listen(port, () => {
    console.log(`App running on port ${port}`)
})

process.on('unhandledRejection', err => {
    console.log('UNHANDLED REJECTION! 🔥🔥🔥 Shutting down...')
    console.log(err.name, err.message)
    server.close(() => {
        process.exit(1)
    })
})
