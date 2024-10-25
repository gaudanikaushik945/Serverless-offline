"use strict";
// controller/registeruser.ts
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import axios from "axios";
// import APIGatewayProxyHandler from "aws-lambda"
import User from "../models/user";
import { authorizerFunc } from "../middlerware/authMiddleware";
// import { validateRegisterUser, loginUserSchema } from '../schema.middleware';
import db from "../db/index";
import { log } from "util";
import { IUser,IGitHubRepo } from "../utils/type";
import connectDB from "../db/index";
require("dotenv").config();

// Register User
export const registerUser: any = async (event: any) => {
  try {
    // await connectDB;
    const requestBody = JSON.parse(event.body);
    // console.log("..... requestBody ......", requestBody);

    // const { error } = validateRegisterUser(requestBody);
    // if (error) {
    //   return {
    //     statusCode: 400,
    //     body: JSON.stringify({ message: `Validation error: ${error.message}` }),
    //   };
    // }

    const isEmail = await User.findOne({ email: requestBody.email });
    console.log("==== isEmail ====", isEmail);

    if (isEmail) {
      return {
        statusCode: 400,
        body: JSON.stringify({ message: "User already registered" })
      };
    }

    const securePassword = await bcrypt.hash(requestBody.password, 10);
    console.log("****** securePassword *******", securePassword);

    requestBody.password = securePassword;
    console.log("..... requestBody ......", requestBody);
    const createUser = await User.create(requestBody);
    console.log("_____ createUser _____", createUser);

    return {
      statusCode: 200,
      body: JSON.stringify({
        data: createUser,
        message: "User registered successfully"
      })
    };
  } catch (error) {
    console.log(error);

    return {
      statusCode: 500,
      body: "User not created, please enter correct details"
    };
  }
};

// Login User
export const loginUser: any = async (event: any) => {
  try {
    const requestBody = JSON.parse(event.body!);
    console.log("**** requestBody ****", requestBody);

    // const { error } = loginUserSchema(requestBody);
    // if (error) {
    //   return {
    //     statusCode: 400,
    //     body: JSON.stringify(error),
    //   };
    // }
    const getUserEmail = await User.findOne({ email: requestBody.email });
    if (!getUserEmail) {
      return {
        statusCode: 400,
        body: JSON.stringify({ message: "User data not found" })
      };
    }

    const passwordMatch = await bcrypt.compare(
      requestBody.password,
      getUserEmail.password
    );
    console.log("------ passwordMatch -------", passwordMatch);

    if (!passwordMatch) {
      return {
        statusCode: 400,
        body: JSON.stringify({ message: "Incorrect password" })
      };
    }

    const token = jwt.sign(
      { _id: getUserEmail._id, email: getUserEmail.email },
      process.env.JWT_PRIVATE_KEY!,
      { expiresIn: "1h" }
    );

    return {
      statusCode: 200,
      body: JSON.stringify({
        token,
        message: "User logged in successfully"
      })
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: "Error logging in user"
    };
  }
};

// // Reset Password
export const resetPassword: any = async (event: any) => {
  try {
    const authResult = await authorizerFunc(event);
    console.log("==== authResult =====", authResult);

    const userToken = authResult.tokenCheck;
    console.log("---- userToken ------", userToken);

    // if (!userToken) {
    //   return {
    //     statusCode: 401,
    //     body: JSON.stringify({ message: 'Unauthorized request' }),
    //   };
    // }

    const requestBody = JSON.parse(event.body!);
    const newPassword = requestBody.password;
    console.log("----- newPassword -------", newPassword);

    const securePassword = await bcrypt.hash(newPassword, 10);

    const userGet = await User.findByIdAndUpdate(
      userToken,
      { password: securePassword },
      { new: true }
    );
    console.log("----- userGet -----", userGet);

    if (!userGet) {
      return {
        statusCode: 404,
        body: JSON.stringify({ message: "User not found" })
      };
    }

    return {
      statusCode: 200,
      body: JSON.stringify({
        data: userGet,
        message: "User password reset successfully"
      })
    };
  } catch (error) {
    console.log("---- error ----", error);
    return {
      statusCode: 500,
      body: "Error resetting password"
    };
  }
};











export const githubrepo: any = async (event: any) => {
  const { username } = await event.pathParameters!;
  console.log("----- username -----", username);

  const url = `https://api.github.com/users/${username}/repos`;
  console.log("==== url =====", url);

  const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
  console.log("------ GITHUB_TOKEN -------", GITHUB_TOKEN);

  if (!GITHUB_TOKEN) {
    return {
      statusCode: 404,
      body: JSON.stringify({
        message: "GitHub token not provided"
      })
    };
  }

  try {
    const response = await axios.get(url, {
      headers: {
        authorization: `Bearer ${GITHUB_TOKEN}`
      }
    });

    const getRequireData = await response.data.map((ele: any) =>  {
      const getdata = {
          id: ele.id,
          full_name: ele.full_name,
          url: ele.owner.url,
          permissions: ele.permissions,
      }
      return getdata
    })
    // console.log("==== response ====", response);

    return {
      statusCode: 201,
      body: JSON.stringify({
       data: getRequireData,
        message: "User password reset successfully"
      })
    };
  } catch (error) {
    console.log("---- error ------", error);
    return {
      statusCode: 500,
      body: "Error resetting password"
    };
  }
}




export const addGithubRepo = async (event: any) => {
  const repoData = JSON.parse(event.body)
  console.log('==== repodata ====', repoData);



  const githubUrl = `https://api.github.com/user/repos`
  const GITHUB_TOKEN = process.env.GITHUB_TOKEN
  try {
    const response = await axios.post(githubUrl, {
      name: repoData.name , 
      description: repoData.description, 
      homepage: repoData.homepage,
      private: repoData.private,
      is_template: repoData.is_template
  },{
    headers: {
      Authorization: `Bearer ${GITHUB_TOKEN}`, 
      'Content-Type': 'application/json', 
    }
  })
  console.log("------ response -------", response); 
  


  return {
    statusCode: 200,
    body: JSON.stringify({
        data: response.data,
        message: "User password reset successfully"
    })
};
  } catch (error) {
    console.log("----- error -----", error);
    return {
      statusCode: 500,
      body: "Error resetting password"
    };
    
  }
}
