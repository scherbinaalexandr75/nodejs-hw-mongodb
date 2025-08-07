// import mongoose from 'mongoose';

// const contactSchema = new mongoose.Schema(
//   {
//     name: {
//       type: String,
//       required: [true, 'Set name for contact'],
//     },
//     phoneNumber: {
//       type: String,
//       required: [true, 'Set phone number for contact'],
//     },
//     email: String,
//     isFavourite: {
//       type: Boolean,
//       default: false,
//     },
//     contactType: {
//       type: String,
//       enum: ['work', 'home', 'personal'],
//       default: 'personal',
//       required: [true, 'Set contact type'],
//     },
//   },
//   { timestamps: true },
// );

// const Contact = mongoose.model('Contact', contactSchema);
// export default Contact;

// export const getAllContacts = async () => {
//   const contacts = await Contact.find();
//   return contacts;
// };

// export const getContactById = async (id) => {
//   return await Contact.findById(id);
// };
