const map: Record<string, string> = {
  EdTech: "cat-edtech",
  HealthTech: "cat-healthtech",
  CleanTech: "cat-cleantech",
  DevTools: "cat-devtools",
  FinTech: "cat-fintech",
  Logistics: "cat-logistics",
  RetailTech: "cat-retailtech",
  "AI/ML": "cat-ai",
  SaaS: "cat-saas",
};

export function catClass(category: string) {
  return map[category] ?? "cat-default";
}
