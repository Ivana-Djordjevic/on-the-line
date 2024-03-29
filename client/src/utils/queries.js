import { gql } from '@apollo/client';

export const QUERY_USER = gql`
    query me {
        me {
            _id
            username
            email
            password
        }
    }
`;

export const QUERY_USERS = gql`
    query users($userId: String, $limit: Int, $offset: Int) {
        users(userId: $userId, limit: $limit, offset: $offset) {
            _id
            username
        }
    }
`;

export const QUERY_POSTS = gql`
    query posts($userId: String, $page: Int) {
        posts(userId: $userId, page: $page) {
            totalPages
            totalDocs
            prevPage
            pagingCounter
            page
            nextPage
            limit
            hasPrevPage
            hasNextPage
            docs {
                _id
                caption
                altText
                image
                comments {
                    _id
                    content
                    user {
                        _id
                        username
                    }
                }
                user {
                    _id
                    username
                }
            }
        }
    }
`;

export const QUERY_COMMENTS = gql`
    query comments($userId: String, $limit: Int, $offset: Int) {
        comments(userId: $userId, limit: $limit, offset: $offset) {
            _id
            content
        }
    }
`;