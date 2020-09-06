import React from 'react';

// app
import CreateList from 'components/app/lists/CreateList';
import ListLayout from 'components/app/lists/ListLayout';

export default function IndexPage() {
    // TODO: move layout stuff to lists probably for better layout for LoginForm
    return (
        <ListLayout className="home-page" title="Home" activeTab={3}>
            <CreateList />
        </ListLayout>
    );
}
