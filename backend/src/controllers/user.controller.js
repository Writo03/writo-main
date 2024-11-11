import User from '../models/user.model.js'
import ApiError from '../utils/ApiError.js'
import ApiResponse from '../utils/ApiResponse.js'
import asyncHandler from '../utils/asyncHandler.js'
import jwt from 'jsonwebtoken'



const options = {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
}; 



const generateTokens= async (userid)=>{
    try {
        const user = await User.findById(userid);
        const accessToken =await user.generateAccessToken()
        const refreshToken = await user.generateRefreshToken()

        // attach refresh token to the user document to avoid refreshing the access token with multiple refresh tokens
        user.refreshToken = refreshToken;

        await user.save({validateBeforeSave:false})
        return { accessToken, refreshToken };
    } catch (error) {
        throw new ApiError(
            500,
            'Something went wrong while generating the access token'
          );
    }

  }

  const userRegister=asyncHandler(async (req,res,next)=>{
    
    const {email,password,fullName,phone,target} = req.body;

    if (!email || !password || !fullName || !phone || !target) {
        throw new ApiError(400,'All feilds are requried')
    }

    const existinguser = await User.find({
        email:email
    })
  

    if (existinguser.length>0) {
        throw new ApiError(400,'User Already exists')
    }

    const user = await User.create({
        email:email,
        password:password,
        fullName,
        phone,
        target
    })

   

    const createdUser = await User.findById(user._id).select(
        '-password'
    )
    if (!createdUser) {
        throw new ApiError(500, 'Something went wrong while registering the user');
      }
      
     return res
     .status(200)
     .json(
        new ApiResponse(200, 
        { user: createdUser },
        'Users registered successfully'
    )
    ) 
  })


  const userLogin=asyncHandler(async (req,res,next)=>{
    const {email,password} = req.body;
 
    if (!email || !password ) {
     throw new ApiError(400,'All feilds are requried')
     }
     
     const user= await User.findOne({email})
     console.log(user)
     if (!user) {
         throw new ApiError(404, 'User does not exist')
     }

     const isPasswordvaild = await user.isPasswordCorrect(password)
     
     if (!isPasswordvaild) {
         throw new ApiError(
             401,
             'Invaild Password'
         )
     }
 
     const {accessToken,refreshToken}=await generateTokens(user._id);
 
     const loggedInUser = await User.findById(user._id).select(
         "-password -refreshToken "
     )
 
     
     if (!loggedInUser) {
         throw new ApiError(500, 'Error while fetching user')
     }
     return res
     .status(200)
     .cookie('accessToken',accessToken,options)
     .cookie('refreshToken',refreshToken,options)
     .json(new ApiResponse(200 ,
         { user: loggedInUser, accessToken, refreshToken }, 
         'User logged in successfully'
     ))
 
   })
 


  export {
    userRegister,
    userLogin
  }
