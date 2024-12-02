import Chat from "../models/chat.model.js"
import User from "../models/user.model.js"
import asyncHandler from "../utils/asyncHandler.js"
import ApiResponse from "../utils/ApiResponse.js"
import ApiError from "../utils/ApiError.js"
import { ChatEventEnum } from "../constants.js"
import { emitSocketEvent } from "../socket/index.js"

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
    })
      .sort({ studentCount: -1 })
      .limit(1)

    if (!availableMentor.length) {
      throw new ApiError(
        404,
        "No mentor is available at this moment please try again later"
      )
    }

    const chat = await Chat.create({
      subject,
      isMentorChat: true,
      mentor: availableMentor[0]._id,
      isPrimary,
      participants: [req.user._id, availableMentor[0]._id],
    })

    if (!chat) {
      throw new ApiError(500, "Something went wrong while creating chat")
    }

    emitSocketEvent(
      req,
      availableMentor[0]._id,
      ChatEventEnum.NEW_CHAT_EVENT,
      chat
    )

    availableMentor[0].studentCount += 1
    availableMentor[0].save({ validateBeforeSave: false })

    return res
      .status(201)
      .json(new ApiResponse(201, "Chat created successfully", chat._id))
  } catch (error) {
    throw new ApiError(
      500,
      error?.message || "Something went wrong while creating chat"
    )
  }
})

const getAllChats = asyncHandler(async (req, res) => {
  try {
    const { isPrimary=true } = req.query
    const chats = await Chat.aggregate([
      {
        $match: {
          isPrimary,
          participants: {
            $elemMatch: {
              $eq: req.user._id,
            },
          },
        },
      },
      {
        $sort: {
          updatedAt: -1,
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "participants",
          foreignField: "_id",
          as: "participants",
          pipeline: [
            {
              $project: {
                refreshToken: 0,
                password: 0,
                isAdmin: 0,
                target: 0,
                institution: 0,
                studentCount: 0,
              },
            },
          ],
        },
      },
      {
        $lookup: {
          from: "chatmessages",
          foreignField: "_id",
          localField: "lastMessage",
          as: "lastMessage",
          pipeline: [
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
          ],
        },
      },
      {
        $addFields: {
          lastMessage: {
            $first: "$lastMessage",
          },
        },
      },
    ])
    if (!chats.length) {
      throw new ApiError(404, "No chat found")
    }

    return res
      .status(200)
      .json(new ApiResponse(200, "Chats fetched successfully", chats))
  } catch (error) {
    throw new ApiError(
      500,
      error?.message || "Something went wrong while fetching chats"
    )
  }
})

export { createOrGetMentorChat, getAllChats }