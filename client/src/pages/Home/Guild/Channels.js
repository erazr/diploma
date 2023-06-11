import useChannelSocket from "api/ws/useChannelSocket";
import { useModal } from "hooks/useModal";
import React from "react";
import { useParams } from "react-router-dom";
import { cKey } from "utils/querykeys";

export default function Channels() {
  const {
    isOpen: inviteIsOpen,
    onOpen: inviteOpen,
    onClose: inviteClose,
  } = useModal();
  const {
    isOpen: channelIsOpen,
    onOpen: channelOpen,
    onClose: channelClose,
  } = useModal();

  const { guildId } = useParams();
  const key = cKey(guildId);

  useChannelSocket(guildId, key);

  return <div>Channels</div>;
}
