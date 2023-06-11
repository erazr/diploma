import { BadRequestException } from '@nestjs/common';
const path = require('path');
const { createReadStream } = require('streamifier');
const cloudinary = require('cloudinary').v2;

cloudinary.config({
  cloud_name: 'dausm9lxy',
  api_key: '827849726552982',
  api_secret: 'gP5lKWqUNO-6jJxuAv-Alk9v5r4',
});

// const formatName = (filename) => {
//   const file = path.parse(filename);
//   const name = file.name;
//   const ext = file.ext;
//   const date = Date.now();
//   const cleanFileName = name.toLowerCase().replace(/[^a-z0-9]/g, '-');
//   return `${date}-${cleanFileName}${ext}`;
// };

// export const uploadFromBuffer = async (buffer, filename) => {
//   // return new Promise((resolve, reject) => {
//   //   const cld_upload_stream = cloudinary.uploader.upload_stream(
//   //     (error: any, result: any) => {
//   //       if (result) {
//   //         resolve(result);
//   //       } else {
//   //         reject(error);
//   //       }
//   //     },
//   //   );

//   //   createReadStream(buffer).pipe(cld_upload_stream);
//   // });
//   const file = bucket.file(filename);
//   try {
//     await file.save(buffer, { contentType: 'webp' });
//   } catch (err) {
//     throw new BadRequestException(err?.message);
//   }

//   return {
//     ...file.metadata,
//     publicurl: `https://storage.googleapis.com/${bucket.name}/${file.name}`,
//   };
// };
