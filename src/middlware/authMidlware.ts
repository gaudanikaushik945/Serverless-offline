import jwt from 'jsonwebtoken';
// import { APIGatewayProxyEvent } from "aws-lambda";
require("dotenv").config()

export const authorizerFunc = async (event: any) => {
    try {
        const authHeader = event.headers["authorization"];
        console.log('----- authHeader ------', authHeader)
        
        if (!authHeader) {
            return {
                statusCode: 401,
                body: JSON.stringify({ message: "Unauthorized request" }),
            };
        }

        const token = authHeader.split(' ')[1];
        console.log('--- token ----', token);
        
        const privateKey = process.env.JWT_PRIVATE_KEY!;
        console.log("----- privateKey -----", privateKey);
        
        const jwtToken = jwt.verify(token, privateKey);
        console.log("==== jwtToken ====", jwtToken)

        if (!jwtToken) {
            return {
                statusCode: 401,
                body: JSON.stringify({ message: 'Invalid token' }),
            };
        }

        return {
            tokenCheck: jwtToken,
        };
    } catch (error) {
        console.log("----- error ------", error);
        
        return {
            statusCode: 500,
            body: JSON.stringify({ message: "Invalid token" }),
        };
    }
};



