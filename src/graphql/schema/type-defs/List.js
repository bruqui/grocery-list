export const ListDefs = `
    extend type Query {
        allListsForUser: User!
    }

    extend type Mutation {
        createList(name: String!): List
        createItem(listId: String!, name: String!): Item
        shareList(listId: String!, userId: String!): List
        deleteList(id: String!): List
    }

    extend type Subscription {
        listAdded: List!
        listUpdated: List!
        listDeleted: List!
    }

    type List {
        id: String!
        createdAt: String!
        updatedAt: String!
        collaborated: Boolean!
        name: String!
        owner: User!
        sharedWith: [ListSharedUsers]
        items: [Item]
    }

    type Item {
        id: String!
        createdAt: String!
        updatedAt: String!
        name: String!
        need: Boolean!
        list: List!
    }

    type ListSharedUsers {
        id: String!
        createdAt: String!
        updatedAt: String!
        user: User
        list: List
    }

    type ActiveItems {
        id: String!
        createdAt: String!
        item: Item
        list: List
    }

    extend type User {
        sharedLists: [ListSharedUsers]
        lists: [List]
    }
`;
