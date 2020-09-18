export const AccountDefs = `
    extend type Query {
        userByID(id: String!): User @isAuthenticated
        userByEmail(email: String!): User @isAuthenticated
        userByAuth: User @isAuthenticated
        usersByList(listId: String!): [User]!
        allUsers(input: AllUsersInput): [User!]! @isAuthenticated
        sharedUsers(listId: String!): [User]! @isAuthenticated
        groupsWithUsers: [UserGroup]
        userGroup(groupId: String!): UserGroup!
        userGroupInvite(inviteId: String!): UserGroupInvite!
    }
    extend type Mutation {
        login(email: String!, password: String!): LoginResponse!
        logout: Boolean!
        refreshToken: RefreshResponse!
        signup(input: UserCreateInput): LoginResponse
        deleteUser(id: ID!): User! @isAuthenticated
        updateUser(input: UserUpdateInput!, where: UserWhereUniqueInput!): User! @isAuthenticated
        updatePassword(id: ID!, password: String!): User! @isAuthenticated
        createUserGroup(name: String!): UserGroup!
        deleteUserGroup(groupId: String!): UserGroup!
        inviteUser(groupId: String!, groupName: String!, email: String!): UserGroupInvite!
        joinGroup(inviteId: String!, accept: Boolean!): UserGroup!
        unjoinGroup(groupId: String!): UserGroup!
        deleteInvite(inviteId: String!): UserGroupInvite!
        deleteUserFromGroup(groupId: String!, userId: String!): UserGroup!
    }
    type User {
        id: ID!
        createdAt: String!
        email: String!
        name: String!
        updatedAt: String!
        myGroups: [UserGroup]
    }
    type UserGroup{
        id: ID!
        createdAt: String!
        name: String!
        updatedAt: String!
        users: [User]
        owner: User!
        invites: [UserGroupInvite]
        owned: Boolean
    }
    type UserGroupInvite {
        id: ID!
        createdAt: String!
        email: String!
        updatedAt: String!
        userGroup: UserGroup!
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
