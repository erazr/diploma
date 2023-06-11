import { useEffect, useMemo, useState } from "react";
import { useQueryClient } from "react-query";
import channelStore from "../../stores/channelStore";
import userStore from "../../stores/userStore";
import getSocket from "../getSocket";
import { Howl } from "howler";
import DMStore from "stores/DMStore";
import { gKey } from "utils/querykeys";

export default function useMessageSocket(channelId, key) {
  const current = userStore((state) => state.current);
  const [newMessages, setNewMessages] = useState([]);
  // const addTyping = channelStore((state) => state.addTyping);
  // const removeTyping = channelStore((state) => state.removeTyping);
  // const reset = channelStore((state) => state.reset);
  const store = channelStore();
  const cache = useQueryClient();
  const dmStore = DMStore();

  useEffect(() => {
    store.reset();

    const socket = getSocket();

    socket.emit("joinChannel", channelId);

    // const fakeId = "dm_" + Math.random().toString(36).substr(2, 9);

    socket.on("new_message", async (newMessage) => {
      if (newMessage.author._id !== current._id) {
        cache.setQueryData(key, (d) => {
          if (d?.pageParams.length > 0) {
            d?.pages[d.pages.length - 1].push(newMessage);
          } else d?.pages[0].push(newMessage);
          return d;
        });
      }

      if (newMessage.author._id !== current._id) {
        dmStore.addMessages(newMessage);
        cache.setQueryData(gKey, (d) => {
          d = d.filter((g) => g._id !== newMessage.channelId);
          d.unshift({
            _id: newMessage.channelId,
            ownerId: newMessage.author._id,
            name: newMessage.author.username,
            icon: newMessage.author.avatar,
            fake: true,
          });
          return d;
        });
        const audio = new Howl({
          src: ["http://localhost:8000/api/messages"],
          autoplay: true,
          format: ["mp3"],
          volume: 0.1,
          xhr: {
            method: "GET",
            withCredentials: true,
          },
        });
        audio.play();
      }
    });

    socket.on("edit_message", (editMessage) => {
      cache.setQueryData(key, (d) => {
        let index = -1;
        let editId = -1;
        d?.pages.forEach((p, i) => {
          editId = p.findIndex((m) => m._id === editMessage._id);

          if (editId !== -1) index = i;
        });

        if (index !== -1 && editId !== -1) {
          d.pages[index][editId] = editMessage;
        }
        return d;
      });
    });

    socket.on("delete_message", (toBeRemoved) => {
      cache.setQueryData(key, (d) => {
        let index = -1;
        d?.pages.forEach((p, i) => {
          if (p.findIndex((m) => m._id === toBeRemoved._id) !== -1) index = i;
        });
        if (index !== -1) {
          d.pages[index] = d?.pages[index].filter(
            (m) => m._id !== toBeRemoved._id
          );
        }
        return d;
      });
    });

    socket.on("addToTyping", (username) => {
      if (username !== current?.username) {
        store.addTyping(username);
      }
    });

    socket.on("removeFromTyping", (username) => {
      if (username !== current?.username) {
        store.removeTyping(username);
      }
    });

    socket.on("new_notification", () => {});

    return () => {
      socket.emit("leaveRoom", channelId);
      socket.disconnect();
      // dmStore.clear();
    };
  }, [channelId, cache, key, current]);

  // useEffect(() => {
  //   reset();

  //   // socket.on("new_message", (newMessage) => {
  //   //   cache.setQueryData(key, (d) => {
  //   //     d?.pages[0].unshift(newMessage);
  //   //     return d;
  //   //   });
  //   // });

  //   // socket.on("edit_message", (editMessage) => {
  //   //   cache.setQueryData(key, (d) => {
  //   //     let index = -1;
  //   //     let editId = -1;
  //   //     d?.pages.forEach((p, i) => {
  //   //       editId = p.findIndex((m) => m.id === editMessage.id);
  //   //       if (editId !== -1) index = i;
  //   //     });

  //   //     if (index !== -1 && editId !== -1) {
  //   //       d.pages[index][editId] = editMessage;
  //   //     }
  //   //     return d;
  //   //   });
  //   // });

  //   // socket.on("delete_message", (toBeRemoved) => {
  //   //   cache.setQueryData(key, (d) => {
  //   //     let index = -1;
  //   //     d?.pages.forEach((p, i) => {
  //   //       if (p.findIndex((m) => m.id === toBeRemoved.id) !== -1) index = i;
  //   //     });
  //   //     if (index !== -1) {
  //   //       d.pages[index] = d?.pages[index].filter(
  //   //         (m) => m.id !== toBeRemoved.id
  //   //       );
  //   //     }
  //   //     return d;
  //   //   });
  //   // });

  //   // return () => {
  //   // socket.emit("leaveRoom", channelId);
  //   //   socket.disconnect();
  //   // };
  //   return () => {
  //     socket.emit("leaveRoom", channelId);
  //     socket.disconnect();
  //   };
  //   // eslint-disable-next-line
  // }, [channelId, cache, key, current]);
  return [
    newMessages,
    (val) => setNewMessages((prev) => [...prev, val]),
    () => setNewMessages([]),
  ];
}
