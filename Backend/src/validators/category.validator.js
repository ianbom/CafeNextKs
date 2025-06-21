const Joi = require('joi');

const createCategorySchema = Joi.object({
  name: Joi.string()
    .min(3) // Nama minimal 3 karakter
    .max(100) // Nama maksimal 100 karakter
    .required() // Wajib diisi
    .messages({ // Pesan kustom untuk error
      'string.empty': 'Nama kategori tidak boleh kosong.',
      'string.min': 'Nama kategori minimal {#limit} karakter.',
      'string.max': 'Nama kategori maksimal {#limit} karakter.',
      'any.required': 'Nama kategori wajib diisi.'
    }),
  description: Joi.string()
    .max(500) // Deskripsi maksimal 500 karakter
    .optional() // Tidak wajib diisi
    .messages({
      'string.max': 'Deskripsi kategori maksimal {#limit} karakter.'
    })
});


const updateCategorySchema = Joi.object({
  name: Joi.string()
    .min(3)
    .max(100)
    .optional() // Tidak wajib ada saat update
    .messages({
      'string.empty': 'Nama kategori tidak boleh kosong.',
      'string.min': 'Nama kategori minimal {#limit} karakter.',
      'string.max': 'Nama kategori maksimal {#limit} karakter.'
    }),
  description: Joi.string()
    .max(500)
    .optional()
    .messages({
      'string.max': 'Deskripsi kategori maksimal {#limit} karakter.'
    })
}).min(1) // Setidaknya satu field harus ada untuk update
  .messages({
    'object.min': 'Setidaknya satu field (nama atau deskripsi) wajib diisi untuk update.'
  });

module.exports = {
  createCategorySchema,
  updateCategorySchema
};