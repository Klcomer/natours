const mongoose = require('mongoose')
const slugify = require('slugify')
const validator = require('validator')
const tourSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'A tour must have a name'],
        unique: true,
        trim: true,
        maxlength: [40, 'a tour name must not be more than 40 char'],
        minlength: [10, 'a tour name must be at least 40 char'],
        // validate: [validator.isAlpha,'a tour name must only contains char']
    },
    slug: String,
    duration: {
        type: Number,
        required: [true, 'A tour must have a duration']
    },
    maxGroupSize: {
        type: Number,
        required: [true, 'A tour must have a group size']
    },
    difficulty: {
        type: String,
        required: [true, 'A tour must have a diffuculty'],
        enum: {
            values: ['easy', 'medium', 'difficult'],
            message: 'difficulty is either easy medium or difficult'
        }
    },
    ratingsAvarage: {
        type: Number,
        default: 4.5,
        min: [1, 'it must be above 1'],
        max: [5, 'it must be below 5']
    },
    ratingsQuantity: {
        type: Number,
        default: 0
    },
    price: {
        type: Number,
        required: [true, 'A tour must have a price']
    },
    priceDiscount: {
        type: Number,
        validate: {
            validator: function (val) {
                //NOTE: this only will work on new creation nut update
                return val < this.price
            },
            message: 'Discount price ({VALUE}) should be below regular price'
        },
    },
    summary: {
        type: String,
        trim: true,
        required: [true, 'A tour must have a summary']
    },
    description: {
        type: String,
        trim: true
    },
    imageCover: {
        type: String,
        required: [true, 'A tour must have a cover Image'],
    },
    imageCover: [String],
    createdAt: {
        type: Date,
        default: Date.now(),
        select: false
    },
    startDates: [Date],
    secretTour: {
        type: Boolean,
        default: false
    }
}, {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
})
tourSchema.virtual('durationWeeks').get(function () {
    return this.duration / 7
})

//NOTE: documnet middleware : runs before .save() and create()
tourSchema.pre('save', function (next) {
    //create yani bir tour create etmeden calisiyor ona slug bir key value ekliyor 
    // valuesu da name yaptik
    this.slug = slugify(this.name, { lower: true })
    next()
})
//NOTE: QUERY middleware 
//butun find methodlari calismadan bu find middleware calisiyour
tourSchema.pre(/^find/, function (next) {
    this.find({ secretTour: { $ne: true } })
    next()
})


//NOTE: aggtagetion middleware
tourSchema.pre('aggregate', function (next) {
    this.pipeline().unshift({ $match: { secretTour: { $ne: true } } })
    // console.log(this.pipeline())
    next()
})

// tourSchema.pre('save', function (next) {
//     console.log('will save documnet')
//     next()
// })
// tourSchema.post('save', function (doc, next) {
//     console.log(doc)
//     next()
// })

const Tour = mongoose.model('Tour', tourSchema)

module.exports = Tour