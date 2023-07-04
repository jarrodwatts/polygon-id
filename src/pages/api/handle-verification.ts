import type { NextApiRequest, NextApiResponse } from "next";
import { Polybase } from "@polybase/client";
import { auth, resolver, loaders } from "@iden3/js-iden3-auth";
import getRawBody from "raw-body";
import path from "path";

export default async function handleVerification(
  req: NextApiRequest,
  res: NextApiResponse
) {
  console.log("HANDLE VERIFICATION");

  // get requestId from query params
  const { requestId } = req.query;

  // Read session ID from Polybase
  const db = new Polybase({
    defaultNamespace:
      "pk/0x2cd58ee4f9908a52b63882a622fb778e21b0b35a177ca5d3b7d9f0cd51eaaf4ec36f0c799e7002598fa2bf80590951a979164f67f0e1a1de5d1a29501681b056/test-polygon-id-app",
  });

  const record = await db
    .collection("Proofs")
    .record(requestId as string)
    .get();
  const { data } = record; // or const data = record.data
  const authRequest = JSON.parse(data);

  // get JWZ token params from the post request
  const raw = await getRawBody(req);
  const tokenStr = raw.toString().trim();

  // The CredentialAtomicQuerySigValidator contract is used to verify any credential-related zk proof
  // generated by the user using the credentialAtomicQuerySigV2OnChain circuit.
  // https://0xpolygonid.github.io/tutorials/contracts/overview/#blockchain-addresses
  const mumbaiContractAddress = "0x134B1BE34911E39A8397ec6289782989729807a4";

  const ethStateResolver = new resolver.EthStateResolver(
    "mumbai.rpc.thirdweb.com",
    mumbaiContractAddress
  );

  const resolvers = {
    ["polygon:mumbai"]: ethStateResolver,
  };

  // Locate the directory that contains circuit's verification keys
  const verificationKeyloader = new loaders.FSKeyLoader(
    path.join(process.cwd(), "keys")
  );
  // @ts-ignore
  const sLoader = new loaders.UniversalSchemaLoader("ipfs.io");

  // EXECUTE VERIFICATION
  // @ts-ignore
  const verifier = new auth.Verifier(verificationKeyloader, sLoader, resolvers);

  try {
    const opts = {
      AcceptedStateTransitionDelay: 5 * 60 * 1000, // 5 minute
    };

    const authResponse = await verifier.fullVerify(tokenStr, authRequest, opts);

    console.log("AUTH RESPONSE:");
    console.log(authResponse);
  } catch (error) {
    return res.status(500).send(error);
  }
}
