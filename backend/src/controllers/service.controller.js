import Service from "../models/service.model.js"
import asyncHandler from "../utils/asyncHandler.js"
import ApiError from "../utils/ApiError.js"
import ApiResponse from "../utils/ApiResponse.js"

const addService = asyncHandler(async (req, res) => {
  try {
    const { name, description, price, discount } = req.body

    if (!req.user || !req.user.isAdmin) {
      throw new ApiError(400, "Only admins can add services")
    }

    if (!name || !description || !price) {
      throw new ApiError(400, "All feilds are requried")
    }

    const service = await Service.create({
      name,
      description,
      price,
      discount,
    })

    return res
      .status(200)
      .json(new ApiResponse(200, "Service added successfully", service))
  } catch (error) {
    throw new ApiError(
      500,
      error?.message || "Something went wrong while adding service"
    )
  }
})

const updateService = asyncHandler(async (req, res) => {
  try {
    if (!req.user || !req.user.isAdmin) {
      throw new ApiError(400, "Only admins can update services")
    }

    const { description, price, discount, name } = req.body
    const { serviceId } = req.params

    const updatedService = await Service.findByIdAndUpdate(
      serviceId,
      {
        $set: {
          name,
          description,
          price,
          discount,
        },
      },
      { new: true }
    )

    if (!updatedService) {
      throw new ApiError(404, "Service not found")
    }

    return res
      .status(201)
      .json(
        new ApiResponse(201, "Service updated successfully", updatedService)
      )
  } catch (error) {
    throw new ApiError(
      500,
      error?.message || "Something went wrong while updating service"
    )
  }
})

const getServices = asyncHandler(async (req, res) => {
  try {
    const services = await Service.find()
    if (!services.length) {
      throw new ApiError(404, "No services found")
    }
    return res
      .status(200)
      .json(new ApiResponse(200, "Services fetched successfully", services))
  } catch (error) {
    throw new ApiError(
      500,
      error?.message || "Something went wrong while fetching services"
    )
  }
})

const getServiceById = asyncHandler(async (req, res) => {
  try {
    const { serviceId } = req.params
    const service = await Service.findById(serviceId)

    if (!service) {
      throw new ApiError(404, "Service not found")
    }
    return res
      .status(200)
      .json(new ApiResponse(200, "Service fetched successfully", service))
  } catch (error) {
    throw new ApiError(
      500,
      error?.message || "Something went wrong while fetching service"
    )
  }
})

const deleteService = asyncHandler(async (req, res) => {
  try {
    const { serviceId } = req.params
    if (!req.user || !req.user.isAdmin) {
      throw new ApiError(400, "Only admins can delete services")
    }

    const service = await Service.findByIdAndDelete(serviceId)

    if (!service) {
      throw new ApiError(404, "Service not found")
    }
    return res
      .status(200)
      .json(new ApiResponse(200, "Service deleted successfully"))
  } catch (error) {
    throw new ApiError(
      500,
      error?.message || "Something went wrong while deleting the service"
    )
  }
})

export { addService, updateService, getServices, getServiceById, deleteService }
