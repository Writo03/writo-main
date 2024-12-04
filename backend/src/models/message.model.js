import mongoose, { Schema } from "mongoose"

const messageSchema = new Schema({
  sender: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  content: {
    type: String,
  },
  attachments: {
    type: [{ url: String}],
    default : []
  },
  chat : {
    type : Schema.Types.ObjectId,
    ref : "Chat"
  }
}, {timestamps : true})

const ChatMessage = mongoose.model("ChatMessage", messageSchema)
export default ChatMessage