export class MessageDto {
  content?: string;
  attachments?: Object[];
  referencedMessage?: Object;
  mentions?: Object[];
  mentionedEveryone?: boolean;
}
