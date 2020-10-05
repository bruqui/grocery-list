import {getUserId} from '../../lib/user';

export const notificationResolvers = {
    QUERY: {
        allNotificationsForUser: async (parent, args, context) => {
            const userId = await getUserId(context);

            return context.prisma.notifications({user: {id: userId}});
        },
    },
    MUTATION: {
        deleteNotification: (parent, {notificationId}, context) => {
            return context.prisma.deleteNotification({id: notificationId});
        },
    },
};
