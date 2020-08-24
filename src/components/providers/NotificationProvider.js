import React, {createContext, useContext, useState} from 'react';
import PropTypes from 'prop-types';
import {uniqueId} from 'lodash';

/**
    Notification to set should be in the following format...
    {
        message: 'Message to display'
        messageKey: 'lookupKey',
        type: 'error', // (optional) displays with error styling if set to error
        ttl: 60000 // (optional) defaults to 60000 use -1 for infinite
    }
*/
import NotificationSnackbar from 'components/app/NotificationSnackbar';

const DEFAULT_TTL = 60000;
const DEFAULT_CONTEXT = {
    currentNotification: null,
    removeNotification: () => null,
    setNotification: () => null,
};

const NotificationContext = createContext(DEFAULT_CONTEXT);

export function useNotifications() {
    const {currentNotification, removeNotification, setNotification} = useContext(
        NotificationContext
    );

    function clearNotification() {
        if (currentNotification && currentNotification.messageKey) {
            removeNotification(currentNotification.messageKey);
        }
    }

    return {
        currentNotification,
        clearNotification,
        removeNotification,
        setNotification,
    };
}

export default function NotificationProvider({children}) {
    const [notifications, setNotificationsState] = useState([]);

    function setNotification(notification) {
        const notificationParams = !notification.messageKey
            ? {
                  message: 'messageKey must be set to display a notificaiton',
                  messageKey: uniqueId('notification'),
                  type: 'error',
                  ttl: DEFAULT_TTL,
              }
            : {ttl: DEFAULT_TTL, ...notification};

        setNotificationsState([...notifications, notificationParams]);
    }

    function removeNotification(messageKey) {
        setNotificationsState(
            notifications.filter(
                (notification) => messageKey !== notification.messageKey
            ) || {}
        );
    }

    const context = {
        currentNotification: notifications[0],
        removeNotification,
        setNotification,
    };

    return (
        <NotificationContext.Provider value={context}>
            {children}
            <NotificationSnackbar
                notification={notifications[0]}
                removeNotification={removeNotification}
            />
        </NotificationContext.Provider>
    );
}

NotificationProvider.propTypes = {
    children: PropTypes.node,
};
