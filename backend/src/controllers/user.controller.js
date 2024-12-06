import Subscription from "../models/subscription.model.js"
import User from "../models/user.model.js"
import ApiError from "../utils/ApiError.js"
import ApiResponse from "../utils/ApiResponse.js"
import asyncHandler from "../utils/asyncHandler.js"

const options = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
}

const generateTokens = async (userid) => {
  try {
    const user = await User.findById(userid)
    const accessToken = await user.generateAccessToken()
    const refreshToken = await user.generateRefreshToken()

    // attach refresh token to the user document to avoid refreshing the access token with multiple refresh tokens
    user.refreshToken = refreshToken

    await user.save({ validateBeforeSave: false })
    return { accessToken, refreshToken }
  } catch (error) {
    throw new ApiError(
      500,
      "Something went wrong while generating the access token"
    )
  }
}

const userRegister = asyncHandler(async (req, res, next) => {
  const { email, password, fullName, phone, target } = req.body

  if (!email || !password || !fullName || !phone || !target) {
    throw new ApiError(400, "All feilds are requried")
  }

  const existinguser = await User.find({
    email: email,
  })

  if (existinguser.length > 0) {
    throw new ApiError(400, "User Already exists")
  }

  const user = await User.create({
    email: email,
    password: password,
    fullName,
    phone,
    target,
  })

  const createdUser = await User.findById(user._id).select("-password")
  if (!createdUser) {
    throw new ApiError(500, "Something went wrong while registering the user")
  }

  return res.status(200).json(
    new ApiResponse(200, "Users registered successfully", {
      user: createdUser,
    })
  )
})

const userLogin = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body

  if (!email || !password) {
    throw new ApiError(400, "All feilds are requried")
  }

  const user = await User.findOne({ email })
  if (!user) {
    throw new ApiError(404, "User does not exist")
  }

  const isPasswordvaild = await user.isPasswordCorrect(password)

  if (!isPasswordvaild) {
    throw new ApiError(401, "Invaild Password")
  }

  const { accessToken, refreshToken } = await generateTokens(user._id)

  const loggedInUser = await User.findById(user._id).select(
    "-password -refreshToken "
  )

  if (!loggedInUser) {
    throw new ApiError(500, "Error while fetching user")
  }
  return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
      new ApiResponse(200, "User logged in successfully", {
        user: loggedInUser,
        accessToken,
        refreshToken,
      })
    )
})

const registerAdmin = asyncHandler(async (req, res) => {
  try {
    const { email, password, fullName, phone } = req.body
    if (!req.user || !req.user.isAdmin) {
      throw new ApiError(400, "Only admins can register admin")
    }

    if (!email || !password || !fullName) {
      throw new ApiError(400, "All feilds are requried")
    }

    await User.create({
      email,
      password,
      fullName,
      phone,
      isAdmin : true
    })

    return res
      .status(200)
      .json(new ApiResponse(200, "Admin registered successfully"))
  } catch (error) {
    throw new ApiError(
      500,
      error?.message || "Something went wrong while registering the user"
    )
  }
})

const registerMentor = asyncHandler(async (req, res) => {
  try {
    const { email, password, fullName, phone, subject } = req.body
    if (!req.user || !req.user.isAdmin) {
      throw new ApiError(400, "Only admins can register mentors")
    }

    if (!email || !password || !fullName || !subject) {
      throw new ApiError(400, "All feilds are requried")
    }

    await User.create({
      email,
      password,
      fullName,
      phone,
      subject,
      isMentor: true,
    })

    return res
      .status(200)
      .json(new ApiResponse(200, "Mentor registered successfully"))
  } catch (error) {
    throw new ApiError(
      500,
      error?.message || "Something went wrong while registering the user"
    )
  }
})

const getAllMentors = asyncHandler(async (req, res) => {
  try {
    if (!req.user || !req.user.isAdmin) {
      throw new ApiError(400, "Only admins can see mentors")
    }

    const mentors = await User.find({ isMentor: true }).select(
      "-password -refreshToken"
    )

    if (!mentors.length) {
      throw new ApiError(404, "No mentors found")
    }
    return res
      .status(200)
      .json(new ApiResponse(200, "mentors fetched successfully", mentors))
  } catch (error) {
    throw new ApiError(
      500,
      error?.message || "Something went wrong while fetching mentors"
    )
  }
})

const deleteMentor = asyncHandler(async (req, res) => {
  try {
    if (!req.user || !req.user.isAdmin) {
      throw new ApiError(400, "Only admins can delete mentors")
    }
    const { mentorId } = req.params

    const deletedMentor = await User.findByIdAndDelete(mentorId)
    if (!deletedMentor) {
      throw new ApiError(404, "mentor not found")
    }

    return res
      .status(200)
      .json(new ApiResponse(200, "mentor deleted successfully"))
  } catch (error) {
    throw new ApiError(
      500,
      error?.message || "Something went wrong while deleting mentor"
    )
  }
})

const userLogout = asyncHandler(async (req, res) => {
  await User.findByIdAndUpdate(
    req.user._id,
    {
      $set: {
        refreshToken: undefined,
      },
    },
    { new: true }
  );

  return res
    .status(200)
    .clearCookie('accessToken', options)
    .clearCookie('refreshToken', options)
    .json(new ApiResponse(200, 'User logged out'));
});

const refreshAccessToken = asyncHandler(async (req, res) => {
  const incomingRefreshToken =
    req.cookies.refreshToken || req.body.refreshToken;

  if (!incomingRefreshToken) {
    throw new ApiError(401, 'Unauthorized request');
  }

  try {
    const decodedToken = jwt.verify(
      incomingRefreshToken,
      process.env.REFRESH_TOKEN_SECRET
    );
    const user = await User.findById(decodedToken?._id);
    if (!user) {
      throw new ApiError(401, 'Invalid refresh token');
    }

    // check if incoming refresh token is same as the refresh token attached in the user document
    // This shows that the refresh token is used or not
    // Once it is used, we are replacing it with new refresh token below
    if (incomingRefreshToken !== user?.refreshToken) {
      // If token is valid but is used already
      throw new ApiError(401, 'Refresh token is expired or used');
    }
    const options = {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
    };

    const { accessToken, refreshToken: newRefreshToken } =
      await generateTokens(user._id);

    return res
      .status(200)
      .cookie('accessToken', accessToken, options)
      .cookie('refreshToken', newRefreshToken, options)
      .json(
        new ApiResponse(
          200,
          { accessToken, refreshToken: newRefreshToken },
          'Access token refreshed'
        )
      );
  } catch (error) {
    throw new ApiError(401, error?.message || 'Invalid refresh token');
  }
});

const userSelf =asyncHandler(async(req,res)=>{
  return res
  .status(200)
  .json(new ApiResponse(200,'User fetched successfully', req.user));
});

const updateUser = asyncHandler(async (req, res) => {
  const userId = req.user._id; // Assumes user ID is set in req.user by an authentication middleware
  const { fullName, email, phone, institution } = req.body;

  // Validation (if not handled on the frontend)
  if (!fullName || fullName.length < 2) {
    throw new ApiError(400, 'Full name is required and must be at least 2 characters.');
  }
  if (!email || !/\S+@\S+\.\S+/.test(email)) {
    throw new ApiError(400, 'A valid email address is required.');
  }

  try {
    // Find and update the user's profile date
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { fullName, email, phone, institution },
      { new: true, runValidators: true }
    );

    if (!updatedUser) {
      throw new ApiError(404, 'User not found');
    }

    // Send updated user info back as a response
    res.status(200)
    .json(new ApiResponse(200,'User updated successfully', updatedUser));
  } catch (error) {
    throw new ApiError(500, error.message || 'Internal server error');
  }
});

const updateUserProfile = asyncHandler(async (req, res) => {
  const userId = req.user._id; // Assumes user ID is set in req.user by an authentication middleware
  const { profilePic } = req.body;
 


  if (!profilePic) {
    throw new ApiError(400, 'Profile Picture is Required');
  }

  try {
    // Find and update the user's profile date
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { profilePic},
      { new: true, runValidators: true }
    );

    if (!updatedUser) {
      throw new ApiError(404, 'User not found');
    }

    // Send updated user info back as a response
    res.status(200)
    .json(new ApiResponse(200,'Profile updated successfully', updatedUser.profilePic));
  } catch (error) {
    throw new ApiError(500, error.message || 'Internal server error');
  }
});

const userRegisterByAdmin = asyncHandler(async (req, res, next) => {
  const { email, password, fullName, phone, target, services } = req.body;
  // console.log(req.body)

  if (!email || !password || !fullName || !phone || !target || !services || !Array.isArray(services)) {
    throw new ApiError(400, "All fields are required, and services must be an array");
  }

  const existingUser = await User.findOne({ email: email });

  if (existingUser) {
    throw new ApiError(400, "User already exists");
  }

  const user = await User.create({
    email,
    password,
    fullName,
    phone,
    target,
  });

  const subscriptionPromises = services.map((service) => {
    const { name, id } = service;
    console.log(service)
    if (!name || !id) {
      throw new ApiError(400, "Each service must have a name and serviceId");
    }

    const expiryDate = new Date(Date.now() + 365 * 24 * 60 * 60 * 1000); // 30 days from now
    return Subscription.create({
      name,
      service: id,
      startDate: Date.now(),
      endDate: expiryDate,
      student: user._id,
      isExpired: false,
    });
  });

  await Promise.all(subscriptionPromises);

  const createdUser = await User.findById(user._id).select("-password");
  if (!createdUser) {
    throw new ApiError(500, "Something went wrong while registering the user");
  }

  return res.status(200).json(
    new ApiResponse(200, "User registered successfully", {
      user: createdUser,
    })
  );
});


export { userRegisterByAdmin,userRegister, userLogin, registerAdmin, registerMentor, getAllMentors, deleteMentor,refreshAccessToken,userSelf,userLogout,updateUser,updateUserProfile}
   
 




