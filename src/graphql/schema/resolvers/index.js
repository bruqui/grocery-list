import {accountResolvers} from './Account';
import {listResolvers} from './List';

export default {
    Query: {
        ...accountResolvers.QUERY,
        ...listResolvers.QUERY,
    },
    Mutation: {
        ...accountResolvers.MUTATION,
        ...listResolvers.MUTATION,
    },
    Subscription: {
        ...listResolvers.SUBSCRIPTION,
    },
};
