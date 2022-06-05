import MsgList from "../components/MsgList";
// import fetcher from "../fetcher";
import { fetcher } from "../QueryClient";

const Home = ({ serverMsgs, serverUsers }) => (
  <div>
    <h1>Simple sns</h1>
    <MsgList serverMsgs={serverMsgs} serverUsers={serverUsers} />
  </div>
);

// fetcher.js 사용했을 때 REST
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

  return {
    props: { serverMsgs, serverUsers },
  };
};

export default Home;
