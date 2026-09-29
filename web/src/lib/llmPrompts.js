/**
 * High-ROI prompt ideas for turning a downloaded report into something an
 * LLM can simplify or act on. Kept as data so the same list can be rendered
 * in the app UI and referenced from docs.
 */
export const LLM_PROMPTS = [
  {
    title: "Simplify it",
    prompt:
      "Read this genetic health report and rewrite it in plain English. Group findings into three buckets: “no action needed,” “worth discussing with my doctor,” and “safe to act on now.” Skip repeating the disclaimers — I've already read them.",
  },
  {
    title: "30-day action plan",
    prompt:
      "Based on this report, build a prioritized 30-day action plan. Pick the 3-5 changes (supplements, diet, exercise, monitoring) that will have the biggest impact, order them by how soon I should start each one, and explain why each one made the cut.",
  },
  {
    title: "Doctor visit prep",
    prompt:
      "I'm bringing this report to my next doctor's appointment. Turn it into a short list of specific questions to ask and tests to request, ordered by how urgent each one is.",
  },
  {
    title: "One-week meal plan",
    prompt:
      "Turn the dietary recommendations in this report into a realistic one-week meal plan with a grocery list, sized for one person.",
  },
  {
    title: "Supplement safety check",
    prompt:
      "List every supplement this report recommends, with dose and reason. Flag any that commonly interact with each other or with common medications, so I know exactly what to double-check with a pharmacist.",
  },
  {
    title: "Explain the science",
    prompt:
      "Pick the 3 highest-impact findings in this report and explain the underlying biology for each one like I'm smart but have no medical background.",
  },
];
