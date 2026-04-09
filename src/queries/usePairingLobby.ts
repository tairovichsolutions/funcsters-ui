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
      // Route through Next.js proxy (consistent with all other pairing endpoints)
      const response = await apiClient.get<ApiResponse<PairingRequestDto[]>>(`/api/pairing/lobby`);
      return response.data.data;
    },
    refetchInterval: 5000, // Poll every 5s for new lobby requests
  });
};

