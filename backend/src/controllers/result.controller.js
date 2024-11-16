import Result from "../models/result.model.js"
import asyncHandler from "../utils/asyncHandler.js"
import ApiResponse from "../utils/ApiResponse.js"
import ApiError from "../utils/ApiError.js"


const submitTest = asyncHandler(async(req, res) => {
    try {
        const {quizId, questions, timeTaken} = req.body
        if(!quizId || !questions.length || !score || !timeTaken){
            throw new ApiError(400, "All fields are required")
        }

        let score = 0
        for(let q of questions){
            if(q.chosen !== ""){
                if(q.chosen === q.correct){
                    score += 4
                }else{
                    score -= 1
                }
            }
        }

        const result = await Result.create({
            student : req.user._id,
            quiz : quizId,
            questions,
            score,
            timeTaken
        })

        res.status(201).json(new ApiResponse(201, "Test submitted successfully"))

    } catch (error) {
        throw new ApiError(500, error?.message || "Something went wrong while submitting test")
    }
})

export {submitTest}