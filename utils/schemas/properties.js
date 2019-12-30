const joi = require('@hapi/joi');

const propertyUidSchema = joi.string().regex(/^[0-9a-fA-F]{24}$/);

const propertyTitleSchema = joi.string().max(80);
const propertyDescriptionSchema = joi.string().max(10000);
const imgSchema = { src: joi.string().max(2077)}
const pricesSchema = {
  amount: joi.number().max(999999999).required(),
  formattedAmount: joi.string().max(14),
  currencyUid: joi.number().max(99),
  currency: joi.string().max(3),
};

const ownerSchema={
  fullName:joi.string(),
  residencePhone:joi.string(),
  email:joi.string(),
  birthplace:joi.string(),
  mobilePhone:joi.string(),
  gender:joi.string(),  
}

const addressSchema = {
  street:joi.string().max(1000),
  city:joi.string().max(1000),
  state:joi.string().max(1000),
  zip:joi.number().max(999999),
}

const createPropertySchema = {
  _id: propertyUidSchema,
  title: propertyTitleSchema,
  description: propertyDescriptionSchema.required(),
  owner:ownerSchema,
  img: imgSchema,
  address:addressSchema,
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
