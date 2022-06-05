import "./index.scss";
import { QueryClient, QueryClientProvider } from "react-query";
import { Hydrate } from "react-query/hydration";
import { useRef } from "react";

const App = ({ Component, pageProps }) => {
  const clientRef = useRef(null);
  const getClient = () => {
    if (!clientRef.current)
      clientRef.current = new QueryClient({
        defaultOptions: {
          queries: {
            refetchOnWindowFocus: false,
          },
        },
      });
    return clientRef.current;
  };

  return (
    <QueryClientProvider client={getClient()}>
      <Hydrate state={pageProps.dehydrateState}>
        <Component {...pageProps} />
      </Hydrate>
    </QueryClientProvider>
  );
};
App.getInitialProps = async ({ ctx, Component }) => {
  const pageProps = await Component.getInitialProps?.(ctx);
  return { pageProps };
};

export default App;
