import {ApolloServer} from 'apollo-server-micro';
import {PubSub} from 'graphql-subscriptions';
import {prisma} from '../../generated/prisma-client';

import {schema} from 'graphql/schema';

export const pubSub = new PubSub();

const apolloServer = new ApolloServer({
    context: ({req, res, connection}) => {
        return connection
            ? {...connection.context, prisma}
            : {
                  req,
                  res,
                  prisma,
              };
    },
    schema,
    // subscriptions: {
    //     path: '/api/graphqlSubscriptions',
    //     keepAlive: 9000,
    //     onConnect: console.log('connected'),
    //     onDisconnect: () => console.log('disconnected'),
    // },
    // playground: {
    //     subscriptionEndpoint: '/api/graphqlSubscriptions',

    //     settings: {
    //         'request.credentials': 'same-origin',
    //     },
    // },
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
