import { MyChallengeResponse } from "@/types";

export const MyCommunitySolutionsMockData: MyChallengeResponse = {
  timestamp: "2025-10-31T19:29:00.499Z",
  status: 200,
  message: "Success",
  paginated: false,
  data: {
    author: {
      authorId: 48,
      name: "jawad",
      occupation: null,
      country: null,
      countryFlag: null,
      xp: 0,
      avatarUrl: null,
    },
    solutionInfo: {
      solutionId: 25,
      language: "java",
      code: `import java.util.HashMap;
import java.util.List;
import java.util.Map;

public class Solution {
    public static int migratoryBirds(List<Integer> arr) {
        Map<Integer, Integer> map = new HashMap<>();
        for (int n : arr) {
            map.put(n, map.getOrDefault(n, 0) + 1);
        }
        int max = 0, best = Integer.MAX_VALUE;
        for (int k : map.keySet()) {
            int freq = map.get(k);
            if (freq > max || (freq == max && k < best)) {
                max = freq;
                best = k;
            }
        }
        return best;
    }
}`,
      runtimeMs: 0,
      memoryKb: 0,
      submittedAgo: "20 seconds ago",
    },
    votes: {
      clean: 0,
      bestPractices: 0,
      clever: 0,
      shortest: 0,
      efficient: 0,
      currentUserVote: null,
    },
    canDelete: true,
    canToggleVisibility: true,
    hidden: false,
  },
};
