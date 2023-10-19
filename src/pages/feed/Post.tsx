import React from "react";
import { Post, useComments } from "@lens-protocol/react-web";
import Comments from "./Comments";
import { SelectForm } from "@/components/ui/select-identity";
import { Slider } from "@/components/ui/slider";

function convertIPFSToGateway(ipfsHash: string) {
    const doubleipfs = "ipfs://ipfs://"
    const singleipfs = "ipfs://"
    if (ipfsHash.includes(doubleipfs)) {
        return ipfsHash.replace(doubleipfs, "https://ipfs.io/ipfs/");
    } else if (ipfsHash.includes(singleipfs)) {
        return ipfsHash.replace(singleipfs, "https://ipfs.io/ipfs/");
    }
}

const Post = ({ post } : { post : Post}) => {
    let content;
    let formatedDate;
    let images;
    let imageURLS;
    let imageALTS;

    content = post.metadata.content
    images = post.metadata.image
    formatedDate = new Date(post.createdAt).toLocaleString('en-us', {month: 'short', day: 'numeric', year: '2-digit'})
    // imageURLS = images.map(({ original: { url }}) => convertIPFSToGateway(url))
    // imageALTS = images.map(({ original: { altTag }}) => altTag )
    const imageUrl = post.metadata.image ? convertIPFSToGateway(post.metadata.image) : ""
        
    return (
    <div className="flex content-center w-full">
        <div className="max-w-sm rounded overflow-hidden shadow-lg bg-white m-8 w-1/2">
            <img className="w-full" src={imageUrl}></img>
            <div className="px-8 py-4">
                <p className="text-gray-900 text-base">{post.profile.name} </p>
                <p className="text-gray-800">
                    {formatedDate}
                </p>
                <p className="text-gray-700 text-base whitespace-normal">{content}</p>
            </div>
        </div>
    </div>
    )

}

export default Post;