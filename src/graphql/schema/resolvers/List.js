import {getUserId} from '../../lib/user';
import {get} from 'lodash';

const listFragment = `{
    id
    collaborated
    name
    owner {
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
        listSharedWith: async (parent, {listId}, context) => {
            const list = await context.prisma.listsConnection({
                where: {
                    id: listId,
                },
            });

            return get(list, 'edges.0.node.sharedWith', []);
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
        shareList: (parent, {listId, userId}, context) => {
            return context.prisma.createListSharedUsers({
                user: {connect: {id: userId}},
                list: {connect: {id: listId}},
            });
        },
        deleteList: (parent, {id}, context) => {
            return context.prisma.deleteList({id}).$fragment(listFragment);
        },
        createItem: (parent, {listId, name}, context) => {
            return context.prisma
                .createItem({
                    name,
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
        updateItems: (parent, {listId, ...data}, context) => {
            return context.prisma
                .updateManyItems({
                    where: {list: {id: listId}},
                    data,
                })
                .$fragment(itemFragment);
        },
        deleteItem: (parent, {id}, context) => {
            return context.prisma.deleteItem({id}).$fragment(itemFragment);
        },
    },
};
