import { useMemo } from "react";
import useGenerateQrCode from "@/hooks/useGenerateQrCode";
import useCheckForResponse from "@/hooks/useVerificationResponse";
import { useQRCode } from "next-qrcode";
import { v4 as uuidv4 } from "uuid";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";
import { Button } from "@/components/ui/button";

/**
 * The homepage.
 */
export default function Home() {
  // Generate a unique session ID using uuid library.
  const sessionId = useMemo(() => uuidv4(), []);

  // Used to render the QR code.
  const { Canvas } = useQRCode();

  // Fetch the QR code from the server with loading + error states thanks to TanStack Query.
  const {
    data: qrCode,
    isLoading: loadingQrCode,
    isError: qrCodeError,
  } = useGenerateQrCode(sessionId);

  // Once a QR code has been loaded, check the DB every 5 seconds for a verification response.
  // That response indicates a user has successfully submitted their proof and it was verified by the server.
  const { data: verificationResponse } = useCheckForResponse(
    sessionId,
    !!qrCode
  );

  return (
    <main className="flex min-h-screen flex-col items-center p-5 pt-24 text-center">
      <div className="radial-gradient absolute blur-3xl rounded-full opacity-10 bg-gradient-to-br from-indigo-400 via-purple-400 to-pink-400 z-0 h-64 w-1/2 top-8 left-1/4 " />

      <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl text-center">
        Polygon ID
      </h1>

      <p className="leading-7 [&:not(:first-child)]:mt-6 text-center max-w-2xl mb-4">
        A demo application using Polygon ID to prove your age via zero-knowledge
        proofs.
      </p>

      {/* Render the verification status */}
      <p className="text-center max-w-2xl mb-4 text-2xl">
        Your current status:{" "}
        {!!verificationResponse ? (
          <span className="text-green-400">Verified</span>
        ) : (
          <span className="text-red-400">Not verified</span>
        )}
      </p>

      <p className="text-center max-w-2xl mb-4">
        Follow the steps below to prove your age to the website without
        revealing your birthday.
      </p>

      <Separator className="mb-4 w-1/2" />

      <h2 className="scroll-m-20 pb-2 text-3xl font-semibold tracking-tight transition-colors first:mt-0">
        1/ Issuer → Prover
      </h2>

      <p className="leading-7 text-center max-w-2xl mt-2 mb-4">
        An <strong>issuer</strong> provides the prover with a verified
        credential (VC) that contains their birthday. In this demo, you (the
        prover), are trying to prove your age to the website (the verifier).
      </p>

      <p className="leading-7 text-center max-w-2xl mt-4 mb-2">
        To get a verified credential, first, download the Polygon ID wallet app
        on{" "}
        <Link
          className="underline font-semibold"
          target="_blank"
          href="https://apps.apple.com/us/app/polygon-id/id1629870183"
        >
          iOS
        </Link>{" "}
        or{" "}
        <Link
          className="underline font-semibold"
          target="_blank"
          href="https://play.google.com/store/apps/details?id=com.polygonid.wallet&pli=1"
        >
          Android
        </Link>
        . Use the app to receive a verified credential from this{" "}
        <Link
          className="underline font-semibold"
          target="_blank"
          href="https://issuer-demo.polygonid.me/"
        >
          Demo Issuer
        </Link>
        .
      </p>

      <div className="flex justify-center space-x-4 mt-4">
        <Button
          className="bg-gradient-to-br"
          variant="secondary"
          onClick={() =>
            window.open("https://apps.apple.com/us/app/polygon-id/id1629870183")
          }
        >
          Download for iOS
        </Button>

        <Button
          className="bg-gradient-to-br"
          variant="secondary"
          onClick={() =>
            window.open(
              "https://play.google.com/store/apps/details?id=com.polygonid.wallet&pli=1"
            )
          }
        >
          Download for Android
        </Button>

        <Button
          className="bg-gradient-to-br"
          onClick={() => window.open("https://issuer-demo.polygonid.me/")}
        >
          Get Verified Credential
        </Button>
      </div>

      <Separator className="my-4 w-1/2" />

      <h2 className="scroll-m-20 pb-2 text-3xl font-semibold tracking-tight transition-colors first:mt-0">
        2/ Prover → Verifier
      </h2>

      <p className="leading-7 text-center max-w-2xl mt-2 mb-4">
        Once you have the verified credential, you can use it to prove your age
        to the website without revealing your birthday using the Polygon ID app.
      </p>

      <p className="leading-7 text-center max-w-2xl mt-2 mb-2">
        Scan the QR code below with the Polygon ID app to prove your age to the
        website.
      </p>

      {/* Render the QR code with loading + error states */}
      {qrCodeError && (
        <p className="text-center">
          Something went wrong generating the QR code.
        </p>
      )}
      {!qrCodeError && loadingQrCode ? (
        <p className="text-center">Loading...</p>
      ) : (
        <div className="flex justify-center">
          <Canvas
            text={JSON.stringify(qrCode)}
            options={{
              width: 384,
            }}
          />
        </div>
      )}

      <a
        href="https://github.com/jarrodwatts/polygon-id"
        target="_blank"
        className="text-md text-muted-foreground mt-8 underline semibold"
      >
        View the source code on GitHub.
      </a>
    </main>
  );
}
