import Result from "../models/result.model.js"
import asyncHandler from "../utils/asyncHandler.js"
import ApiResponse from "../utils/ApiResponse.js"
import ApiError from "../utils/ApiError.js"


const submitTest = asyncHandler(async(req, res) => {
    try {
        const {quizId, questions, score, timeTaken} = req.body
        if(!quizId || !questions.length || !score || !timeTaken){
            throw new ApiError(400, "All fields are required")
        }

        const result = await Result.create({
            student : req.user._id,
            quiz : quizId,
            questions,
            score,
            timeTaken
        })

        res.status(201).json(new ApiResponse(201, "Test submitted successfully", result._id))

    } catch (error) {
        throw new ApiError(500, error?.message || "Something went wrong while submitting test")
    }
})