import Subscription from "../models/subscription.model.js"
import asyncHandler from "../utils/asyncHandler.js"
import ApiResponse from "../utils/ApiResponse.js"
import ApiError from "../utils/ApiError.js"
import Razorpay from "razorpay"
import crypto from "crypto"

let instance = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
})

const createOrder = asyncHandler(async (req, res) => {
  try {
    const { amount } = req.body

    const options = {
      amount: amount * 100,
      currency: "INR",
      receipt: crypto.randomBytes(10).toString("hex"),
    }

    const order = await instance.orders.create(options)

    return res
      .status(200)
      .json(new ApiResponse(200, "Order created successfully", order))
  } catch (error) {
    throw new ApiError(
      500,
      error?.message || "Something went wrong while creating order"
    )
  }
})

const verifyPayment = asyncHandler(async (req, res) => {
  try {
    const {
      razorpay_payment_id,
      razorpay_signature,
      order_id,
      userId,
      serviceId,
      serviceName,
    } = req.body

    const sha = crypto.createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
    sha.update(`${order_id}|${razorpay_payment_id}`)
    const digest = sha.digest("hex")

    if(digest !== razorpay_signature){
        throw new ApiError(400, "Payment verification failed")
    }

    const subscription = await Subscription.create({
        name : serviceName,
        service : serviceId,
        startDate : Date.now()
    })

  } catch (error) {}
})

export { createOrder }
