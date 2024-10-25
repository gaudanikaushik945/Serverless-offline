import Joi from "joi";
import { IUser, ILogin } from "../utils/type";

export const validateRegisterUser = (data: IUser) => {
    const schema = Joi.object({
        firstName: Joi.string().required(),
        lastName: Joi.string().required(),
        age: Joi.number().required(),
        email: Joi.string().email().required(),
        password: Joi.string().required(),
    });

    return schema.validate(data);
};

export const loginUserSchema = (data: ILogin) => {
    const schema = Joi.object({
        email: Joi.string().email().required(),
        password: Joi.string().required(),
    });

    return schema.validate(data);
};
