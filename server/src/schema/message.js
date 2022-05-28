import { gql } from 'apollo-server-express';

const messagesSchema = gql`
    type Message {
        id: ID!
        test: String!
        user: User!
        timestamp: Float
    }
    
    extend type Query {
        messages(cursor: ID): [Message!]!
        messages(id: ID): Message!
    }
    
    extend type Mutation {
        createMessage(text: String!, userId: ID!): Message! 
        updateMessage(id: ID!, text: String!, userId: ID!): Message! 
        deleteMessage(id: ID!, userId: ID!): ID! 
    }
`;

export default messagesSchema; 
