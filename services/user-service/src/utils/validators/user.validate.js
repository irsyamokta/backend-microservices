import Joi from "joi";

export const updateProfileValidator = (data) => {
    const schema = Joi.object({
        name: Joi.string()
            .min(3)
            .max(50)
            .empty("")
            .required()
            .messages({
                "string.min": "Nama minimal harus 3 karakter!",
                "string.max": "Nama maksimal 50 karakter!",
                "any.required": "Nama tidak boleh kosong!"
            }),

        email: Joi.string()
            .email()
            .empty("")
            .required()
            .messages({
                "string.email": "Format email tidak valid!",
                "any.required": "Email tidak boleh kosong!"
            }),
    });

    return schema.validate(data, { abortEarly: false });
};