import useGenerateQrCode from "@/hooks/useGenerateQrCode";
import useCheckForResponse from "@/hooks/useVerificationResponse";
import { useQRCode } from "next-qrcode";
import { useEffect, useMemo } from "react";
import { v4 as uuidv4 } from "uuid";
import { useActiveProfile, useCreateComment } from "@lens-protocol/react-web";

import { createHelia } from 'helia'
import { strings } from '@helia/strings'
import { json } from '@helia/json'


const QRCode = ({identity} : {identity: string}) => {
    const sessionId = useMemo(() => uuidv4(), []);
    const {
    data: qrCode,
    isLoading: loadingQrCode,
    isError: qrCodeError,
    } = useGenerateQrCode(sessionId, identity);


    const { data: verificationResponse } = useCheckForResponse(
        sessionId,
        !!qrCode
    );
   const { Canvas } = useQRCode();

   const {data: profile, loading} = useActiveProfile();

   useEffect(() => {
        if (!!verificationResponse) {
            console.log("FIRE USECOMMENT")
        }},
        [verificationResponse]
   )
   
   const upload = async (data: unknown): Promise<string> => {
    const helia = await createHelia()
    const j = json(helia)

    const myImmutableAddress = await j.add(data)


    const url = await j.get(myImmutableAddress)
  
    return url;
  }

   const { execute, error, isPending } = useCreateComment({ publisher: profile, upload })
   const handleCreateVote = () => {
        if (profile) {

        }
   }
   return (
    <div>
        {!loadingQrCode && <Canvas
        text={JSON.stringify(qrCode)}
        options={{
          width: 384,
        }} />}
        {!!verificationResponse ? (
            <span className="text-green-400">Verified</span>
          ) : (
            <span className="text-red-400">Not verified</span>
          )}
    </div>
   )
}

export default QRCode;