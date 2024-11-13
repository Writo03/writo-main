import mongoose, {Schema} from "mongoose"

const subscriptionSchema = new mongoose.Schema({
    name : {
        type : String,
        required : true
    },
    service : {
        type : Schema.Types.ObjectId,
        ref : "Service"
    },
    student : {
        type : Schema.Types.ObjectId,
        ref : "User"
    },
    startDate : {
        type : Date,
        required : true
    },
    endDate : {
        type : Date,
        required : true
    },
    isExpired : {
        type : Boolean,
        default : false
    }
})

const Subscription = mongoose.model("Subscription", subscriptionSchema)

export default Subscription