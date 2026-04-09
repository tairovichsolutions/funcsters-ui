import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/lib/axiosClient";
import { PairingRequestDto } from "@/mock/pairingStore";

interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

export const usePairingLobby = () => {
  return useQuery({
    queryKey: ["pairing-lobby"],
    queryFn: async () => {
      const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8091/api";
      const response = await apiClient.get<ApiResponse<PairingRequestDto[]>>(`${baseUrl}/v1/pairing/lobby`);
      return response.data.data;
    },
    refetchInterval: 5000, // Poll every 5s for new lobby requests
  });
};
