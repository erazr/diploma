// import { Prop, Schema, SchemaFactory, raw } from '@nestjs/mongoose';
import mongoose from 'mongoose';
// import { Channel } from './channel.model';
// import { UserModel } from './user.model';

// export type MessageDocument = HydratedDocument<Message>;

// @Schema({ timestamps: true })
// export class Message {
//   _id: string;

//   @Prop({
//     type: Types.ObjectId,
//     ref: 'Channel',
//   })
//   channelId: Types.ObjectId;

//   @Prop({ required: true })
//   content: string;

//   @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User' })
//   author: UserModel;

//   @Prop()
//   attachments: string[];

//   @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Message' })
//   referencedMessage: Message;

//   @Prop(
//     raw([
//       {
//         _id: false,
//         user: { type: MongooseSchema.Types.ObjectId, ref: 'User' },
//       },
//     ]),
//   )
//   mentions: Record<string, any>;

//   @Prop({ default: false })
//   mentionedEveryone: boolean;
// }

// export const MessageSchema = SchemaFactory.createForClass(Message);

export const MessageSchema = new mongoose.Schema(
  {
    channelId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Channel',
    },
    content: {
      type: String,
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    attachments: [
      {
        filetype: String,
        url: String,
      },
    ],
    referencedMessage: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Message',
    },
    mentions: [
      {
        user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        _id: false,
      },
    ],
    mentionedEveryone: {
      type: Boolean,
      default: false,
    },
    createdAt: {
      type: Date,
    },
    edited: {
      type: Date,
    },
  },
  {
    timestamps: {
      createdAt: true,
      updatedAt: false,
    },
  },
);

// messageSchema.methods.toJSON = function () {
//   var m = this.toObject()
//   delete m.
// }

export const Message = mongoose.model('Message', MessageSchema);
