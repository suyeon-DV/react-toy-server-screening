import MsgList from "../components/MsgList";
import fetcher from "../fetcher";

const Home = ({ serverMsgs, serverUsers }) => (
  <div>
    <h1>Simple sns</h1>
    <MsgList serverMsgs={serverMsgs} serverUsers={serverUsers} />
  </div>
);

export const getServerSideProps = async () => {
  const serverMsgs = await fetcher("get", "/messages");
  const serverUsers = await fetcher("get", "/users");

  return {
    props: { serverMsgs, serverUsers },
  };
};

export default Home;
