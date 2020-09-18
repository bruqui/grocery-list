import React from 'react';
import PropTypes from 'prop-types';

import getClassName from 'tools/getClassName';

// layout
import Layout from 'components/layout/Layout';

// app
import Authenticated from 'components/app/Authenticated';
import JoinGroup from 'components/app/users/JoinGroup';

export default function JoinGroupPage({className}) {
    const [rootClassName] = getClassName({className, rootClass: 'join-group-page'});

    return (
        <Layout className={rootClassName} title="Join Group">
            <Authenticated>
                <JoinGroup />
            </Authenticated>
        </Layout>
    );
}

JoinGroupPage.propTypes = {
    className: PropTypes.string,
};
