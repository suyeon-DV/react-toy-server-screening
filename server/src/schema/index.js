import { gql } from "apollo-server-express";
import messagesSchema from "server/src/schema/message.js";
import userSchema from "server/src/schema/user.js";

const linkSchema = gql`
	type Query {
		: Boolean
	}
	
	type Mutation {
		: Boolean
	}
`;

export default [linkSchema, messagesSchema, userSchema];