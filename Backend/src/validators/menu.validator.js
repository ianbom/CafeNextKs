// src/validators/menu.validator.js
const Joi = require('joi');

const createMenuSchema = Joi.object({
  categoryId: Joi.number()
    .integer()
    .required()
    .messages({
      'number.base': 'Category ID harus berupa angka.',
      'number.integer': 'Category ID harus berupa bilangan bulat.',
      'any.required': 'Category ID wajib diisi.'
    }),
  name: Joi.string()
    .min(3)
    .max(255)
    .required()
    .messages({
      'string.empty': 'Nama menu tidak boleh kosong.',
      'string.min': 'Nama menu minimal {#limit} karakter.',
      'string.max': 'Nama menu maksimal {#limit} karakter.',
      'any.required': 'Nama menu wajib diisi.'
    }),
  price: Joi.number()
    .integer()
    .min(0)
    .required()
    .messages({
      'number.base': 'Harga harus berupa angka.',
      'number.integer': 'Harga harus berupa bilangan bulat.',
      'number.min': 'Harga tidak boleh negatif.',
      'any.required': 'Harga wajib diisi.'
    }),
  isAvailable: Joi.boolean()
    .optional()
    .default(true),
  estimatedTime: Joi.number()
    .integer()
    .min(1) // Waktu estimasi minimal 1 menit
    .required()
    .messages({
      'number.base': 'Waktu estimasi harus berupa angka.',
      'number.integer': 'Waktu estimasi harus berupa bilangan bulat.',
      'number.min': 'Waktu estimasi minimal {#limit} menit.',
      'any.required': 'Waktu estimasi wajib diisi.'
    }),
 
});

const updateMenuSchema = Joi.object({
  categoryId: Joi.number()
    .integer()
    .optional(),
  name: Joi.string()
    .min(3)
    .max(255)
    .optional(),
  price: Joi.number()
    .integer()
    .min(0)
    .optional(),
  isAvailable: Joi.boolean()
    .optional(),
    estimatedTime: Joi.number().integer().min(1).optional(),
  
}).min(1);

module.exports = {
  createMenuSchema,
  updateMenuSchema
};