import React, {createContext, useContext} from 'react';
import PropTypes from 'prop-types';

const APP_STORAGE_KEY = 'APP_STORAGE';
const DEFAULT_CONTEXT = {
    setItem: () => null,
    getItem: () => null,
    removeItem: () => null,
    clearStorage: () => null,
};
const isSSR = () => typeof window === 'undefined';

const StorageContext = createContext(DEFAULT_CONTEXT);

export const useStorage = () => useContext(StorageContext);

export default function StorageProvider({children}) {
    function setItem(key, value) {
        if (!isSSR()) {
            return window.localStorage.setItem(`${APP_STORAGE_KEY}__${key}`, value);
        }
    }

    function getItem(key) {
        if (!isSSR()) {
            return window.localStorage.getItem(`${APP_STORAGE_KEY}__${key}`);
        }
    }

    function removeItem(key) {
        if (!isSSR()) {
            return window.removeItem.getItem(`${APP_STORAGE_KEY}__${key}`);
        }
    }

    function clearStorage() {
        if (!isSSR()) {
            return window.localStorage.clear();
        }
    }

    const context = {
        setItem,
        getItem,
        removeItem,
        clearStorage,
    };
    return <StorageContext.Provider value={context}>{children}</StorageContext.Provider>;
}

StorageProvider.propTypes = {
    children: PropTypes.node,
};
