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

        if(!name || !description || !duration || !questions.length || !subjects.length || !services.length){
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

const getQuizes = asyncHandler(async (req, res) => {
    try {
        const {isSubjectTest, serviceId} = req.query

        const quizes = await Quiz.find({isSubjectTest, services : {$in : [serviceId]}})

        if(!quizes.length){
            throw new ApiError(404, "No quizes found")
        }

        res.status(200).json(new ApiResponse(200, "Quizes fetched successfully", quizes))

    } catch (error) {
        throw new ApiError(500, error?.message || "Something went wrong while fetching quizes")
    }
})

const getQuizById = asyncHandler(async (req, res) => {
    try {
        const {quizId} = req.params
        const quiz = await Quiz.findById(quizId)

        if(!quiz){
            throw new ApiError(404, "Quiz not found")
        }

        res.status(200).json(new ApiResponse(200, "Quiz fetched successfully", quiz))

    } catch (error) {
        throw new ApiError(500, error?.message || "Something went wrong while fetching quiz")
    }
})

const updateQuiz = asyncHandler(async (req, res) => {
    try {
        if(!req.user.isAdmin && !req.user.isMentor){
            throw new ApiError(400, "Only admins and mentors can update quiz")
        }
        const {name, description, duration, questions, subjects, isSubjectTest, services} = req.body
        const {quizId} = req.params

        if(!name || !description || !duration || !questions.length || !subjects.length || !services.length){
            throw new ApiError(400, "All fields are required")
        }

        const quiz = await Quiz.findByIdAndUpdate(quizId, {
            $set : {
                name,
                description,
                duration,
                subjects,
                isSubjectTest,
                services,
                questionNumber : questions.length,
                questions
            }
        }, {new : true})

        if(!quiz){
            throw new ApiError(404, "Quiz not found")
        }

        return res.status(201).json(new ApiResponse(201, "Quiz updated successfully", quiz))
    } catch (error) {
        throw new ApiError(500, error?.message || "Something went wrong while updating quiz")
    }
})

const deleteQuiz = asyncHandler(async (req, res) => {
    try {
        const {quizId} = req.params
        const quiz = await Quiz.findByIdAndDelete(quizId)

        if(!quiz){
            throw new ApiError(404, "Quiz not found")
        }

        return res.status(200).json(new ApiResponse(200, "Quiz deleted successfully"))
    } catch (error) {
        throw new ApiError(500, error?.message || "Something went wrong while deleting quiz")
    }
})

export { createQuiz, getQuizes, getQuizById, updateQuiz, deleteQuiz }