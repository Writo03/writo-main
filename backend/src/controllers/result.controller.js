import Result from "../models/result.model.js"
import asyncHandler from "../utils/asyncHandler.js"
import ApiResponse from "../utils/ApiResponse.js"
import ApiError from "../utils/ApiError.js"
import mongoose from "mongoose"

const submitTest = asyncHandler(async (req, res) => {
  try {
    const { quizId, questions, timeTaken } = req.body
    if (!quizId || !questions.length || !timeTaken) {
      throw new ApiError(400, "All fields are required")
    }

    let score = 0
    for (let q of questions) {
      if (q.chosen !== "") {
        if (q.chosen === q.correct) {
          score += 4
        } else {
          score -= 1
        }
      }
    }

    await Result.create({
      student: req.user._id,
      quiz: quizId,
      questions,
      score,
      timeTaken,
    })

    res.status(201).json(new ApiResponse(201, "Test submitted successfully"))
  } catch (error) {
    throw new ApiError(
      500,
      error?.message || "Something went wrong while submitting test"
    )
  }
})

const getResult = asyncHandler(async (req, res) => {
  try {
    const { quizId } = req.params
    // depends on the way you handle multiple submissions of a single test
    const result = await Result.find({
      quiz: quizId,
      student: req.user._id,
    }).sort({ createdAt: -1 })

    if (!result.length) {
      throw new ApiError(404, "You have not taken this test yet")
    }

    res
      .status(200)
      .json(new ApiResponse(200, "Result fetched successfully", result))
  } catch (error) {
    throw new ApiError(
      500,
      error?.message || "Something went wrong while fetching result"
    )
  }
})

const getLeaderboard = asyncHandler(async (req, res) => {
  try {
    const { quizId } = req.params

    const leaderboard = await Result.aggregate([
      {
        $match: {
          quiz: new mongoose.Types.ObjectId(quizId),
        },
      },
      {
        $sort: {
          score: -1,
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "student",
          foreignField: "_id",
          as: "student",
          pipeline: [
            {
              $project: {
                fullName: 1,
                _id : 1
              },
            },
          ],
        },
      },
      {
        $addFields: {
          student: {
            $first: "$student",
          },
        },
      },
      {
        $project : {
            student : 1,
            score : 1,
            timeTaken : 1
        }
      }
    ])

    if(!leaderboard.length){
        throw new ApiError(404, "Students have not taken this test yet")
    }

    // get the rank of current student
    const studentRank = leaderboard.findIndex(student => student.student._id.toString() === req.user._id.toString())

    res.status(200).json(new ApiResponse(200, "Leaderboard fetched successfully", {
        leaderboard,
        studentRank
    }))

  } catch (error) {
    throw new ApiError(500, error?.message || "Something went wrong while fetching leaderboard")
  }
})

export { submitTest, getResult, getLeaderboard }
