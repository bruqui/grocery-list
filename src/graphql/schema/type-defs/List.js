export const ListDefs = `
    extend type Query {
        allListsForUser: [List]!
        itemsForList(listId: String!): [Item]!
        list(listId: String!): List
    }

    extend type Mutation {
        createList(name: String!): List!
        shareUnshareList(listId: String!, userId: String!, remove: Boolean): List!
        deleteList(id: String!): List!
        updateList(listId: String!, collaborated: Boolean, name: String): List!
        createItem(listId: String!, name: String!): Item
        updateItem(itemId: String!, name: String, need: Boolean, purchased: Boolean): Item
        updateItems(itemIds: [String], need: Boolean, purchased: Boolean): ItemsResponse
        deleteItem(itemId: String!): Item
    }

    type List {
        id: String!
        createdAt: String!
        updatedAt: String!
        collaborated: Boolean!
        name: String!
        owner: User!
        sharedWith: [User]
        items: [Item]
    }

    type Item {
        id: String!
        createdAt: String!
        list: List!
        name: String!
        need: Boolean!
        purchased: Boolean!
        updatedAt: String!
    }

    type ListSharedWith {
        id: String!
        email: String!
        name: String!
    }

    type ActiveItems {
        id: String!
        createdAt: String!
        item: Item
        list: List
    }

    type ItemsResponse {
        count: Int!
    }

    extend type User {
        sharedLists: [List]
        lists: [List]
    }

    fragment NewList on List {
        id
        name
        collaborated
        owner {
            id
        }
    }

    fragment NewItem on Item {
            id
            name
            need
            purchased
    }
`;
