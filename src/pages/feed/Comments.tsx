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
import { SelectForm } from "@/components/ui/select-identity";
import { useQRCode } from "next-qrcode";
import useGenerateQrCode from "@/hooks/useGenerateQrCode";
import useCheckForResponse from "@/hooks/useVerificationResponse";
import QRCode from "@/components/ui/QRCode"

const Comments = ({ postId } : { postId : PublicationId}) => {
  // Generate a unique session ID using uuid library.
    const {data: commentObjects, loading: isCommentsLoading, hasMore, next} = useComments({commentsOf: postId});
  const { data: activeProfile, loading: isLoginLoading } = useActiveProfile();
  // Used to render the QR code.

  let profileId = activeProfile?.id || '0x02' as ProfileId;
  const [val, setVal] = React.useState('')
  const [selectedIdentity, setSelectedIdentity] = useState<string>("")
  const [isShowingQRCode, setIsShowingQRCode] = useState(false)
  const handleAddVote = () => {
    setIsShowingQRCode(true)

  }

  const handleChangeIdentity = (value : string) => {
    setIsShowingQRCode(false)
    setSelectedIdentity(value)
  }


    const comments = commentObjects ? commentObjects.map(({ metadata: { content }}) => content ) : [];
    return (
        <div className="text-center overflow-y-scroll px-8 py-4 m-8 shadow-lg w-1/2">

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
