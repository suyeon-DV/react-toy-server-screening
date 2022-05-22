import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import MsgInput from "./MsgInput";
import MsgItem from "./MsgItem";
import fetcher from "../fetcher";

// const UserIds = ["roy", "jay"];
// const getRandomUserId = () => UserIds[Math.round(Math.random())];

const MsgList = () => {
  const {
    query: { userId = "" },
  } = useRouter();
  const [msgs, setMsgs] = useState([]);
  const [editingId, setEditingId] = useState(null);

  const doneEdit = () => setEditingId(null);

  const onCreate = async (text) => {
    const newMsg = await fetcher("post", "/messages", { text, userId });
    if (!newMsg) throw Error("It's not a new Message");
    // const newMsg = {
    //     id: msgs.length + 1,
    //     userId: getRandomUserId(),
    //     timeStamp: Date.now(),
    //     text: `${msgs.length +1} ${text}`
    // }
    setMsgs((msgs) => [newMsg, ...msgs]);
  };

  const onUpdate = async (text, id) => {
    const newMsg = await fetcher("put", `/messages/${id}`, { text, userId });
    if (!newMsg) throw Error("It's not a new Message");

    // setMsgs 안에 로직을 넣는 이유는 state 상에서 msgs를 가져오기 때문에
    // 더 안정적이기 때문
    // setState를 함수형으로 쓰는 것을 추천한다고 함 -> 더 찾아볼 것
    setMsgs((msgs) => {
      const targetIndex = msgs.findIndex((msg) => msg.id === id);
      if (targetIndex < 0) return msgs;
      const newMsgs = [...msgs];
      newMsgs.splice(targetIndex, 1, newMsg);
      return newMsgs;
    });
    doneEdit();
  };

  const getMessages = async () => {
    const megs = await fetcher("get", "/messages");
    setMsgs(megs);
  };

  useEffect(() => {
    getMessages();
  }, []);

  const onDelete = async (id) => {
    const receivedId = await fetcher("delete", `/messages/${id}`, {
      params: { userId },
    });
    setMsgs((msgs) => {
      const targetIndex = msgs.findIndex((msg) => msg.id === receivedId + "");
      if (targetIndex < 0) return msgs;
      const newMsgs = [...msgs];
      newMsgs.splice(targetIndex, 1);
      return newMsgs;
    });
  };

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
          />
        ))}
      </ul>
    </>
  );
};

export default MsgList;
