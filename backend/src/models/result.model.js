import mongoose, {Schema} from "mongoose"
import {questionSchema} from "./quiz.model.js"

const resultSchema = new Schema({
    student : {
        type : Schema.Types.ObjectId,
        ref : "User"
    },
    quiz : {
        type : Schema.Types.ObjectId,
        ref : "User"
    },
    questions : [questionSchema],
    score : {
        type : Number,
        required : true
    },
    timeTaken : {
        type : Number,
        required : true
    }
}, {timestamps : true})

const Result = mongoose.model("Result", resultSchema)

export default Result
