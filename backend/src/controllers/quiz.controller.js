import Quiz from "../models/quiz.model.js";
import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";

const createQuiz = asyncHandler(async (req, res) => {
  try {
    const {
      name,
      description,
      duration,
      questions,
      subjects,
      isSubjectTest,
      isFree,
      isForMentors,
      services,
    } = req.body;

    if (isForMentors && !req.user.isAdmin) {
      throw new ApiError(400, "Only admins can create quiz for mentors");
    }

    if (
      !req.user.isAdmin &&
      (!req.user.isMentor || !req.user.role.includes("QUIZ"))
    ) {
      throw new ApiError(400, "Only admins and mentors can create quiz");
    }

    if (
      !name ||
      !description ||
      !duration ||
      !questions.length ||
      !subjects.length ||
      !services.length
    ) {
      throw new ApiError(400, "All fields are required");
    }

    const quiz = await Quiz.create({
      name,
      description,
      duration,
      subjects,
      isSubjectTest,
      services,
      isFree,
      questionNumber: questions.length,
      questions,
    });

    return res
      .status(201)
      .json(new ApiResponse(201, "Quiz created successfully", quiz));
  } catch (error) {
    throw new ApiError(
      500,
      error?.message || "Something went wrong while creating quiz",
    );
  }
});

const getQuizes = asyncHandler(async (req, res) => {
  console.log(new Date(), "request to getQuizes");
  try {
    const { isSubjectTest, isFree, isForMentors, serviceId } = req.query;
    // console.log("isSubjectTest", typeof isSubjectTest, isSubjectTest);
    // console.log("isFree", typeof isFree, isFree);
    // console.log("isForMentors", typeof isForMentors, isForMentors);
    // console.log("serviceId", typeof serviceId, serviceId);

    if (isForMentors && !req.user.isAdmin && !req.user.isMentor) {
      throw new ApiError(400, "Only admins and mentors can get mentor quizes");
    }

    let quizes;

    if (isFree === "true") {
      quizes = await Quiz.find({
        $or: [
          {
            isFree: isFree === "true",
            isSubjectTest: true,
            services: { $in: [serviceId] },
          },
          { isFree: isFree === "true", services: { $in: [serviceId] } },
        ],
      });
      // console.log("free:", quizes);
    } else {
      quizes = await Quiz.find({
        isSubjectTest: isSubjectTest === "true",
        isFree: isFree === "true",
        isForMentors: isForMentors === "true",
        services: { $in: [serviceId] },
      });
      // console.log(isSubjectTest, quizes);
    }

    if (quizes.length <= 0) {
      return res
        .status(209)
        .json(new ApiResponse(209, "No quizzes found", quizes));
    }

    res
      .status(200)
      .json(new ApiResponse(200, "Quizes fetched successfully", quizes));
  } catch (error) {
    throw new ApiError(
      500,
      error?.message || "Something went wrong while fetching quizes",
    );
  }
});

const getQuizesAll = asyncHandler(async (req, res) => {
  try {
    const { serviceId, isForMentors } = req.query;

    if (!req.user.isAdmin && !req.user.isMentor) {
      throw new ApiError(400, "Only admins and mentors can get all quizes");
    }

    const quizes = await Quiz.find({
      isForMentors,
      services: { $in: [serviceId] },
    });

    if (!quizes.length) {
      throw new ApiError(404, "No quizes found");
    }

    res
      .status(200)
      .json(new ApiResponse(200, "Quizes fetched successfully", quizes));
  } catch (error) {
    throw new ApiError(
      500,
      error?.message || "Something went wrong while fetching quizes",
    );
  }
});

const getAllMentorQuizes = asyncHandler(async(req, res) => {
  try {
    if(!req.user || !req.user.isMentor) {
      throw new ApiError(400, "Only mentors can get their quizes")
    }
    const quizes = await Quiz.find({isForMentors : true})
    if(!quizes.length) {
      throw new ApiError(404, "No quizes found")
    }
    res.status(200).json(new ApiResponse(200, "Quizes fetched successfully", quizes))
  } catch (error) {
    throw new ApiError(
      500,
      error?.message || "Something went wrong while fetching quizes",
    )
  }
})

const getQuizById = asyncHandler(async (req, res) => {
  try {
    const { quizId } = req.params;
    const { isUpdating = false } = req.query;
    const quiz = await Quiz.findById(quizId);

    if (quiz.isForMentors && !req.user.isAdmin && !req.user.isMentor) {
      throw new ApiError(400, "Only admins and mentors can get mentor quizes");
    }

    if (isUpdating && !req.user.isAdmin) {
      throw new ApiError(400, "Only admins can update quiz for mentors");
    }

    if (!quiz) {
      throw new ApiError(404, "Quiz not found");
    }

    res
      .status(200)
      .json(new ApiResponse(200, "Quiz fetched successfully", quiz));
  } catch (error) {
    throw new ApiError(
      500,
      error?.message || "Something went wrong while fetching quiz",
    );
  }
});

const updateQuiz = asyncHandler(async (req, res) => {
  try {
    if (
      !req.user.isAdmin &&
      (!req.user.isMentor || !req.user.role.includes("QUIZ"))
    ) {
      throw new ApiError(400, "Only admins and mentors can update quiz");
    }
    const {
      name,
      description,
      duration,
      questions,
      subjects,
      isFree,
      isForMentors,
      isSubjectTest,
      services,
    } = req.body;
    const { quizId } = req.params;

    if (isForMentors && !req.user.isAdmin) {
      throw new ApiError(400, "Only admins can update quiz for mentors");
    }

    if (
      !name ||
      !description ||
      !duration ||
      !questions.length ||
      !subjects.length ||
      !services.length
    ) {
      throw new ApiError(400, "All fields are required");
    }

    const quiz = await Quiz.findByIdAndUpdate(
      quizId,
      {
        $set: {
          name,
          description,
          duration,
          subjects,
          isSubjectTest,
          isFree,
          isForMentors,
          services,
          questionNumber: questions.length,
          questions,
        },
      },
      { new: true },
    );

    if (!quiz) {
      throw new ApiError(404, "Quiz not found");
    }

    return res
      .status(201)
      .json(new ApiResponse(201, "Quiz updated successfully", quiz));
  } catch (error) {
    throw new ApiError(
      500,
      error?.message || "Something went wrong while updating quiz",
    );
  }
});

const deleteQuiz = asyncHandler(async (req, res) => {
  try {
    const { quizId } = req.params;

    if (
      !req.user.isAdmin &&
      (!req.user.isMentor || !req.user.role.includes("QUIZ"))
    ) {
      throw new ApiError(400, "Only admins and mentors can delete quiz");
    }

    const quiz = await Quiz.findByIdAndDelete(quizId);

    if (!quiz) {
      throw new ApiError(404, "Quiz not found");
    }

    return res
      .status(200)
      .json(new ApiResponse(200, "Quiz deleted successfully"));
  } catch (error) {
    throw new ApiError(
      500,
      error?.message || "Something went wrong while deleting quiz",
    );
  }
});

export {
  createQuiz,
  getQuizes,
  getQuizById,
  updateQuiz,
  deleteQuiz,
  getQuizesAll,
  getAllMentorQuizes
};
