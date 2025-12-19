import { ChallengeDetailTypes } from "@/types";

export const ChallengeDetailMockData: ChallengeDetailTypes = {
  id: 6,
  slug: "migratory-dogs",
  title: "Migratory Dogs",
  languageImplementations: [
    {
      languageName: "python",
      languageId: 2,
      userProgress: "TODO",
      starterCode: "def migratory_birds(arr):\n\n",
    },
    {
      languageName: "java",
      languageId: 1,
      userProgress: "TODO",
      starterCode:
        "public class Solution{\n    public static int migratoryBirds(List<Integer> arr){\n\n    }\n}",
    },
    {
      languageName: "javascript",
      languageId: 3,
      userProgress: "TODO",
      starterCode:
        "function migratoryBirds(arr) {\n  \n}\n\nmodule.exports = migratoryBirds;",
    },
  ],
  difficulty: "EASY",
  xp: 5,
  estimatedSolveTime: "15 minutes",
  solvedCount: 2,
  summary: "This is Migratory birds challenge short summary",
  instructions:
    "## Migratory Birds\n\nYou are given an array of integers representing bird sightings, where each integer denotes a bird type ID.  \nYour task is to determine the ID of the bird type that occurs most frequently.  \nIf two or more types of birds are equally common, return the one with the smallest ID.\n\n---\n\n**Example 1:**\nInput: arr = [1, 1, 2, 2, 3]\nOutput: 1\nExplanation: Bird types 1 and 2 both appear twice, but 1 is the smaller ID.\n\n**Example 2:**\nInput: arr = [4, 4, 1, 4, 5, 3]\nOutput: 4\nExplanation: Bird type 4 appears 3 times, which is more frequent than any other type.\n\n\n**Example 3:**\nInput: arr = [5, 5, 5, 2, 2]\nOutput: 5\nExplanation: Bird type 5 appears 3 times, which is more than bird type 2.\n\n\n---\n\n**Constraints:**\n\n- 1 <= n <= 2 × 10⁵ (where n is the number of sightings)\n- Each bird type ID is between 1 and 5\n\n**Hints:**\n1. Use a frequency map (dictionary or hash map) to count the occurrences of each bird type.\n2. Track both the maximum frequency and the smallest ID when ties occur.\n\n---\n\n**Tags:**\n\n`Array` `Hash Map` `Frequency Counting`\n",

  tags: ["string", "array", "hashmap"],
  isActive: true,
};




