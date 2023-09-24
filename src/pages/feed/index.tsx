'use client'
import React from "react";
import { PublicationId, useAccessToken, useActiveProfile, useExplorePublications, useFeed, usePublication } from "@lens-protocol/react-web";
import { ProfileId } from "@lens-protocol/react-web";
import LoginButton from "@/components/ui/authentication";
import { Button } from "@/components/ui/button";
import Post from "./Post";
import InfiniteList from "./InfiniteList";

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
                <>
                    <p> TESTING</p>
                    {
                        publication?.__typename == "Post" && 
                        <Post key={'0x91ba-0x01'} post={publication} />
                    }
                        <p> END OF TESTING</p>
                    {feedItems?.map((feedItem) => (
                        feedItem.__typename == "Post" && 
                            <Post key={feedItem.id} post={feedItem} />
                    ))}
                
                </>
            </InfiniteList>
            <Button onClick={next}> Next Posts</Button>

        </>

    )

}