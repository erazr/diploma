import mongoose from 'mongoose';

export const GuildSchema = new mongoose.Schema(
  {
    name: {
      type: String,
    },
    ownerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    channels: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Channel',
      },
    ],
    default_channel_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Channel',
    },
    has_notification: {
      type: Boolean,
      default: false,
    },
    members: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
    icon: {
      type: String,
    },
    inviteLinks: {
      type: [String],
    },
  },
  { timestamps: true },
);

export const Guild = mongoose.model('Guild', GuildSchema);
