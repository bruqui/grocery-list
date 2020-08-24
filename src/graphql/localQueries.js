import gql from 'graphql-tag';

export const NewItemFragment = gql`
    fragment NewItem on Item {
        id
        name
        need
        purchased
    }
`;
