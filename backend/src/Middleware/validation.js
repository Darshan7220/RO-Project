import Joi from 'joi';

const Register = Joi.object({
    firstname: Joi.string().max(36).required(),
    lastname: Joi.string().max(36).required(),
    username: Joi.string().max(36).required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(8).required().messages({
        'any.required': 'Password is required!',
    }),
    avatar: Joi.string(),

    birthdate: Joi.date(),
    phonenumber: Joi.string().allow('', null),
    city: Joi.string().allow('', null),
    country: Joi.string().allow('', null),
    liveChatOptions: Joi.boolean(),
    link: Joi.string().uri().allow('', null),
});

const Login = Joi.object({
    email: Joi.string().required(),
    password: Joi.string().required().messages({
        'any.required': 'Password is required!',
    }),
    ipAddress: Joi.string().optional(),
    notificationToken: Joi.string().optional()
});

const forgotPassword = Joi.object({
    email: Joi.string().required()
});


const VSchema = {
    Register,
    Login,
    forgotPassword
};

export default VSchema;
