export const AccountDefs = `
    extend type Query {
        userByID(id: String!): User @isAuthenticated
        userByEmail(email: String!): User @isAuthenticated
        userByAuth: User @isAuthenticated
        usersByList(listId: String!): [User]!
        allUsers(input: AllUsersInput): [User!]! @isAuthenticated
        invites: [UserInvite]! @isAuthenticated
        userInvite(inviteId: String!): UserInvite @isAuthenticated
        userConnections: User @isAuthenticated
    }
    extend type Mutation {
        login(email: String!, password: String!): LoginResponse!
        logout: Boolean!
        refreshToken: RefreshResponse!
        signup(input: UserCreateInput): LoginResponse
        deleteUser(id: ID!): User! @isAuthenticated
        updateUser(input: UserUpdateInput!, where: UserWhereUniqueInput!): User! @isAuthenticated
        updatePassword(id: ID!, password: String!): User! @isAuthenticated
        inviteUser(email: String!): UserInvite! @isAuthenticated
        deleteInvite(inviteId: String!): UserInvite! @isAuthenticated
        acceptInvite(inviteId: String!): [User]! @isAuthenticated
        deleteConnection(connectionUserId: String!): [User]!
    }
    type User {
        id: ID!
        createdAt: String!
        email: String!
        name: String!
        updatedAt: String!
        connections: [User]
        invites: [UserInvite]
    }
    type UserSession {
        id: ID!
        createdAt: String!
        ttl: Int!
        user: User!
    }
    type UserInvite {
        id: ID!
        email: String!
        owner: User!
        sendgridResponse: String
    }
    type LoginResponse {
        accessToken: String!
        userId: String!
        name: String!
    }
    type RefreshResponse {
        accessToken: String
        name: String
    }
    input AllUsersInput {
        first: Int
        skip: Int
        id: Int
        email: String
        name: String
    }
    input UserCreateInput {
        email: String!
        name: String!
        password: String!
    }
    input UserUpdateInput {
        password: String
        name: String
        email: String
    }
    input UserWhereUniqueInput {
      id: ID
      email: String
    }
`;
