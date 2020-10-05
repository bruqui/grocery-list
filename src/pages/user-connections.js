import React from 'react';
import PropTypes from 'prop-types';

import getClassName from 'tools/getClassName';

// layout
import Layout from 'components/layout/Layout';

// app
import UserConnections from 'components/app/users/UserConnections';
import Authenticated from 'components/app/Authenticated';

export default function ConnectionsPage({className}) {
    const [rootClassName] = getClassName({className, rootClass: 'connections-page'});

    return (
        <Layout className={rootClassName}>
            <Authenticated>
                <UserConnections />
            </Authenticated>
        </Layout>
    );
}

ConnectionsPage.propTypes = {
    className: PropTypes.string,
};
