// import { Prop, Schema, SchemaFactory, raw } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
// import { User } from './user.model';

// export type ChannelDocument = HydratedDocument<Channel>;

// @Schema({ timestamps: true })
// export class Channel {
//   // _id: string;

//   @Prop()
//   name: string;

//   @Prop({ default: false })
//   dm: boolean;

//   @Prop([{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }])
//   members: User[];

//   @Prop({ default: true })
//   isPublic: boolean;

//   @Prop({ default: false })
//   isOpen: boolean;
// }

// export const ChannelSchema = SchemaFactory.createForClass(Channel);

// ChannelSchema.methods.toJSON = function () {
//   var obj = this.toObject();
//   delete obj.__v;
//   return obj;
// };

export const ChannelSchema = new mongoose.Schema(
  {
    name: {
      type: String,
    },
    guild: {
      type: mongoose.Schema.Types.ObjectId,
    },
    dm: {
      type: Boolean,
      default: false,
    },
    members: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
    isPublic: {
      type: Boolean,
      default: true,
    },
    isOpen: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true },
);

// channelSchema.methods.toJSON = function () {
//   var obj = this.toObject();
//   delete obj.__v;
//   return obj;
// };

export const Channel = mongoose.model('Channel', ChannelSchema);
