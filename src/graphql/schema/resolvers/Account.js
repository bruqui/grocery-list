import {ApolloError, ForbiddenError} from 'apollo-server-micro';
import {get} from 'lodash';

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
        userInvite: (parent, {inviteId}, context) => {
            return context.prisma.userInvite({id: inviteId});
        },
        invites: async (parent, args, context) => {
            const userId = await getUserId(context);
            const {email} = await getUser({id: userId}, context);

            return context.prisma.userInvites({where: {email}}).$fragment(`{
                id
                owner {
                    id
                    name
                }
            }`);
        },
        userConnections: async (parent, args, context) => {
            const userId = await getUserId(context);

            const user = await context.prisma.user({id: userId}).$fragment(`{
                id,
                connections {
                    id
                    email
                    name
                }
                invites {
                    id
                    email
                }
            }`);

            return user;
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
        inviteUser: async (parent, {email}, context) => {
            let invite;
            const userId = await getUserId(context);
            const user = await getUser({id: userId}, context);
            const invitee = await getUser({email}, context);
            let sendgridResponse;

            const invites = await context.prisma.userInvites({
                where: {
                    AND: [{email}, {owner: {id: userId}}],
                },
            });

            // if invite doesn't exist, create a new one; otherwise, just use
            // the existing one. This is so there aren't multiple invite records
            // going out to the same user and gives an inviter an opportunity to
            // resend the invite
            if (invites && invites.length) {
                invite = invites[0];
            } else {
                invite = await context.prisma.createUserInvite({
                    email,
                    owner: {connect: {id: userId}},
                });
            }

            if (!invite) {
                throw new ApolloError('Could not create an invitation', 'UI_ERROR');
            }

            if (invitee && invitee.id) {
                context.prisma.createNotification({
                    message: `${user.name} has sent you an invitation to connect.`,
                    user: {connect: {id: invitee.id}},
                });
            }

            if (typeof invite.id === 'string') {
                sendgridResponse = await sendEmail(
                    {email, inviteId: invite.id},
                    user,
                    context
                );

                if (typeof sendgridResponse === 'object') {
                    sendgridResponse = JSON.stringify(sendgridResponse);
                }

                // eslint-disable-next-line no-console
                console.log('SENDGRID_RESPONSE', sendgridResponse);
            }

            return {...invite, sendgridResponse};
        },
        deleteInvite: (parent, {inviteId}, context) => {
            return context.prisma.deleteUserInvite({id: inviteId});
        },
        acceptInvite: async (parent, {inviteId}, context) => {
            const userId = await getUserId(context);
            const user = await getUser({id: userId}, context);
            const invite = await context.prisma.userInvite({id: inviteId}).$fragment(`{
                id
                owner {
                    id
                    name
                }
            }`);

            const inviteUserId = get(invite, 'owner.id');

            if (!inviteUserId) {
                throw new ApolloError('Could not locate invitation', 'UI_ERROR');
            }

            const updateInvitee = await context.prisma.updateUser({
                where: {id: inviteUserId},
                data: {connections: {connect: {id: userId}}},
            });

            const updateInviter = await context.prisma.updateUser({
                where: {id: userId},
                data: {connections: {connect: {id: inviteUserId}}},
            });

            if (updateInvitee && updateInviter) {
                await context.prisma.deleteUserInvite({id: inviteId});
                await context.prisma.createNotification({
                    message: `You are now connected with ${user.name}.`,
                    user: {connect: {id: inviteUserId}},
                });
            }

            return [updateInvitee, updateInviter];
        },
        deleteConnection: async (parent, {connectionUserId}, context) => {
            const userId = await getUserId(context);

            const myDelete = await context.prisma.updateUser({
                where: {id: userId},
                data: {connections: {disconnect: {id: connectionUserId}}},
            });

            const theirDelete = await context.prisma.updateUser({
                where: {id: connectionUserId},
                data: {connections: {disconnect: {id: userId}}},
            });

            return [myDelete, theirDelete];
        },
    },
};
