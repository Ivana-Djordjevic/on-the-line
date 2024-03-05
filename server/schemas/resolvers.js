const { User, Post, Comment } = require('../models');
const { signToken, AuthenticationError } = require('../utils/auth');

const resolvers = {
    Query: {
        me: async (_, args, context) => {
            return User.findOne({ _id: context.user._id })
        },
        users: async (_, { username, limit = 10, offset = 0 }) => {
            const params = username ? { username } : {};
            return User.find(params)
                .sort({ username: -1 })
                .skip(offset)
                .limit(limit);
        },
        posts: async (_, { username, limit = 10, offset = 0 }) => {
            const params = username ? { username } : {};
            return Post.find(params)
                .sort({ createdAt: -1 })
                .skip(offset)
                .limit(limit);
        },
        comments: async (_, { username, limit = 10, offset = 0  }) => {
            const params = username ? { username } : {};
            return Comment.find(params)
                .sort({ createdAt: -1 })
                .skip(offset)
                .limit(limit);
        }
    },

    Mutation: {
        login: async (_, { email, password }) => {
            const user = await User.findOne({ email });
            
            if (!user) {
                throw new AuthenticationError('User not found!');
            }
            
            const correctPw = await user.isCorrectPassword(password);
            
            if (!correctPw) {
                throw new AuthenticationError('Incorrect credentials!');
            }
            
            const token = signToken(user);
            
            return { token, user };
        },
        createUser: async (_, args) => {

            const user = await User.create(args);
            const token = signToken(user);
            
            return { token, user}
        },
        editUser: async (_, { userId, ...args }, context) => {
            if (context.user) {
                const updatedUser = await User.findOneAndUpdate(
                    { _id: userId ? userId : context.user._id },
                    args,
                    { new: true, runValidators: true }
                );
                return updatedUser;
            }
            throw new AuthenticationError('You need to be logged in!');
        },
        deleteUser: async (_, { userId }, context) => {
            if (context.user) {
                const deletedUser = await User.findOneAndDelete({ _id: userId });
                return deletedUser;
            }
            throw new AuthenticationError('You need to be logged in!');
        },
        createPost: async (_, args, context) => {
            if (context.user) {
                const post = await Post.create({ ...args, user: context.user._id });
                return post;
            }
            throw new AuthenticationError('You need to be logged in!');
        },
        editPost: async (_, { postId, ...args }, context) => {
            if (context.user) {
                const updatedPost = await Post.findOneAndUpdate(
                    { _id: postId, user: context.user._id },
                    args,
                    { new: true, runValidators: true }
                );
                return updatedPost;
            }
            throw new AuthenticationError('You need to be logged in!');
        },
        deletePost: async (_, { postId }, context) => {
            if (context.user) {
                const deletedPost = await Post.findOneAndDelete({ _id: postId, user: context.user._id });
                return deletedPost;
            }
            throw new AuthenticationError('You need to be logged in!');
        },
        createComment: async (_, { postId, ...args }, context) => {
            if (context.user) {
                const updatedPost = await Post.findOneAndUpdate(
                    { _id: postId },
                    { $push: { comments: { ...args, username: context.user.username } } },
                    { new: true, runValidators: true }
                );
                return updatedPost;
            }
            throw new AuthenticationError('You need to be logged in!');
        },
        editComment: async (_, { postId, commentId, commentBody }, context) => {
            if (context.user) {
                const updatedPost = await Post.findOneAndUpdate(
                    { _id: postId, user: context.user._id },
                    { $set: { "comments.$[elem].commentBody": commentBody } },
                    { 
                        arrayFilters: [ { "elem._id": commentId } ], 
                        new: true, 
                        runValidators: true 
                    }
                );
                return updatedPost;
            }
            throw new AuthenticationError('You need to be logged in!');
        },
        deleteComment: async (_, { postId, commentId }, context) => {
            if (context.user) {
                const updatedPost = await Post.findOneAndUpdate(
                    { _id: postId, user: context.user._id },
                    { $pull: { comments: { _id: commentId } } },
                    { new: true, runValidators: true }
                );
                return updatedPost;
            }
            throw new AuthenticationError('You need to be logged in!');
        }
    }
}

module.exports = resolvers;