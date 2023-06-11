// import { Prop, Schema, SchemaFactory, raw } from '@nestjs/mongoose';
import mongoose, { Document, HydratedDocument } from 'mongoose';

// interface IUser extends Document {
//   readonly username: string;
//   readonly email: string;
//   readonly password: string;
//   readonly avatar?: string;
//   readonly isOnline: boolean;
//   readonly friends: mongoose.Schema.Types.ObjectId[];
//   readonly requests: [
//     {
//       senderId: mongoose.Schema.Types.ObjectId;
//       receiverId: mongoose.Schema.Types.ObjectId;
//     },
//   ];
// }

export const UserSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      validate: {
        validator: (v: any) => {
          return /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(v);
        },
        message: () => 'Email must be valid',
      },
    },
    password: {
      type: String,
      required: true,
      validate: {
        validator: (v: any) => {
          return v.length >= 8;
        },
        message: () => 'Password must be at least 8 characters long',
      },
    },
    avatar: {
      type: String,
      required: true,
    },
    isOnline: {
      type: Boolean,
      default: true,
    },
    friends: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
    requests: [
      {
        _id: false,
        senderId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        receiverId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
      },
    ],
  },
  { timestamps: true },
);

export const User = mongoose.model('User', UserSchema);

UserSchema.methods.toJSON = function () {
  var obj = this.toObject();
  delete obj.password;
  delete obj.__v;
  delete obj.friends;
  delete obj.requests;

  return obj;
};

// export type UserDocument = HydratedDocument<User>;

// @Schema({ timestamps: true })
// export class User {
//   _id: string;

//   @Prop({ required: true })
//   username: string;

//   @Prop({
//     required: true,
//     unique: true,
//     validate: {
//       validator: (v: any) => {
//         return /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(v);
//       },
//       message: () => 'Email must be valid',
//     },
//   })
//   email: string;

//   @Prop({
//     required: true,
//     validate: {
//       validator: (v: any) => {
//         return v.length >= 8;
//       },
//       message: () => 'Password must be at least 8 characters long',
//     },
//   })
//   password: string;

//   @Prop({ required: true })
//   avatar: string;

//   @Prop({ default: true })
//   isOnline: string;

//   @Prop([{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }])
//   friends: User[];

//   @Prop(
//     raw([
//       {
//         _id: false,
//         senderId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
//         receiverId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
//       },
//     ]),
//   )
//   requests: Record<string, any>;
// }

// export const UserSchema = SchemaFactory.createForClass(User);
