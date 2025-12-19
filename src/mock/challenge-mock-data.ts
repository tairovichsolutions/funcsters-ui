import { ChallengesTypes } from "@/types";

export const ChallengeMockData: ChallengesTypes[] = [
  {
    id: 1,
    title: "Introduction to Arrays",
    summary:
      "Learn the basics of arrays, including declaration, initialization, and iteration in various languages.",
    difficulty: "EASY",
    userProgress: "TODO",
    tags: ["Array", "Basics"],
  },
  {
    id: 2,
    title: "Sorting Algorithms",
    summary:
      "Understand and implement popular sorting algorithms like Bubble Sort, Merge Sort, and Quick Sort.",
    difficulty: "MEDIUM",
    userProgress: "IN_PROGRESS",
    tags: [ "Algorithms", "Intermediate"],
  },
  {
    id: 3,
    title: "Graph Traversal Techniques",
    summary:
      "Explore DFS and BFS algorithms and how they are applied to real-world graph problems.",
    difficulty: "HARD",
    userProgress: "COMPLETED",
    tags: ["Graph", "DFS", "Advanced"],
  },
  {
    id: 4,
    title: "Dynamic Programming Challenges",
    summary:
      "Master dynamic programming concepts through classic problems and optimization strategies.",
    difficulty: "EXPERT",
    userProgress: "TODO",
    tags: ["DP", "Optimization", "Expert"],
  },
];
