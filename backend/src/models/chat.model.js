import mongoose from "mongoose"

const chatSchema = new mongoose.Schema({
    subject : {
        type : String,
        require : true,
        trim : true,
        index : true
    },
    isMentorChat : {
        type : Boolean,
        default : false
    },
    isPrimary : {
        type : String,
        default : true
    },
    mentor : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "User"
    },
    participants : [{
        type : mongoose.Schema.Types.ObjectId,
        ref : "User"
    }],
    lastMessage : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "ChatMessage"
    }
}, {timestamps : true})

const Chat = mongoose.model("Chat", chatSchema)
export default Chat