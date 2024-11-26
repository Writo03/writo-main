import Quiz from "../models/quiz.model.js"
import asyncHandler from "../utils/asyncHandler.js"
import ApiError from "../utils/ApiError.js"
import ApiResponse from "../utils/ApiResponse.js"


const createQuiz = asyncHandler(async (req, res) => {
    try {
        const {name, description, duration, questions, subjects, isSubjectTest, isForFree, isForMentors, services} = req.body

        if(isForMentors && !req.user.isAdmin){
            throw new ApiError(400, "Only admins can create quiz for mentors")
        }

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
            isForFree,
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
        const {isSubjectTest, isForFree=false, isForMentors=false, serviceId} = req.query

        if(isForMentors && !req.user.isAdmin && !req.user.isMentor){
            throw new ApiError(400, "Only admins and mentors can get mentor quizes")
        }

        const quizes = await Quiz.find({isSubjectTest, isForFree, isForMentors, services : {$in : [serviceId]}})

        if(!quizes.length){
            throw new ApiError(404, "No quizes found")
        }

        res.status(200).json(new ApiResponse(200, "Quizes fetched successfully", quizes))

    } catch (error) {
        throw new ApiError(500, error?.message || "Something went wrong while fetching quizes")
    }
})

const getQuizesAll = asyncHandler(async (req, res) => {
    try {
        const {serviceId, isForMentors} = req.query

        if(!req.user.isAdmin && !req.user.isMentor){
            throw new ApiError(400, "Only admins and mentors can get all quizes")
        }

        const quizes = await Quiz.find({isForMentors, services : {$in : [serviceId]}})

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
        const {isUpdating=false} = req.query
        const quiz = await Quiz.findById(quizId)

        if(quiz.isForMentors && !req.user.isAdmin && !req.user.isMentor){
            throw new ApiError(400, "Only admins and mentors can get mentor quizes")
        }

        if(isUpdating && !req.user.isAdmin){
            throw new ApiError(400, "Only admins can update quiz for mentors")
        }

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
        const {name, description, duration, questions, subjects, isForFree, isForMentors, isSubjectTest, services} = req.body
        const {quizId} = req.params

        if(isForMentors && !req.user.isAdmin){
            throw new ApiError(400, "Only admins can update quiz for mentors")
        }

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
                isForFree,
                isForMentors,
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

export { createQuiz, getQuizes, getQuizById, updateQuiz, deleteQuiz, getQuizesAll }