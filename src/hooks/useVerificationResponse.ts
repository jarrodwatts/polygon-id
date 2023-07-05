import { useQuery } from "@tanstack/react-query";
import { Polybase } from "@polybase/client";

/**
 * Queries the Polybase Database to see if a response has been received
 * from the verification process.
 * @param id
 * @returns
 */
const checkForResponse = async (id: string) => {
  // Initialize Polybase
  const db = new Polybase({
    defaultNamespace: process.env.NEXT_PUBLIC_POLYBASE_NAMESPACE,
  });

  // Read the "Responses" collection for a record with the given ID
  const record = await db
    .collection("Responses")
    .record(id as string)
    .get();

  // If the record exists, return the data
  if (record.exists()) {
    const { data } = record;
    return data;
  }

  // If not, throw an error so that React query will try again in 5 seconds
  throw new Error("No response found yet. React Query will try again");
};

/**
 * React hook that calls the above function every 5 seconds.
 * Wrapped in the "useQuery" hook from TanStack Query
 * https://tanstack.com/query/v4/docs/react/reference/useQuery
 */
export default function useCheckForResponse(
  id: string, // Session ID
  enabled: boolean = true // This is so it only runs once a QR code has been generated.
) {
  return useQuery({
    queryKey: ["checkForResponse", id], // The key for the query (for caching purposes)
    queryFn: () => checkForResponse(id), // The function to call
    retry: true, // Retry the query if it fails (see error handling above)
    retryDelay: 5000, // Retry every 5 seconds
    retryOnMount: true, // Retry the query when the component mounts
    enabled, // Only run the query if the "enabled" parameter is true
  });
}
