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

export const getServerSideProps = async () => {
  const [{ messages: serverMsgs }, { users: serverUsers }] = await Promise.all([
    fetcher(GET_MESSAGES),
    fetcher(GET_USERS),
  ]);

  return {
    props: { serverMsgs, serverUsers },
  };
};

export default Home;
