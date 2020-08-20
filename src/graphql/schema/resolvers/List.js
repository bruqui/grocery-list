import {getUserId} from '../../lib/user';
import {pubSub} from '../../server.js';

const LIST_ADDED = 'LIST_ADDED';
const LIST_UPDATED = 'LIST_UPDATED';
const LIST_DELETED = 'LIST_DELETED';

// Not sure why eslint doesn't think it's imported.
// eslint-disable-next-line import/no-unused-modules
export const listResolvers = {
    QUERY: {
        allListsForUser: async (parent, args, context) => {
            const userId = await getUserId(context);
            const fragment = `
                fragment UserWithLists on User {
                    lists {
                        id
                        name
                        items {
                            id
                            name
                            need
                        }
                    }
                    sharedLists {
                        list {
                            id
                            name
                            collaborated
                            items {
                                id
                                name
                                need
                            }
                        }
                    }
                }
            `;

            return await context.prisma.user({id: userId}).$fragment(fragment);
        },
    },
    MUTATION: {
        createList: async (parent, {name}, context) => {
            const userId = await getUserId(context);

            pubSub.publish(LIST_ADDED, {listAdded: {name}});
            return context.prisma.createList({
                name,
                owner: {
                    connect: {id: userId},
                },
            });
        },
        createItem: (parent, {listId, name}, context) => {
            pubSub.publish(LIST_UPDATED, {listUpdated: {listId, name}});

            return context.prisma.createItem({
                name,
                list: {connect: {id: listId}},
            });
        },
        shareList: (parent, {listId, userId}, context) => {
            pubSub.publish(LIST_UPDATED, {listUpdated: {listId, userId}});

            return context.prisma.createListSharedUsers({
                user: {connect: {id: userId}},
                list: {connect: {id: listId}},
            });
        },
        deleteList: (parent, {id}, context) => {
            pubSub.publish(LIST_DELETED, {listDeleted: {id}});

            return context.prisma.deleteList({id});
        },
    },
    SUBSCRIPTION: {
        listAdded: {
            subscribe: () => pubSub.asyncIterator([LIST_ADDED]),
        },
        listUpdated: {
            subscribe: () => pubSub.asyncIterator([LIST_UPDATED]),
        },
        listDeleted: {
            subscribe: () => pubSub.asyncIterator([LIST_DELETED]),
        },
    },
};
