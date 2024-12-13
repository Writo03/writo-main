import { useEffect, useState } from "react";
import axiosInstance from "@/utils/axiosInstance";

export default function useFetchTestSeries(
  isSubjectTest: boolean,
  isFree: boolean,
  serviceId: string,
) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [testSeries_t, setTestSeries] = useState<any[]>([]);
  const [loading_t, setLoading] = useState(true);
  const [error_t, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true; // Prevent updates if the component is unmounted

    const fetchTestSeries = async () => {
      setLoading(true);
      try {
        const response = await axiosInstance.get(
          `/quiz/get-quizes?isSubjectTest=${isSubjectTest}&isFree=${isFree}&serviceId=${serviceId}`,
        );
        console.log(response)
        if (isMounted) {
          setTestSeries(response.data.data || []);
          setError(null);
        }
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch (err) {
        if (isMounted)
          setError("Failed to load test series. Please try again later.");
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchTestSeries();
    return () => {
      isMounted = false;
    };
  }, [isSubjectTest, isFree, serviceId]);
  return { testSeries_t, loading_t, error_t };
}
