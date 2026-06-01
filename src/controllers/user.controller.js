import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.model.js";
import { uploadOnCloudnary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const registerUser = asyncHandler(async (req, res) => {

    // get user data from frontend
    // validation - not empty
    // check user allready exists or not : email , userName
    //check for images, for avatar
    //upload them on cloudnerry
    //create user object - create entry in db
    //remove password and refresh token field from response
    //check for usser creation
    //return res
    const {userName, email, fullName, password}= req.body 
    console.log("email:",email);

    if (
        [fullName, email, userName, password].some((field) => field?.trim() === "")
    ) {
        throw new ApiError(400, "all full name required")  
    }
    const existedUser = User.findOne({
        $or:[{userName}, {email}]
    })
    if(existedUser){
        throw new ApiError(409,"Username already exists")
    }
    const avatarLocalPath = req.files?.avatar[0]?.path
    const coverImageLocalPath = req.files?.coverImage[0]?.path

    if(!avatarLocalPath){
        throw new ApiError(400,"Avatar file is required")
    }

    const avatar = await uploadOnCloudnary(avatarLocalPath)
    const coverImage = await uploadOnCloudnary(coverImageLocalPath)

    if (!avatar) {
        throw new ApiError(400,"Avatar file is required")
    }

    const user = await User.create({
        fullName,
        avatar: avatar.url,
        coverImage: coverImage?.url || "",
        email,
        password,
        userName: userName.toLowerCase()
    })

    const createdUser = User.findById(user._id).select(
        "-password -refreshToken"
    )
    if (!createdUser) {
        throw new ApiError(500, " something went wrong while registring the user")
    }

    return res.status(201).json(
        new ApiResponse(200, createdUser, "user register  successfully")
    )

});

export {registerUser}