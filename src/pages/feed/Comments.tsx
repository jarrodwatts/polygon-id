'use client'
import React from "react";
import { PublicationId, useComments } from "@lens-protocol/react-web";
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
  } from "@/components/ui/select"


const Comments = ({ postId } : { postId : PublicationId}) => {
    const {data: commentObjects, loading: isCommentsLoading, hasMore, next} = useComments({commentsOf: postId});

    const comments = commentObjects ? commentObjects.map(({ metadata: { content }}) => content ) : [];
    return (
        <div className="text-center overflow-y-scroll px-8 py-4 m-8 shadow-lg w-1/2">
            <Select defaultValue="comments">
            <SelectTrigger className="w-[180px]">
                <SelectValue/>
            </SelectTrigger>
            <SelectContent>
                <SelectGroup>
                <SelectItem value="voting">Wiki3</SelectItem>
                <SelectItem value="comments">{`Comments (${comments.length})`}</SelectItem>
                </SelectGroup>
            </SelectContent>
            </Select>
            {
                isCommentsLoading ? 
                    <p> Loading ...</p> : 
                    commentObjects?.map(({id, metadata: { content }}) => <p key={id}>{ content }</p>)
            }
        </div>
    )
}

export default Comments;