import mongoose, {Schema} from "mongoose"

export const questionSchema = new Schema({
    question : {
        type : String
    },
    image : {
        type : String
    },
    options : [{
        type : String
    }],
    correct : {
        type : String,
        required : true
    },
    chosen : {
        type : String,
        default : ""
    }
})

const quizSchema = new Schema({
    name : {
        type : String,
        required : true
    },
    description : {
        type : String,
        required : true
    },
    duration : {
        type : Number,
        required : true
    },
    questionNumber : {
        type : Number,
        required : true
    },
    subjects : [{
        type : String
    }],
    isSubjectTest : {
        type : Boolean,
        default : false
    },
    isForFree : {
        type : Boolean,
        default : false
    },
    isForMentors : {
        type : Boolean,
        default : false
    },
    services : [{
        type : Schema.Types.ObjectId,
        ref : "Service"
    }],
    questions : [questionSchema]

}, {
    timestamps : true
})

const Quiz = mongoose.model("Quiz", quizSchema)

export default Quiz