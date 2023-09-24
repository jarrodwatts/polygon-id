'use client'
import React from "react";
import { ProfileId, PublicationId, useActiveProfile, useComments } from "@lens-protocol/react-web";
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
  } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { SelectForm } from "@/components/ui/select-identity";


  const IDENTITIES = ['Physics', 'Chemistry', 'Biology']
const Comments = ({ postId } : { postId : PublicationId}) => {
    const {data: commentObjects, loading: isCommentsLoading, hasMore, next} = useComments({commentsOf: postId});
  const { data: activeProfile, loading: isLoginLoading } = useActiveProfile();

  let profileId = activeProfile?.id || '0x02' as ProfileId;
  const [val, setVal] = React.useState('')


    const comments = commentObjects ? commentObjects.map(({ metadata: { content }}) => content ) : [];
    return (
        <div className="text-center overflow-y-scroll px-8 py-4 m-8 shadow-lg w-1/2">

          <label>Veracity Measure</label>
          <Slider defaultValue={[50]} max={100} step={1} />
          <SelectForm/>


            {
                isCommentsLoading ? 
                    <p> Loading ...</p> : 
                    commentObjects?.map(({id, metadata: { content }}) => <p key={id}>{ content }</p>)
            }

        </div>
    )
}

export default Comments;