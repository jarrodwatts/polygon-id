import type { NextApiRequest, NextApiResponse } from "next";
import { Polybase } from "@polybase/client";
import { auth } from "@iden3/js-iden3-auth";

/**
 * API Route for generating a QR Code for the verification process.
 */
export default async function generateQrCode(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // Get the session ID out of the request body.
  const { requestId } = req.body;

  // Create the authorization request
  // Learn more: https://0xpolygonid.github.io/tutorials/verifier/verification-library/request-api-guide/#createauthorizationrequest
  const request = auth.createAuthorizationRequest(
    // Reason for the authorization request
    "Must be born before this year",

    // Polygon ID of the requester
    process.env.NEXT_PUBLIC_SENDER_DID as string,

    // Callback URL. What API Route to run to verify the proof?
    `${
      process.env.NODE_ENV === "production" // Am I in production?
        ? process.env.NEXT_PUBLIC_PRODUCTION_URL // Yes, use production URL
        : process.env.NEXT_PUBLIC_DEVELOPMENT_URL // No, use development URL
    }/api/handle-verification?requestId=${requestId}` // To verify, use the handle-verification API route
  );

  // Set ID and thread ID to the session ID
  request.id = requestId;
  request.thid = requestId;

  // Here, we'll append some extra scope to the request.
  // This allows us to verify the user's age.
  // Design your own customised authentication requirement here using Query Language:
  // https://0xpolygonid.github.io/tutorials/verifier/verification-library/zk-query-language/
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
            $lt: 20230101, // Birthday must be less than this date.
          },
        },
      },
    },
  ];

  // Store the request in the Polybase database
  const db = new Polybase({
    defaultNamespace: process.env.NEXT_PUBLIC_POLYBASE_NAMESPACE,
  });
  await db.collection("Requests").create([requestId, JSON.stringify(request)]);

  // Send the QR code back to the client.
  res.status(200).json({ request });
}
