import {accountResolvers} from './Account';
import {listResolvers} from './List';
import {notificationResolvers} from './Notification';

export default {
    Query: {
        ...accountResolvers.QUERY,
        ...listResolvers.QUERY,
        ...notificationResolvers.QUERY,
    },
    Mutation: {
        ...accountResolvers.MUTATION,
        ...listResolvers.MUTATION,
        ...notificationResolvers.MUTATION,
    },
    Subscription: {
        ...listResolvers.SUBSCRIPTION,
    },
};
