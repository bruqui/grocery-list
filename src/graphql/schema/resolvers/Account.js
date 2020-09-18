import {ApolloError, ForbiddenError} from 'apollo-server-micro';

import {
    getLoginResponse,
    getRefreshTokenResponse,
    getSignupResponse,
    removeLoginSession,
} from 'graphql/lib/auth';
import {getUser, getUserId} from 'graphql/lib/user';
import {getHashSalt} from 'graphql/lib/encryption';
import sendEmail from 'graphql/lib/sendgrid';

const allUsersFragement = `{
                id
                name
                email
                lists {
                    id
                }
                sharedLists {
                    id
                }
            }`;

// Not sure why eslint doesn't think it's imported.
// eslint-disable-next-line import/no-unused-modules
export const accountResolvers = {
    QUERY: {
        userByAuth: (parent, args, context) => {
            const userId = getUserId(context);

            return getUser({id: userId}, context);
        },
        userByID: ({id}, args, context) => {
            return getUser({id}, context);
        },
        userByEmail: ({email}, args, context) => {
            return getUser({email}, context);
        },
        allUsers: (parent, args, context) => {
            return context.prisma.users().$fragment(allUsersFragement);
        },
        sharedUsers: async (parent, {listId}, context) => {
            const userId = await getUserId(context);

            return context.prisma
                .users({
                    where: {
                        AND: [
                            {id_not: 'cke3crf920a2o0803zqew99tu'},
                            {userGroups_every: {id: 'cke3crf920a2o0803zqew99tu'}},
                        ],
                    },
                })
                .$fragment(allUsersFragement);
        },
        groupsWithUsers: async (parent, args, context) => {
            const userId = await getUserId(context);

            const userGroups = await context.prisma.userGroups({
                where: {
                    OR: [{owner: {id: userId}}, {users_some: {id: userId}}],
                },
            }).$fragment(`
                {
                    id
                    name
                    owner {
                        id
                        name
                    }
                    users {
                        id
                        email
                        name
                    }
                    invites {
                        id
                        email
                    }
                }
            `);

            return userGroups && userGroups.length
                ? userGroups.map((group) => {
                      return {
                          ...group,
                          owned: userId === group.owner.id,
                      };
                  })
                : [];
        },
        userGroup: (parent, {groupId}, context) => {
            return (
                context.prisma.userGroup({id: groupId}).$fragment(`
            {
                id
                name
                owner {
                    id
                    name
                }
            }
            `) || {owner: {id: null, name: null}}
            );
        },
        userGroupInvite: (parent, {inviteId}, context) => {
            return context.prisma.userGroupInvite({id: inviteId}).$fragment(`
            {
                id
                userGroup {
                    id
                    name
                    owner {
                        name
                    }
                }
            }
            `);
        },
    },
    MUTATION: {
        deleteUser: (parent, {id}, context) => {
            return context.prisma.deleteUser({id});
        },
        login: async (parent, args, context) => {
            return getLoginResponse(args, context);
        },
        logout: (parent, args, context) => {
            return removeLoginSession(context);
        },
        refreshToken: (parent, args, context) => {
            return getRefreshTokenResponse(context);
        },
        signup: async (parent, {input}, context) => {
            try {
                return await getSignupResponse(input, context);
            } catch (error) {
                return error;
            }
        },
        updateUser: (parent, args, context) => {
            const userId = getUserId(context);

            // Currently only users can modify themselves in this app unless this
            // conditional changes to meet other requirements.
            if (userId !== args.id) {
                throw new ForbiddenError('USER_UPDATE_FORBIDDEN');
            }

            return context.prisma.updateUser({
                id: args.id,
                name: args.name,
                email: args.email,
            });
        },
        updatePassword: async (parent, {password}, context) => {
            const userId = getUserId(context);

            return context.prisma.updateUser({
                ...getHashSalt(password),
                where: {id: userId},
            });
        },
        createUserGroup: async (parent, args, context) => {
            const userId = await getUserId(context);

            return context.prisma.createUserGroup({
                ...args,
                owner: {
                    connect: {id: userId},
                },
            });
        },
        deleteUserGroup: async (parent, {groupId}, context) => {
            return context.prisma.deleteUserGroup({id: groupId});
        },
        inviteUser: async (parent, {email, groupId, groupName}, context) => {
            let invitation;
            const userId = await getUserId(context);
            const user = await getUser({id: userId}, context);

            const invitations = await context.prisma.userGroupInvites({
                where: {
                    userGroup: {id: groupId},
                    email,
                },
            });

            invitation =
                invitations && invitations.length
                    ? invitations[0]
                    : await context.prisma.createUserGroupInvite({
                          email,
                          userGroup: {connect: {id: groupId}},
                      });

            if (!invitation || !invitation.id) {
                throw new ApolloError('The invitation was not created.', 'UI_ERROR', {
                    invitation,
                });
            }

            await sendEmail({inviteId: invitation.id, email, groupName}, user, context);

            return invitation;
        },
        joinGroup: async (parent, {accept, inviteId}, context) => {
            let addToUserGroup;
            const userId = await getUserId(context);
            const user = await getUser({id: userId}, context);
            const invitation = await context.prisma
                .userGroupInvite({id: inviteId})
                .$fragment(`{email, userGroup {id}}`);

            if (!invitation) {
                throw new ApolloError('Invitation could not be found', 'UI_ERROR');
            }

            if (user.email !== invitation.email) {
                throw new ApolloError(
                    `Email address on the invitation (${invitation.email}) does not match email address used to log in (${user.email}).`,
                    'UI_ERROR'
                );
            }

            const groupId = invitation.userGroup.id;

            if (accept && groupId) {
                addToUserGroup = await context.prisma.updateUserGroup({
                    where: {id: groupId},
                    data: {users: {connect: {id: userId}}},
                }).$fragment(`{
                    id
                    users {
                        id
                        name
                    }
                }`);
            }

            if (!addToUserGroup) {
                throw new ApolloError(
                    'There was a problem adding the user to the group',
                    'UI_ERROR'
                );
            }

            await context.prisma.deleteUserGroupInvite({id: inviteId});

            return addToUserGroup;
        },
        unjoinGroup: async (parent, {groupId}, context) => {
            const userId = await getUserId(context);

            return context.prisma.updateUserGroup({
                where: {groupId},
                data: {users: {disconnect: {id: userId}}},
            });
        },
        deleteInvite: async (parent, {inviteId}, context) => {
            return context.prisma.deleteUserGroupInvite({id: inviteId});
        },
        deleteUserFromGroup: async (parent, {userId, groupId}, context) => {
            const myUserId = await getUserId(context);
            const deleteResponse = await context.prisma.updateUserGroup({
                where: {id: groupId},
                data: {users: {disconnect: {id: userId}}},
            });
            // find any groups with this user
            const userInMyGroups = await context.prisma.userGroups({
                where: {users_some: {id: userId}, owner: {id: myUserId}},
            });

            // Remove user from any of my lists if it is not a part of userInMyGroups any more
            if (deleteResponse && !(userInMyGroups && userInMyGroups.length)) {
                context.prisma.updateManyLists({
                    where: {owner: {id: myUserId}},
                    data: {sharedWith: {disconnect: {id: userId}}},
                });
            }

            return deleteResponse;
        },
    },
};
