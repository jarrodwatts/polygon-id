import type { NextApiRequest, NextApiResponse } from "next";
import { Polybase } from "@polybase/client";
import { auth, resolver, loaders } from "@iden3/js-iden3-auth";

export default async function generateQrCode(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { requestId } = req.body;

  // 1. createAuthorizationRequest (create a new request)
  const request = auth.createAuthorizationRequest(
    // Reason: What is the reason for this request?
    "Must be born before this year",
    // Sender: The audience represents the DID of the requester
    "did:polygonid:polygon:mumbai:2qDyy1kEo2AYcP3RT4XGea7BtxsY285szg6yP9SPrs",
    // callbackUrl: Where should the user be redirected after the request is complete?
    `${
      // if local env
      process.env.NODE_ENV === "production"
        ? "https://polygon-id-tau.vercel.app"
        : "http://localhost:3000"
    }/api/handle-verification?requestId=${requestId}`
  );

  request.id = requestId;
  request.thid = requestId;

  const scope = request.body.scope ?? [];
  request.body.scope = [
    ...scope,
    {
      id: 1,
      circuitId: "credentialAtomicQuerySigV2",
      query: {
        allowedIssuers: ["*"],
        type: "KYCAgeCredential",
        context:
          "https://raw.githubusercontent.com/iden3/claim-schema-vocab/main/schemas/json-ld/kyc-v3.json-ld",
        credentialSubject: {
          birthday: {
            $lt: 20230101,
          },
        },
      },
    },
  ];

  // Store request in Polybase DB
  const db = new Polybase({
    defaultNamespace:
      "pk/0x2cd58ee4f9908a52b63882a622fb778e21b0b35a177ca5d3b7d9f0cd51eaaf4ec36f0c799e7002598fa2bf80590951a979164f67f0e1a1de5d1a29501681b056/test-polygon-id-app",
  });

  await db.collection("Proofs").create([requestId, JSON.stringify(request)]);

  // Send request back to client
  res.status(200).json({ request });
}
