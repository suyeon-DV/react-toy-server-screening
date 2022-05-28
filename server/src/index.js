import express from 'express';
import cors from 'cors';
import {ApolloServer} from 'apollo-server-express';
// import messagesRoute from '../routes/message.js';
// import usersRoute from './../routes/user.js';

const app = express();
// apollo server에서는 필요 없는 부분임
// app.use(express.urlencoded({ extended: true }));
// app.use(express.json());

app.use(cors({
    origin: 'http://localhost:3000',
    credentials: true
}))

app.get('/', (req, res) => {
    res.send('ok')
})

const server = new ApolloServer({
    typeDefs: schema,
    resolvers,
    context: {
        models: {
            messages: '',
            users: '',
        }
    }
})

server.applyMiddleware({ app, path: '/graphql' });

// graphql에서는 필요 없음
// const routes = [...messagesRoute, ...usersRoute];
// routes.forEach(({ method, route, handler }) => {
//     app[method](route, handler);
// })

app.listen(8000, () => {
    console.log('server listening on 8000...');
})