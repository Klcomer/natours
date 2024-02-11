const fs = require('fs')
const mongoose = require('mongoose')
const dotenv = require('dotenv')
const Tour = require('./../../models/tourModel')

dotenv.config({ path: './config.env' })


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
    const tours = JSON.parse(fs.readFileSync(`${__dirname}/tours-simple.json`, 'utf-8'))

    const deleteData = async () => {
        try {
            await Tour.deleteMany()
            console.log('data deleted')
            process.exit()
        } catch (error) {
            console.log(error)
        }
    }

    const importData = async () => {
        try {
            await Tour.create(tours)
            console.log('data loaded')
            process.exit()
        } catch (error) {
            console.log(error)
        }
    }
    if (process.argv[2] === '--import') {
        importData()
    } else if (process.argv[2] === '--delete') {
        deleteData()
    }
}).catch((err) => {
    console.error('DB connection error:', err);
});


