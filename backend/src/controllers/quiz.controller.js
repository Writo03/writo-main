import Quiz from "../models/quiz.model.js"
import asyncHandler from "../utils/asyncHandler.js"
import ApiError from "../utils/ApiError.js"
import ApiResponse from "../utils/ApiResponse.js"


const createQuiz = asyncHandler(async (req, res) => {
    try {
        const {name, description, duration, questions, subjects, isSubjectTest, services} = req.body

        if(!req.user.isAdmin && !req.user.isMentor){
            throw new ApiError(400, "Only admins and mentors can create quiz")
        }

        if([name, description, duration, questions, subjects, isSubjectTest, services].some((field) => field?.trim() === "")){
            throw new ApiError(400, "All fields are required")
        }

        const quiz = await Quiz.create({
            name,
            description,
            duration,
            subjects,
            isSubjectTest,
            services,
            questionNumber : questions.length,
            questions
        })

        return res.status(201).json(new ApiResponse(201, "Quiz created successfully", quiz))

    } catch (error) {
        throw new ApiError(500, error?.message || "Something went wrong while creating quiz")
    }
})

export { createQuiz }