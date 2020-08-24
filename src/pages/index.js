import React from 'react';

// layout
import Layout from 'components/layout/Layout';
import Section from 'components/layout/Section';

// app
import Lists from 'components/app/lists/Lists';

export default function IndexPage() {
    // TODO: move layout stuff to lists probably for better layout for LoginForm
    return (
        <Layout className="home-page" title="Home">
            <Section centered>
                <Lists />
            </Section>
        </Layout>
    );
}
