import React from 'react';

import { useState } from 'react';
import { useMutation } from '@apollo/client';

import { CREATE_COMMENT } from '../utils/mutations';
import { QUERY_POSTS } from '../utils/queries';

export default function CommentForm ({ postId }) {

    const [commentBody, setCommentBody] = useState('');

    const handleCommentChange = (e) => {
        setCommentBody(e.target.value);
    };

    const [createComment, { error }] = useMutation(
        CREATE_COMMENT, {
            refetchQueries: [
                    QUERY_POSTS
            ]
    });

    if(error) console.log(error)

    const handleCommentFormSubmit = async (e) => {
        e.preventDefault();

        try {
            const { data } = await createComment({
                variables: {
                    postId, 
                    commentBody,
                }
            });

            setCommentBody('');
        } catch(err) {
            console.log(err)
        }
    }

    return (
        <form className='text-sm grey-bg flex border-radius sm-box-shadow mt-5'>
            <div className='flex-col w-full'> 
                <p className='font-semibold ml-3 pt-2'>add comment:</p>
                <div className="flex items-start space-x-4">
       
                    <div className="p-2 min-w-0 flex-1">
                        <div action="#" className="relative">
                            <div className="bg-white overflow-hidden rounded-lg shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-indigo-600">
                                <textarea
                                    rows={3}
                                    name="commentText"
                                    id="comment"
                                    className="block w-full resize-none border-0 bg-transparent py-1.5 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
                                    placeholder="Add your comment..."
                                    value={commentBody}
                                    onChange={handleCommentChange}
                                />

                                {/* Spacer element to match the height of the toolbar */}
                                <div className="py-2" aria-hidden="true">
                                    {/* Matches height of button in toolbar (1px border + 36px content height) */}
                                    <div className="py-px">
                                        <div className="h-9" />
                                    </div>
                                </div>
                            </div>

                            <div className="absolute inset-x-0 bottom-0 flex justify-between py-2 pl-3 pr-2">
                                {/* <div className="flex items-center space-x-5">
                                    <div className="flex items-center">
                                    <button
                                        type="button"
                                        className="-m-2.5 flex h-10 w-10 items-center justify-center rounded-full text-gray-400 hover:text-gray-500"
                                    >
                                        <span className="sr-only">Attach a file</span>
                                    </button>
                                    </div>
                                    <div className="flex items-center"></div>
                                </div> */}
                                <div className="flex-shrink-0">
                                    <button
                                        onClick={handleCommentFormSubmit}
                                        type="submit"
                                        className="inline-flex items-center rounded-md bg-indigo-600 px-3 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                                    >
                                    Post
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </form>
    )
}