import { useQRCode } from "next-qrcode";
import useGenerateQrCode from "@/hooks/useGenerateQrCode";
import { v4 as uuidv4 } from "uuid";
import Link from "next/link";

export default function Home() {
  const sessionId = uuidv4();
  const { Canvas } = useQRCode();
  const {
    data: qrCode,
    isLoading: loadingQrCode,
    isError: qrCodeError,
  } = useGenerateQrCode(sessionId);

  console.log({ qrCode, loadingQrCode });

  return (
    <main className={`flex min-h-screen flex-col items-center p-12 pt-24 `}>
      <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl text-center">
        Polygon ID Example
      </h1>
      <p className="leading-7 [&:not(:first-child)]:mt-6 text-center max-w-xl mb-8 ">
        A Next.js template to get started with Polygon ID.
      </p>

      <p className="leading-7 text-center max-w-xl mt-2 mb-2">
        1/ Scan the QR code from your Polygon ID on{" "}
        <Link
          className="underline font-semibold"
          target="_blank"
          href="https://play.google.com/store/apps/details?id=com.polygonid.wallet&pli=1"
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
      </p>

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
              width: 256,
            }}
          />
        </div>
      )}
    </main>
  );
}
