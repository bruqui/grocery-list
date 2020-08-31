import {getUserId} from '../../lib/user';

const listFragment = `{
    id
    collaborated
    name
    owner {
        id
    }
    sharedWith {
        id
    }
}`;
const itemFragment = `{
    id
    name
    purchased
    need
    list {
        id
    }
}`;
// Not sure why eslint doesn't think it's imported.
// eslint-disable-next-line import/no-unused-modules
export const listResolvers = {
    QUERY: {
        allListsForUser: async (parent, args, context) => {
            const userId = await getUserId(context);
            const listsData = await context.prisma
                .lists({
                    where: {
                        OR: [{owner: {id: userId}}, {sharedWith_some: {id: userId}}],
                    },
                })
                .$fragment(listFragment);

            return listsData;
            // return listEdges.length ? listEdges.map(({node}) => node) : [];
        },
        itemsForList: async (parent, {listId}, context) => {
            return await context.prisma
                .items({where: {list: {id: listId}}})
                .$fragment(itemFragment);
        },
    },
    MUTATION: {
        createList: async (parent, {name}, context) => {
            const userId = await getUserId(context);

            return context.prisma
                .createList({
                    name,
                    owner: {
                        connect: {id: userId},
                    },
                })
                .$fragment(listFragment);
        },
        shareUnshareList: (parent, {listId, userId, remove}, context) => {
            const connectDisconnect = remove ? 'disconnect' : 'connect';

            return context.prisma
                .updateList({
                    where: {
                        id: listId,
                    },
                    data: {sharedWith: {[connectDisconnect]: {id: userId}}},
                })
                .$fragment(listFragment);
        },
        deleteList: (parent, {id}, context) => {
            return context.prisma.deleteList({id}).$fragment(listFragment);
        },
        updateList: (parent, {listId, ...args}, context) => {
            return context.prisma
                .updateList({where: {id: listId}, data: args})
                .$fragment(listFragment);
        },
        createItem: (parent, {listId, name}, context) => {
            return context.prisma
                .createItem({
                    name,
                    need: true,
                    list: {connect: {id: listId}},
                })
                .$fragment(itemFragment);
        },
        updateItem: (parent, {itemId, ...data}, context) => {
            return context.prisma
                .updateItem({
                    where: {id: itemId},
                    data,
                })
                .$fragment(itemFragment);
        },
        updateItems: (parent, {itemIds, ...data}, context) => {
            return context.prisma.updateManyItems({
                where: {id_in: itemIds},
                data,
            });
        },
        deleteItem: (parent, {itemId}, context) => {
            return context.prisma.deleteItem({id: itemId}).$fragment(itemFragment);
        },
    },
};
