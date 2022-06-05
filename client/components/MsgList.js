import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/router";
import MsgInput from "./MsgInput";
import MsgItem from "./MsgItem";
// import fetcher from "../fetcher";
import { QueryKeys, fetcher } from "../queryClient";
// import useInfiniteScroll from "../hooks/useInfiniteScroll";
import { useMutation, useQuery, useQueryClient } from "react-query";
import {
  GET_MESSAGES,
  CREATE_MESSAGE,
  UPDATE_MESSAGE,
  DELETE_MESSAGE,
} from "./../graphql/message";

// const UserIds = ["roy", "jay"];
// const getRandomUserId = () => UserIds[Math.round(Math.random())];

const MsgList = ({ serverMsgs, serverUsers }) => {
  const client = useQueryClient();

  const {
    query: { userId = "" },
  } = useRouter();
  const [msgs, setMsgs] = useState(serverMsgs);
  const [editingId, setEditingId] = useState(null);

  // const [hasNext, setHasNext] = useState(true);
  // const fetchMoreEl = useRef(null);
  // const intersecting = useInfiniteScroll(fetchMoreEl);

  const doneEdit = () => setEditingId(null);

  const { mutate: onCreate } = useMutation(
    ({ text }) => fetcher(CREATE_MESSAGE, { text, userId }),
    {
      onSuccess: ({ createMessage }) => {
        client.setQueryData(QueryKeys.MESSAGES, (old) => {
          return {
            messages: [createMessage, ...old.messages],
          };
        });
      },
    }
  );

  const { mutate: onUpdate } = useMutation(
    ({ text, id }) => fetcher(UPDATE_MESSAGE, { text, id, userId }),
    {
      onSuccess: ({ updateMessage }) => {
        client.setQueriesData(QueryKeys.MESSAGES, (old) => {
          const targetIndex = old.messages.findIndex(
            (msg) => msg.id === updateMessage.id
            // callback 함수이기 때문에 update된 message의 id와 비교해야함. (updateMessage.id)
          );
          if (targetIndex < 0) return old;
          const newMsgs = [...old.messages];
          newMsgs.splice(targetIndex, 1, updateMessage);
          return { messages: newMsgs };
        });
        doneEdit();
      },
    }
  );

  const { mutate: onDelete } = useMutation(
    (id) => fetcher(DELETE_MESSAGE, { id, userId }),
    {
      onSuccess: ({ deleteMessage: deleteId }) => {
        client.setQueryData(QueryKeys.MESSAGES, (old) => {
          const targetIndex = old.messages.findIndex(
            (msg) => msg.id === deleteId
          );
          if (targetIndex < 0) return old;
          const newMsg = [...old.messages];
          newMsg.splice(targetIndex, 1);
          return { messages: newMsg };
        });
        doneEdit();
      },
    }
  );

  const getMessages = async () => {
    const newMegs = await fetcher("get", "/messages", {
      params: { cursor: msgs[msgs.length - 1]?.id || "" },
    });
    if (newMegs.length === 0) {
      setHasNext(false);
      return;
    }

    setMsgs((msg) => [...msg, ...newMegs]);
  };

  // useEffect(() => {
  //   if (intersecting && hasNext) getMessages();
  // }, [intersecting]);

  const { data, error, isError } = useQuery(QueryKeys.MESSAGES, () =>
    fetcher(GET_MESSAGES)
  ); // stale : 옛 것. 미리 받아 놓은 정보.

  useEffect(() => {
    if (!data?.messages) return;
    console.log("messages changes");
    setMsgs(data?.messages || []);
  }, [data?.messages]);

  if (isError) {
    console.error(error);
    return null;
  }

  return (
    <>
      {/* index에서 title 하단에 input을 넣어도 되지만 여기에 넣은 이유는 이곳에서 text관련 작업을 모두 할 수 있을 것 같아서 */}
      {/* delete와 setEditing에 넘겨주는 id를 아래에서 넘기는게 아니라 위에서 넘기는게 인상적 */}
      <MsgInput mutate={onCreate} />
      <ul className="messages">
        {msgs.map((item) => (
          <MsgItem
            key={item.id}
            {...item}
            onUpdate={onUpdate}
            onDelete={() => onDelete(item.id)}
            startEdit={() => setEditingId(item.id)}
            isEditing={editingId === item.id}
            myId={userId}
            user={serverUsers.find((user) => user.id === userId)}
          />
        ))}
      </ul>
      {/* <div ref={fetchMoreEl} /> */}
    </>
  );
};

export default MsgList;
