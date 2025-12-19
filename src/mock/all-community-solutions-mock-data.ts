import { AllChallengesResponse } from "@/types";

export const AllCommunitySolutionsMockData: AllChallengesResponse = {
  timestamp: "2025-10-31T19:39:08.801Z",
  status: 200,
  message: "Success",
  paginated: false,
  data: {
    community: [
      {
        author: {
          authorId: 50,
          name: "Legend",
          occupation: null,
          country: null,
          countryFlag: null,
          xp: 0,
          avatarUrl: null,
        },
        solutionInfo: {
          solutionId: 10,
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
          submittedAgo: "20 days ago",
        },
        votes: {
          clean: 0,
          bestPractices: 1,
          clever: 0,
          shortest: 0,
          efficient: 1,
          currentUserVote: null,
        },
        canDelete: false,
        canToggleVisibility: false,
        hidden: false,
      },
      {
        author: {
          authorId: 53,
          name: "New User",
          occupation: null,
          country: null,
          countryFlag: null,
          xp: 26,
          avatarUrl: null,
        },
        solutionInfo: {
          solutionId: 13,
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
          submittedAgo: "20 days ago",
        },
        votes: {
          clean: 0,
          bestPractices: 0,
          clever: 2,
          shortest: 0,
          efficient: 0,
          currentUserVote: null,
        },
        canDelete: false,
        canToggleVisibility: false,
        hidden: false,
      },
      {
        author: {
          authorId: 56,
          name: "Jawad Ahmed Turk",
          occupation: null,
          country: "Canada",
          countryFlag: null,
          xp: 0,
          avatarUrl: "/images/56/image.jpg",
        },
        solutionInfo: {
          solutionId: 24,
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
          submittedAgo: "8 days ago",
        },
        votes: {
          clean: 0,
          bestPractices: 0,
          clever: 0,
          shortest: 0,
          efficient: 1,
          currentUserVote: null,
        },
        canDelete: false,
        canToggleVisibility: false,
        hidden: false,
      },
    ],
    currentPage: 0,
    pageSize: 20,
    hasMore: false,
    generatedAt: "2025-10-31T19:39:08Z",
  },
};
