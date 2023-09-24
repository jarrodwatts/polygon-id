'use client'
import React, { useMemo, useState } from "react";
import { v4 as uuidv4 } from "uuid";
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
import { useQRCode } from "next-qrcode";
import useGenerateQrCode from "@/hooks/useGenerateQrCode";
import useCheckForResponse from "@/hooks/useVerificationResponse";
import QRCode from "@/components/ui/QRCode";



  // Fetch the QR code from the server with loading + error states thanks to TanStack Query.


  const IDENTITIES = ['Physics', 'Chemistry', 'Biology']
const Comments = ({ postId } : { postId : PublicationId}) => {
  // Generate a unique session ID using uuid library.
    const {data: commentObjects, loading: isCommentsLoading, hasMore, next} = useComments({commentsOf: postId});
  const { data: activeProfile, loading: isLoginLoading } = useActiveProfile();
  // Used to render the QR code.

  let profileId = activeProfile?.id || '0x02' as ProfileId;
  const [selectedIdentity, setSelectedIdentity] = useState<string>("")
  const [isShowingQRCode, setIsShowingQRCode] = useState(false)
  const handleAddVote = () => {
    setIsShowingQRCode(true) 

  }

  const handleChangeIdentity = (value : string) => {
    setIsShowingQRCode(false)
    setSelectedIdentity(value)
  }

  function extractSubstring(source: string, start: string, end: string): string | null {
    const startIdx = source.indexOf(start);
    const endIdx = source.indexOf(end, startIdx + start.length);
  
    if (startIdx === -1 || endIdx === -1) return null; // Return null if start or end string is not found
    
    return source.slice(startIdx + start.length, endIdx); // Extracting the substring between start and end strings
}
const maxLover = (votes: any) => {
  let max_key = undefined
  let max_value = 0
  for (const k in votes) {
    const v = votes[k]
    if (v > max_value) {
      max_value = v
      max_key = k
    }
  }
  return {max_key, max_value}
}
  const whoLovesThisMeme = (comments: string[]) => {
    const votes : any = {}
    for (const comment of comments) {
      const x = whoLovesThisMemeSingleComment(comment)
      const identity = x[0] as string
      const veracity = x[1]
      if (!(identity in votes)) votes[identity] = 0
      votes[identity] += veracity
    }
    return votes
  }
  const whoLovesThisMemeSingleComment = (comment: string) => {
    const data = extractSubstring(comment, "__WIKI3__", "__WIKI3__")
    const identity = extractSubstring(data!, ",", "__WIKI3__")
    const veracity = Number(extractSubstring(data!, "__WIKI3__", ","))
    return [
      identity,
      veracity,
    ]
  }


    const comments = commentObjects ? commentObjects.map(({ metadata: { content }}) => content ) : [];
    return (
        <div className="text-center overflow-y-scroll px-8 py-4 m-8 shadow-lg w-full">
          <Select defaultValue="comments">
            <SelectTrigger className="w-[180px]">
            <SelectValue/>
            </SelectTrigger>
            <SelectContent>
            <SelectGroup>
                <SelectItem value="voting">Wiki3</SelectItem>
                <SelectItem value="addComment">Add Comment</SelectItem>
                <SelectItem value="comments">{`Comments (${comments.length})`}</SelectItem>
            </SelectGroup>
            </SelectContent>
        </Select>
        <label>Veracity Measure</label>
          <Slider defaultValue={[50]} max={100} step={1} />
            <Select value={selectedIdentity} onValueChange={(value) => handleChangeIdentity(value)}>
            <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select your identity"/>
            </SelectTrigger>
            <SelectContent>
                <SelectGroup>
                    {IDENTITIES.map(identity=>(<SelectItem value={identity} key={identity}>{identity}</SelectItem>))}
                </SelectGroup>
            </SelectContent>
            </Select>

            <Button disabled={selectedIdentity === ""} onClick={handleAddVote}> Add Vote </Button>
            {isShowingQRCode && <QRCode identity={selectedIdentity} />
           
          }
          <div>

          </div>
            {
                isCommentsLoading ? 
                    <p> Loading ...</p> : 
                    commentObjects?.map(({id, metadata: { content }}) => <p key={id}>{ content }</p>)
            }

        </div>
    )
}

export default Comments;
