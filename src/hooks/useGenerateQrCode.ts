import { useQuery } from "@tanstack/react-query";

const generateQrCode = async (id: string) => {
  const result = await fetch("/api/generate-qr-code", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ requestId: id }),
  });
  const data = await result.json();
  return data.request;
};

export default function useGenerateQrCode(sessionId: string) {
  return useQuery({
    queryKey: ["generateQrCode"],
    queryFn: () => generateQrCode(sessionId),
    refetchOnWindowFocus: false,
    cacheTime: 0,
  });
}
