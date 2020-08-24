import {useMemo} from 'react';
import {useAuth} from 'components/providers/AuthProvider';

export default function usePollingInterval(pollingInterval = 30000) {
    const {authenticated} = useAuth();
    const currentPollingInterval = useMemo(() => (authenticated ? pollingInterval : 0));

    return currentPollingInterval;
}
