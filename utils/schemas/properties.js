const joi = require('@hapi/joi');

const propertyUidSchema = joi.string().regex(/^[0-9a-fA-F]{24}$/);

const propertyTitleSchema = joi.string().max(80);
const propertyDescriptionSchema = joi.string().max(10000);
const imgSchema = {
  src: joi
    .string()
    .max(2077)
  }
const pricesSchema = {
  amount: joi
    .number()
    .max(999999999)
    .required(),
  formattedAmount: joi
    .string()
    .max(14)
    .required(),
  currencyUid: joi
    .number()
    .max(99),
  currency: joi
    .string()
    .max(3),
};

const createPropertySchema = {
  _id: propertyUidSchema,
  title: propertyTitleSchema.required(),
  description: propertyDescriptionSchema.required(),
  img: imgSchema,
  prices: pricesSchema,
};

const updatePropertySchema = {
  _id: propertyUidSchema,
  title: propertyTitleSchema,
  description: propertyDescriptionSchema,
  img: imgSchema,
  prices: pricesSchema,
};


module.exports = {
  propertyUidSchema,
  createPropertySchema,
  updatePropertySchema
};
