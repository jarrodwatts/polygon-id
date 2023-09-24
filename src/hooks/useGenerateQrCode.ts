import { useQuery } from "@tanstack/react-query";

/**
 * Calls the API to generate a QR code
 */
const generateQrCode = async (id: string, identity: string) => {
  const result = await fetch("/api/generate-qr-code", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ requestId: id, identity: identity }),
  });
  const data = await result.json();
  return data.request;
};

/**
 * React hook that calls the above function
 * Wrapped in the "useQuery" hook from TanStack Query
 * https://tanstack.com/query/v4/docs/react/reference/useQuery
 */
export default function useGenerateQrCode(sessionId: string, identity: string) {
  return useQuery({
    queryKey: ["generateQrCode", sessionId],
    queryFn: () => generateQrCode(sessionId, identity),
    refetchOnWindowFocus: false,
    cacheTime: 0,
  });
}
