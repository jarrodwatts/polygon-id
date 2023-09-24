'use client'
import React from "react";
import { PublicationId,  useActiveProfile, useExplorePublications, useFeed, usePublication } from "@lens-protocol/react-web";
import { ProfileId } from "@lens-protocol/react-web";
import LoginButton from "@/components/ui/authentication";
import { Button } from "@/components/ui/button";
import Post from "./Post";
import InfiniteList from "./InfiniteList";
import Comments from "@/pages/feed/Comments";
import { SelectForm } from "@/components/ui/select-identity";
import { Slider } from "@/components/ui/slider";

export default function Feed() {
  const { data: activeProfile, loading: isLoginLoading } = useActiveProfile();

  let profileId = activeProfile?.id || '0x02' as ProfileId;
  const { data: feedItems, loading: isFeedLoading, hasMore, next } = useExplorePublications()
  // Test to always display Imi's post
  const { data: publication, loading: isPostLoading} = usePublication({
    publicationId: '0x91ba-0x01' as PublicationId
  })
  console.log("HAHAS", publication)
  return (
    <>
      <LoginButton />
      <InfiniteList
        loading={isFeedLoading}
        next={next}
        hasMore={hasMore}
        className="grid place-content-center w-full">
        {feedItems?.map((feedItem) => (
          feedItem.__typename == "Post" &&
          <div className="grid grid-cols-4 gap-2">
              <div className="col-span-2">
                  <Post key={feedItem.id} post={feedItem} />
              </div>
              <div className="col-span-2">
                  <Comments postId={feedItem.id} />
                  <SelectForm />
                  <Slider className="mt-4" defaultValue={[50]} max={100} step={1} />
              </div>
          </div>
        ))}
      </InfiniteList>
      <Button onClick={next}> Next Posts</Button>

    </>

  )

}