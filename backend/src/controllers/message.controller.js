import Chat from "../models/chat.model.js"
import ChatMessage from "../models/message.model.js"
import asyncHandler from "../utils/asyncHandler.js"
import ApiResponse from "../utils/ApiResponse.js"
import ApiError from "../utils/ApiError.js"
import { ChatEventEnum } from "../constants.js"
import { emitSocketEvent } from "../socket/index.js"
import mongoose from "mongoose"

const chatMessageCommonAggregation = () => {
  return [
    {
      $lookup: {
        from: "users",
        localField: "sender",
        foreignField: "_id",
        as: "sender",
        pipeline: [
          {
            $project: {
              fullName: 1,
              profilePic: 1,
              email: 1,
            },
          },
        ],
      },
    },
    {
      $addFields: {
        sender: {
          $first: "$sender",
        },
      },
    },
  ]
}

const getAllMessages = asyncHandler(async (req, res) => {
  try {
    const { chatId } = req.params

    const chat = await Chat.findById(chatId)

    if (!chat) {
      throw new ApiError(404, "Chat not found")
    }
    // check he is part of the chat
    if (!chat.participants.includes(req.user._id)) {
      throw new ApiError(400, "You are not part of this chat")
    }

    const messages = await ChatMessage.aggregate([
      {
        $match: {
          chat: new mongoose.Types.ObjectId(chatId),
        },
      },
      ...chatMessageCommonAggregation(),
      {
        $sort: {
          createdAt: -1,
        },
      },
    ])

    return res
      .status(200)
      .json(new ApiResponse(200, "Messages fetched successfully", messages))
  } catch (error) {
    throw new ApiError(
      500,
      error?.message || "Something went wrong while fetching messages"
    )
  }
})

const sendMessage = asyncHandler(async (req, res) => {
  try {
    const { chatId } = req.params
    const { content, attachments = [] } = req.body

    if (!content && !attachments.length) {
      throw new ApiError(400, "Content and attachments are required")
    }

    const chat = await Chat.findById(chatId)

    if (!chat) {
      throw new ApiError(404, "Chat not found")
    }

    if (!chat.participants.includes(req.user._id)) {
      throw new ApiError(400, "You are not part of this chat")
    }

    const message = await ChatMessage.create({
      sender: req.user._id,
      content,
      attachments,
      chat: chat._id,
    })

    chat.lastMessage = message._id
    await chat.save({ validateBeforeSave: false })

    const messages = await ChatMessage.aggregate([
      {
        $match: {
          _id: new mongoose.Types.ObjectId(message._id),
        },
      },
      ...chatMessageCommonAggregation(),
    ])

    const receivedMessage = messages[0]

    if (!receivedMessage) {
      throw new ApiError(500, "Internal server error")
    }

    chat.participants.forEach((id) => {
      if (id.toString() === req.user._id.toString()) return

      emitSocketEvent(
        req,
        id.toString(),
        ChatEventEnum.MESSAGE_RECEIVED_EVENT,
        receivedMessage
      )
    })

    return res
      .status(200)
      .json(new ApiResponse(200, "Message sent successfully", receivedMessage))
  } catch (error) {
    throw new ApiError(
      500,
      error?.message || "Something went wrong while sending message"
    )
  }
})

const sendMessageToAllStudents = asyncHandler(async (req, res) => {
  try {
    const { content } = req.body
    if (!req.user || !req.user.isMentor || !req.user.role.includes("CHAT")) {
      throw new ApiError(
        400,
        "Only mentors with chat role can send message to all students"
      )
    }
    //get all the mentor chats
    const chats = await Chat.find({
      isMentorChat: true,
      mentor: req.user._id,
      isPrimary: true,
    })

    if (!chats.length) {
      throw new ApiError(404, "No primary chat found")
    }

    chats.forEach(async (chat) => {
      const message = await ChatMessage.create({
        sender: req.user._id,
        content,
        attachments: [],
        chat: chat._id,
      })

      chat.lastMessage = message._id
      await chat.save({ validateBeforeSave: false })

      const messages = await ChatMessage.aggregate([
        {
          $match: {
            _id: new mongoose.Types.ObjectId(message._id),
          },
        },
        ...chatMessageCommonAggregation(),
      ])

      const receivedMessage = messages[0]

      chat.participants.forEach((id) => {
        if (id.toString() === req.user._id.toString()) return

        emitSocketEvent(
          req,
          id.toString(),
          ChatEventEnum.MESSAGE_RECEIVED_EVENT,
          receivedMessage
        )
      })
    })

    return res
      .status(200)
      .json(new ApiResponse(200, "Message broadcasted successfully"))
  } catch (error) {
    throw new ApiError(
      500,
      error?.message || "Something went wrong while sending message to all students"
    )
  }
})

const deleteMessage = asyncHandler(async (req, res) => {
  try {
    const { chatId, messageId } = req.params
    const chat = await Chat.findOne({
      _id: chatId,
      participants: req.user._id,
    })

    if (!chat) {
      throw new ApiError(404, "Chat not found")
    }

    const message = await ChatMessage.findById(messageId)

    if (!message) {
      throw new ApiError(404, "Message not found")
    }

    if (message.sender.toString() !== req.user._id.toString()) {
      throw new ApiError(
        400,
        "You are not allowed to delete this message. You are not sender."
      )
    }

    await ChatMessage.findByIdAndDelete(messageId)

    //update the last message of the chat
    if (chat.lastMessage.toString() === message._id.toString()) {
      const lastMessage = await ChatMessage.findOne(
        {
          chat: chatId,
        },
        {},
        {
          sort: {
            createdAt: -1,
          },
        }
      )

      chat.lastMessage = lastMessage ? lastMessage._id : null
      chat.save({ validateBeforeSave: false })
    }

    chat.participants.forEach((parId) => {
      if (parId.toString() === req.user._id.toString()) return
      emitSocketEvent(
        req,
        parId.toString(),
        ChatEventEnum.MESSAGE_DELETE_EVENT,
        message
      )
    })

    return res
      .status(200)
      .json(new ApiResponse(200, "Message deleted successfully"))
  } catch (error) {
    throw new ApiError(
      500,
      error?.message || "Something went wrong while deleting message"
    )
  }
})

export { getAllMessages, sendMessage, sendMessageToAllStudents, deleteMessage }
