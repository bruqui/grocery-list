import React, {createContext, useContext, useEffect, useState} from 'react';
import PropTypes from 'prop-types';
import {pull, union} from 'lodash';

const INITIAL_STATE = {
    loading: false,
    loadingKeys: [],
};
const DEFAULT_CONTEXT = {
    ...INITIAL_STATE,
    setLoading: () => null,
};

const LoadingContext = createContext(DEFAULT_CONTEXT);

export function useGlobalLoading(loadingKeyArg = 'default', loadingArg) {
    const {loading, loadingKeys, setLoading} = useContext(LoadingContext);

    useEffect(() => {
        if (
            loadingKeyArg &&
            ((loadingArg === true && !loadingKeys.includes(loadingKeyArg)) ||
                (!loadingArg && loadingKeys.includes(loadingKeyArg)))
        ) {
            setLoading(loadingArg, loadingKeyArg);
        }
    }, [loadingArg, loadingKeyArg, loadingKeys, setLoading]);

    return {
        setLoading,
        loading,
    };
}

export default function LoadingProvider({children, className}) {
    const [loadingState, setLoadingState] = useState(INITIAL_STATE);

    function setLoading(loading, loadingKey = 'default') {
        if (loading === true) {
            setLoadingState({
                loadingKeys: union(loadingState.loadingKeys, [loadingKey]),
                loading: true,
            });
        } else if (loading === false) {
            const newLoadingKeys = pull(loadingState.loadingKeys, loadingKey);

            setLoadingState({
                loadingKeys: newLoadingKeys,
                loading: !!newLoadingKeys.length,
            });
        }
    }
    const context = {
        ...loadingState,
        setLoading,
    };

    return <LoadingContext.Provider value={context}>{children}</LoadingContext.Provider>;
}

LoadingProvider.propTypes = {
    children: PropTypes.node,
    className: PropTypes.string,
};
