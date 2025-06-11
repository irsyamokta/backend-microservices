import Joi from "joi";

export const categoryValidator = (data) => {
    const schema = Joi.object({
        name: Joi.string().required(),
    });

    return schema.validate(data);
};