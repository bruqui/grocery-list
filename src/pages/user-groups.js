import React from 'react';
import PropTypes from 'prop-types';

import getClassName from 'tools/getClassName';

// layout
import Layout from 'components/layout/Layout';

// app
import UserGroups from 'components/app/users/UserGroups';
import Authenticated from 'components/app/Authenticated';

export default function UserGroupsPage({className}) {
    const [rootClassName] = getClassName({className, rootClass: 'user-groups-page'});

    return (
        <Layout className={rootClassName}>
            <Authenticated>
                <UserGroups />
            </Authenticated>
        </Layout>
    );
}

UserGroupsPage.propTypes = {
    className: PropTypes.string,
};
