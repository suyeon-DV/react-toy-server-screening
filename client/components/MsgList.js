import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/router";
import MsgInput from "./MsgInput";
import MsgItem from "./MsgItem";
// import fetcher from "../fetcher";
import {
  QueryKeys,
  fetcher,
  findTargetMsgIndex,
  getNewMessages,
} from "../queryClient";
import useInfiniteScroll from "../hooks/useInfiniteScroll";
import {
  useMutation,
  useQuery,
  useQueryClient,
  useInfiniteQuery,
} from "react-query";
import {
  GET_MESSAGES,
  CREATE_MESSAGE,
  UPDATE_MESSAGE,
  DELETE_MESSAGE,
} from "./../graphql/message";

const MsgList = ({ serverMsgs }) => {
  const client = useQueryClient();

  const {
    query: { userId = "" },
  } = useRouter();
  const [msgs, setMsgs] = useState([serverMsgs]);
  const [editingId, setEditingId] = useState(null);

  const fetchMoreEl = useRef(null);
  const intersecting = useInfiniteScroll(fetchMoreEl);

  const doneEdit = () => setEditingId(null);

  const { mutate: onCreate } = useMutation(
    ({ text }) => fetcher(CREATE_MESSAGE, { text, userId }),
    {
      onSuccess: ({ createMessage }) => {
        client.setQueryData(QueryKeys.MESSAGES, (old) => {
          return {
            pageParam: old.pageParam,
            pages: [
              { messages: [createMessage, ...old.pages[0].messages] },
              ...old.pages.slice(1),
            ],
          };
        });
      },
    }
  );

  const { mutate: onUpdate } = useMutation(
    ({ text, id }) => fetcher(UPDATE_MESSAGE, { text, id, userId }),
    {
      onSuccess: ({ updateMessage }) => {
        doneEdit();
        client.setQueriesData(QueryKeys.MESSAGES, (old) => {
          const { pageIndex, msgIndex } = findTargetMsgIndex(
            old.pages,
            updateMessage.id
          );
          if (pageIndex < 0 || msgIndex < 0) return old;
          const newMsgs = getNewMessages(old);
          newMsgs.pages[pageIndex].messages.splice(msgIndex, 1, updateMessage);
          return newMsgs;
        });
      },
    }
  );

  const { mutate: onDelete } = useMutation(
    (id) => fetcher(DELETE_MESSAGE, { id, userId }),
    {
      onSuccess: ({ deleteMessage: deleteId }) => {
        client.setQueryData(QueryKeys.MESSAGES, (old) => {
          const { pageIndex, msgIndex } = findTargetMsgIndex(
            old.pages,
            deleteId
          );
          if (pageIndex < 0 || msgIndex < 0) return old;

          const newMsgs = getNewMessages(old);
          newMsgs.pages[pageIndex].messages.splice(msgIndex, 1);
          return newMsgs;
        });
        doneEdit();
      },
    }
  );

  const { data, error, isError, fetchNextPage, hasNextPage } = useInfiniteQuery(
    QueryKeys.MESSAGES,
    ({ pageParam = "" }) => fetcher(GET_MESSAGES, { cursor: pageParam }),
    {
      getNextPageParam: ({ messages }) => {
        return messages?.[messages.length - 1]?.id;
      },
    }
  ); // stale : ??? ???. ?????? ?????? ?????? ??????.4

  useEffect(() => {
    if (intersecting && hasNextPage) fetchNextPage();
  }, [intersecting, hasNextPage]);

  useEffect(() => {
    if (!data?.pages) return;
    // const mergedMsgs = data.pages.flatMap((data) => data.messages);
    setMsgs(data.pages);
  }, [data?.pages]);

  if (isError) {
    console.error(error);
    return null;
  }

  return (
    <>
      {/* index?????? title ????????? input??? ????????? ????????? ????????? ?????? ????????? ???????????? text?????? ????????? ?????? ??? ??? ?????? ??? ????????? */}
      {/* delete??? setEditing??? ???????????? id??? ???????????? ???????????? ????????? ????????? ???????????? ????????? */}
      <MsgInput mutate={onCreate} />
      <ul className="messages">
        {msgs?.map(({ messages }, pageIndex) =>
          messages?.map((item) => (
            <MsgItem
              key={pageIndex + item.id}
              {...item}
              onUpdate={onUpdate}
              onDelete={() => onDelete(item.id)}
              startEdit={() => setEditingId(item.id)}
              isEditing={editingId === item.id}
              myId={userId}
            />
          ))
        )}
      </ul>
      <div ref={fetchMoreEl} />
    </>
  );
};

export default MsgList;
