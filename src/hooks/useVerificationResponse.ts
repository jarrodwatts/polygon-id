import { useQuery } from "@tanstack/react-query";
import { Polybase } from "@polybase/client";

const checkForResponse = async (id: string) => {
  // Store request in Polybase DB
  const db = new Polybase({
    defaultNamespace:
      "pk/0x2cd58ee4f9908a52b63882a622fb778e21b0b35a177ca5d3b7d9f0cd51eaaf4ec36f0c799e7002598fa2bf80590951a979164f67f0e1a1de5d1a29501681b056/test-polygon-id-app",
  });

  const record = await db
    .collection("Responses")
    .record(id as string)
    .get();

  if (record.exists()) {
    const { data } = record; // or const data = record.data

    return data;
  }

  throw new Error("No response found yet. React Query will try again");
};

export default function useCheckForResponse(
  id: string,
  enabled: boolean = true
) {
  return useQuery({
    queryKey: ["checkForResponse", id],
    queryFn: () => checkForResponse(id),
    retry: true,
    retryDelay: 5000,
    retryOnMount: true,
    enabled,
  });
}
