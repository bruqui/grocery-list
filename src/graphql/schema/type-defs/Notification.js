export const NotificationDefs = `
    extend type Query {
        allNotificationsForUser: [List]!
    }

    extend type Mutation {
        deleteNotification: Notification!
    }

    type Notification {
        id: String!
        createdAt: String!
        updatedAt: String!
        user: User!
        message: String!
    }

    extend type User {
        notifications: [Notification]
    }
`;
