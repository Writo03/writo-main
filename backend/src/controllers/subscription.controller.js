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
      serviceId,
      serviceName,
    } = req.body

    const sha = crypto.createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
    sha.update(`${order_id}|${razorpay_payment_id}`)
    const digest = sha.digest("hex")

    if(digest !== razorpay_signature){
        throw new ApiError(400, "Payment verification failed")
    }

    const expiryDate = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)

    //if user is renewing the service 
    const oldSubscription = await Subscription.findOne({service : serviceId, student : req.user._id})
    
    if(oldSubscription){
      let oldExp = new Date(oldSubscription.endDate)
      if(oldExp > Date.now()){
        oldSubscription.endDate = new Date(oldExp.getTime() + 30 * 24 * 60 * 60 * 1000)
        await oldSubscription.save({validateBeforeSave : false})
        return res.status(200).json(new ApiResponse(200, "Payment verified successfully - Subscription extended", oldSubscription))
      } else {
        oldSubscription.endDate = expiryDate
        oldSubscription.startDate = Date.now()
        await oldSubscription.save({validateBeforeSave : false})
        return res.status(200).json(new ApiResponse(200, "Payment verified successfully - Subscription renewed", oldSubscription))
      }
    }


    const subscription = await Subscription.create({
        name : serviceName,
        service : serviceId,
        startDate : Date.now(),
        endDate : expiryDate,
        student : req.user._id,
        isExpired : false
    })

    return res.status(200).json(new ApiResponse(200, "Payment verified successfully - service subscribed", subscription))

  } catch (error) {
    throw new ApiError(500, error?.message || "Something went wrong while verifying payment")
  }
})

const getUserServices = asyncHandler(async(req, res) => {
  try {
    const {type} = req.query
    let subscriptions;

    if(type === "active"){
      subscriptions = await Subscription.find({student : req.user._id, endDate : {$gt : Date.now()} })
    }else if(type === "expired"){
      subscriptions = await Subscription.find({student : req.user._id, endDate : {$lt : Date.now()} })
    }else {
      subscriptions = await Subscription.find({student : req.user._id})
    }

    if(!subscriptions.length){
      throw new ApiError(404, "No subscriptions found")
    }

    return res.status(200).json(new ApiResponse(200, "subscriptions fetched successfully", subscriptions))

  } catch (error) {
    throw new ApiError(500, error?.message || "Something went wrong while fetching subscriptions")
  }
})

export { createOrder, verifyPayment, getUserServices }
