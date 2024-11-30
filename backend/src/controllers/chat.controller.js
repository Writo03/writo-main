import Chat from "../models/chat.model.js"
import User from "../models/user.model.js"
import ChatMessage from "../models/message.model.js"
import asyncHandler from "../utils/asyncHandler.js"
import ApiResponse from "../utils/ApiResponse.js"
import ApiError from "../utils/ApiError.js"
import { ChatEventEnum } from "../constants.js"
import { emitSocketEvent } from "../socket"
import mongoose from "mongoose"

const createOrGetMentorChat = asyncHandler(async (req, res) => {
  try {
    const { subject } = req.params
    let isPrimary = true
    //insure there is no previously created chat for this subject by user secondary or primary

    const chats = await Chat.aggregate([
      {
        $match: {
          subject,
          isMentorChat: true,
          participants: { $in: [req.user._id] },
        },
      },
      {
        $sort: {
          createdAt: 1,
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "mentor",
          foreignField: "_id",
          as: "mentor",
          pipeline: [
            {
              $project: {
                onLeave: 1,
                onBreak: 1,
                fullName: 1,
              },
            },
          ],
        },
      },
      {
        $addFields: {
          mentor: {
            $first: "$mentor",
          },
        },
      },
    ])

    console.log(chats)

    //if there is existing chat check if mentor is available and return chat id
    if (chats.length) {
      isPrimary = false
      for (let i = 0; i < chats.length; i++) {
        let mentorDetails = chats[i].mentor
        if (!mentorDetails.onLeave && !mentorDetails.onBreak) {
          return res
            .status(200)
            .json(new ApiResponse(200, "Chat found", chats[i]._id))
        }
      }
    }

    //else find a new mentor and create chat
    //we have to make sure students are distributed equally
    const availableMentor = await User.find({
      isMentor: true,
      subject,
      onLeave: false,
      onBreak: false,
    }).sort({studentCount : 1}).limit(1)

    if(!availableMentor.length){
      throw new ApiError(404, "No mentor is available at this moment please try again later")
    }

    const chat = await Chat.create({
        subject,
        isMentorChat : true,
        mentor : availableMentor[0]._id,
        isPrimary,
        participants : [req.user._id]
    })

    if(!chat){
      throw new ApiError(500, "Something went wrong while creating chat")
    }

    emitSocketEvent(req, availableMentor[0]._id, ChatEventEnum.NEW_CHAT_EVENT, chat)

    return res.status(201).json(new ApiResponse(201, "Chat created successfully", chat))

  } catch (error) {
    throw new ApiError(500, error?.message || "Something went wrong while creating chat")
  }
})
