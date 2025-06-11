import Joi from "joi";

export const taskValidator = (data) => {
    const schema = Joi.object({
        title: Joi.string().required(),
        description: Joi.string().required(),
        categoryId: Joi.string().required()
    });

    return schema.validate(data);
};