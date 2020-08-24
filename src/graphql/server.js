import {ApolloServer} from 'apollo-server-micro';
import {prisma} from '../../generated/prisma-client';

import {schema} from 'graphql/schema';

const apolloServer = new ApolloServer({
    context: (ctx) => {
        return {
            ...ctx,
            prisma,
        };
    },
    schema,
    playground: {
        settings: {
            'request.credentials': 'same-origin',
        },
    },
});

const apolloHandler = apolloServer.createHandler({
    path: '/api/graphql',
});

export const config = {
    api: {
        bodyParser: false,
    },
};

export default apolloHandler;
