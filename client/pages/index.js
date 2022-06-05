import MsgList from "../components/MsgList";
// import fetcher from "../fetcher";
import { fetcher } from "../queryClient";
import { GET_MESSAGES } from "./../graphql/message";
import { GET_USERS } from "./../graphql/user";

const Home = ({ serverMsgs, serverUsers }) => (
  <div>
    <h1>Simple sns</h1>
    <MsgList serverMsgs={serverMsgs} serverUsers={serverUsers} />
  </div>
);

// export const getServerSideProps = async () => {
//   const serverMsgs = await fetcher("get", "/messages");
//   const serverUsers = await fetcher("get", "/users");

//   return {
//     props: { serverMsgs, serverUsers },
//   };
// };

export const getServerSideProps = async () => {
  const serverMsgs = await fetcher(GET_MESSAGES);
  const serverUsers = await fetcher(GET_USERS);
  console.log({ serverMsgs, serverUsers });
  return {
    props: { serverMsgs: [], serverUsers: {} },
  };
};

export default Home;
