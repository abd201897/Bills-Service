import joi from "joi";

export default {
  purchaseairtime: {
    body: {
      schema: joi.object({
        amount: joi.number().required(),
        telco: joi
          .string()
          .allow("MTN", "GLO", "AIRTEL", "NINEMOBILE")
          .required(),
        phonenumber: joi.number().required(),
      }),
    },
  },
};
