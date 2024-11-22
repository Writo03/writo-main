
import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import Contact from "../models/contact.model.js";

const createMeggage = asyncHandler(async (req, res) => {
  try {
    const { email, fullName, message, subject, phone } = req.body;

    if (!email || !email.length) {
      throw new ApiError(400, "Email is required");
    }
    if (!message || !message.length) {
      throw new ApiError(400, "Message is required");
    }

    const feedback = await Contact.create({
      email,
      fullName,
      message,
      subject,
      phone,
    });

    return res
      .status(201)
      .json(new ApiResponse(201, "Message Sent successfully", feedback));
  } catch (error) {
    throw new ApiError(
      500,
      error?.message || "Something went wrong while saving message"
    );
  }
});

const getMessageByEmail = asyncHandler(async (req, res) => {
  try {
    const message = await Contact.find({ email: req.params.email });

    if (!message) {
      throw new ApiError(404, "Message not found");
    }

    res
      .status(200)
      .json(new ApiResponse(200, "Message fetched successfully", message));
  } catch (error) {
    throw new ApiError(
      500,
      error?.message || "Something went wrong while fetching message"
    );
  }
});

const getMessageBySubject = asyncHandler(async (req, res) => {
  try {
    const message = await Contact.find({ subject: req.params.subject });

    if (!message.length) {
      throw new ApiError(404, "Message not found");
    }

    res
      .status(200)
      .json(new ApiResponse(200, "Message fetched successfully", message));
  } catch (error) {
    throw new ApiError(
      500,
      error?.message || "Something went wrong while fetching message"
    );
  }
});

const getMessageById = asyncHandler(async (req, res) => {
  try {
    const message = await Contact.findById(req.params.id);

    if (!message) {
      throw new ApiError(404, "Message not found");
    }

    res
      .status(200)
      .json(new ApiResponse(200, "Message fetched successfully", message));
  } catch (error) {
    throw new ApiError(
      500,
      error?.message || "Something went wrong while fetching message"
    );
  }
});

const getAllMessages = asyncHandler(async (req, res) => {
  try {
    const messages = await Contact.find();

    if (!messages.length) {
      throw new ApiError(404, "No messages found");
    }

    res
      .status(200)
      .json(new ApiResponse(200, "Messages fetched successfully", messages));
  } catch (error) {
    throw new ApiError(
      500,
      error?.message || "Something went wrong while fetching messages"
    );
  }
});

const deleteMessage = asyncHandler(async (req, res) => {
  try {
    const message = await Contact.findByIdAndDelete(req.params.id);

    if (!message) {
      throw new ApiError(404, "Message not found");
    }

    res
      .status(200)
      .json(new ApiResponse(200, "Message deleted successfully", message));
  } catch (error) {
    throw new ApiError(
      500,
      error?.message || "Something went wrong while deleting message"
    );
  }
});

export {
  createMeggage,
  getMessageById,
  getMessageByEmail,
  getMessageBySubject,
  getAllMessages,
  deleteMessage,
};
