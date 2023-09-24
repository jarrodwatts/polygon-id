import React from "react";
import { Post, useComments } from "@lens-protocol/react-web";
import Comments from "./Comments";

function convertIPFSToGateway(ipfsHash: string) {
    const doubleipfs = "ipfs://ipfs://"
    const singleipfs = "ipfs://"
    if (ipfsHash.includes(doubleipfs)) {
        return ipfsHash.replace(doubleipfs, "https://ipfs.io/ipfs/");
    } else if (ipfsHash.includes(doubleipfs)) {
        return ipfsHash.replace(singleipfs, "https://ipfs.io/ipfs/");
    }
}

const Post = ({ post } : { post : Post}) => {
    let content;
    let formatedDate;
    let images;
    let imageURLS;
    let imageALTS;

    if (post.__typename === "Post") {
        content = post.metadata.content
        images = post.metadata.media
        formatedDate = new Date(post.createdAt).toLocaleString('en-us', {month: 'short', day: 'numeric', year: '2-digit'})
        imageURLS = images.map(({ original: { url }}) => convertIPFSToGateway(url))
        imageALTS = images.map(({ original: { altTag }}) => altTag )
        
    } else {
        // Ignore Mirrors and comments
        return null
    }

    return (
    <div className="flex content-center w-full">
        <div className="max-w-sm rounded overflow-hidden shadow-lg bg-white m-8 w-1/2">
            <img className="w-full" src={imageURLS[0]} alt={ imageALTS[0] }></img>
            <div className="px-8 py-4">
                <p className="text-gray-900 text-base">{post.profile.name} </p>
                <p className="text-gray-800">
                    {formatedDate}
                </p>
                <p className="text-gray-700 text-base whitespace-normal">{content}</p>
        
            </div>
        </div>
        <Comments postId={post.id} />
    </div>
    )
            

}

export default Post;