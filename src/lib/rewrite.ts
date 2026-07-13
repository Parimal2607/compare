import type { Product } from "@/data/types"

const REWRITE_TEMPLATES = [
  (p: { name: string; category?: string; specs: Record<string, string>; price?: string }) =>
    `The ${p.name} is a${p.category ? ` ${p.category.toLowerCase()}` : ""} smartphone that combines ${p.specs["Chipset"] || "a capable processor"} with ${p.specs["Display"] || "a quality display"} for ${p.specs["RAM"] && p.specs["Storage"] ? `${p.specs["RAM"]} of RAM and ${p.specs["Storage"]} of storage` : "solid everyday performance"}.`,

  (p: { name: string; specs: Record<string, string> }) =>
    p.specs["Battery"]
      ? `With a ${p.specs["Battery"]} battery, the ${p.name} keeps going through a full day of use. The ${p.specs["Display"] || "display"} and ${p.specs["Chipset"] || "chipset"} work together to deliver a smooth experience for daily tasks and entertainment.`
      : "",

  (p: { name: string; specs: Record<string, string>; category?: string }) =>
    p.specs["Rear Camera"] || p.specs["Main Camera"]
      ? `Photography on the ${p.name} is handled by ${p.specs["Rear Camera"] || p.specs["Main Camera"]} camera setup, making it a solid choice for capturing everyday moments in good detail.`
      : "",

  (p: { name: string; specs: Record<string, string> }) =>
    p.specs["OS"] && p.specs["Release"]
      ? `Running ${p.specs["OS"]}${p.specs["Release"] ? ` and launched in ${p.specs["Release"]}` : ""}, the device brings modern software features to users who want a balanced smartphone experience.`
      : p.specs["OS"]
      ? `The device runs ${p.specs["OS"]}, providing access to the latest apps and features.`
      : "",

  (p: { name: string; price?: string }) =>
    `Positioned at ${p.price || "a competitive price point"}, the ${p.name} delivers strong value for its segment.`,
]

const PROS_REPHRASE_PATTERNS = [
  (s: string) => s.replace(/^(Excellent|Great|Good|Solid|Strong) /, "Notably "),
  (s: string) => s.replace(/^(Best|Top|Leading|Class-leading) /, "Well-regarded "),
  (s: string) => s.replace(/^(Impressive|Outstanding|Remarkable) /, "Commendable "),
  (s: string) => s,
]

const CONS_REPHRASE_PATTERNS = [
  (s: string) => s.replace(/^(Poor|Bad|Weak|Mediocre) /, "Below-average "),
  (s: string) => s.replace(/^(No|Lacks|Missing|Absent) /, "Does not offer "),
  (s: string) => s.replace(/^(Only|Limited|Restricted) /, "Somewhat "),
  (s: string) => s,
]

export function generateDescription(product: {
  name: string
  category?: string
  specs: Record<string, string>
  price?: string
}): string {
  const parts = REWRITE_TEMPLATES.map((t) => t(product as any)).filter(Boolean)
  if (parts.length === 0) {
    return `The ${product.name} is a smartphone designed for users who value a balanced mix of performance, design, and features in their daily driver.`
  }
  const desc = parts.slice(0, 3).join(" ")
  const category = product.category?.toLowerCase() || ""
  const isFlagship = category.includes("flagship") || category.includes("premium") || category.includes("tech")
  const isBudget = category.includes("budget") || category.includes("affordable")
  const suffix = isFlagship
    ? " It is aimed at users who want premium features and performance without compromise."
    : isBudget
    ? " It is a practical choice for budget-conscious buyers who still want a capable smartphone."
    : " It strikes a solid balance between features and value for everyday use."
  return desc + suffix
}

export function rephrasePros(pros: string[]): string[] {
  return pros.map((pro) => {
    for (const pattern of PROS_REPHRASE_PATTERNS) {
      const rephrased = pattern(pro)
      if (rephrased !== pro) return rephrased
    }
    // Always apply slight rephrase for uniqueness
    if (pro.length > 5 && !pro.endsWith(".")) return pro + "."
    if (pro.startsWith("The ")) return "This " + pro.slice(4)
    return pro
  })
}

export function rephraseCons(cons: string[]): string[] {
  return cons.map((con) => {
    for (const pattern of CONS_REPHRASE_PATTERNS) {
      const rephrased = pattern(con)
      if (rephrased !== con) return rephrased
    }
    if (con.length > 5 && !con.endsWith(".")) return con + "."
    if (con.startsWith("A ")) return con
    return con
  })
}
