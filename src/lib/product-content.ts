import type { Product } from "@/data/types"

const highlights = [
  {
    match: (s: Record<string, string>) => s["Chipset"] || s["Chipset"] || "",
    label: (v: string) => `Powered by the ${v.split(" ").slice(0, 2).join(" ")} chipset delivering flagship-level performance for gaming and multitasking.`,
  },
  {
    match: (s: Record<string, string>) => s["Display"] || "",
    label: (v: string) => {
      const hz = v.match(/(\d+)Hz/)
      return hz
        ? `Features a ${hz[0]} refresh rate display for buttery-smooth scrolling and animations.`
        : `High-quality display with vivid colors and deep contrast for an immersive viewing experience.`
    },
  },
  {
    match: (s: Record<string, string>) => s["Rear Camera"] || s["Camera"] || "",
    label: (v: string) => {
      const mp = v.match(/(\d+)\s*MP/)
      return mp
        ? `Equipped with a ${mp[0]} rear camera setup that captures detailed photos in various lighting conditions.`
        : `Versatile camera system for capturing everyday moments in good quality.`
    },
  },
  {
    match: (s: Record<string, string>) => s["Battery"] || s["Charging"] || "",
    label: (v: string) => {
      const w = v.match(/(\d+)W/)
      return w
        ? `Supports ${w[0]} fast charging so you can get back to full power quickly.`
        : `All-day battery life to keep you connected without frequent charging.`
    },
  },
  {
    match: (s: Record<string, string>) => s["RAM"] || "",
    label: (v: string) => `${v} of RAM ensures smooth multitasking and app switching.`,
  },
  {
    match: (s: Record<string, string>) => s["Storage"] || "",
    label: (v: string) => `${v} of internal storage provides ample space for apps, photos, and media.`,
  },
]

export function generateHighlights(specs: Record<string, string>) {
  const result: string[] = []
  for (const h of highlights) {
    const val = h.match(specs)
    if (val) {
      result.push(h.label(val))
      if (result.length >= 4) break
    }
  }
  return result
}

export function generateVerdict(product: Product) {
  const proCount = product.pros.length
  const conCount = product.cons.length
  const rating = product.rating || 3
  const price = parseFloat(product.price.replace(/[^0-9.]/g, "")) || 0

  const isGood = proCount > conCount && rating >= 3.5
  const isGreat = proCount >= conCount + 2 && rating >= 4
  const isExpensive = price > 800
  const isBudget = price < 300

  if (isGreat && !isExpensive) {
    return `The ${product.name} offers exceptional value with its impressive feature set at a competitive price point. With ${proCount} notable advantages outweighing ${conCount} minor drawbacks, it stands out as one of the best options in its segment.`
  }
  if (isGreat && isExpensive) {
    return `The ${product.name} is a premium device that delivers top-tier performance and features. The higher price is justified by its flagship-grade specifications and build quality, making it a solid investment for those who want the best.`
  }
  if (isGood && isBudget) {
    return `For budget-conscious buyers, the ${product.name} punches above its weight class. It covers all the essentials with ${proCount} key strengths, and the few compromises (${conCount} cons) are reasonable given the affordable price.`
  }
  if (isGood) {
    return `The ${product.name} strikes a solid balance between features and value. It excels in several areas with ${proCount} clear advantages, while the ${conCount} drawbacks are manageable trade-offs for most users. A reliable choice in its category.`
  }
  if (proCount >= conCount) {
    return `The ${product.name} is a capable device that handles everyday tasks well. It offers a decent set of features with ${proCount} positives, though there are ${conCount} areas where it falls short of expectations. Worth considering if the price is right.`
  }
  return `The ${product.name} has some compelling features but also notable shortcomings. With ${proCount} advantages and ${conCount} drawbacks, it's best suited for users who prioritize its strengths and can accept its limitations.`
}

export function generateWhoShouldBuy(product: Product) {
  const name = product.name
  const price = parseFloat(product.price.replace(/[^0-9.]/g, "")) || 0
  const specs = product.specs
  const chipset = (specs["Chipset"] || "").toLowerCase()
  const camera = (specs["Rear Camera"] || specs["Camera"] || "").toLowerCase()
  const display = (specs["Display"] || "").toLowerCase()

  const isGaming = chipset.includes("gaming") || chipset.includes("snapdragon") || chipset.includes("dimensity") || chipset.includes("immortalis")
  const isCamera = camera.includes("mp") && !camera.includes("2mp") && !camera.includes("0.3")
  const hasHighRefresh = display.includes("120hz") || display.includes("144hz") || display.includes("165hz")

  const profiles: string[] = []

  if (isGaming && hasHighRefresh) {
    profiles.push(`Mobile gamers who want smooth performance and a high-refresh-rate display for an edge in competitive titles.`)
  }
  if (isCamera) {
    profiles.push(`Photography enthusiasts looking for a capable camera system to capture detailed photos and videos.`)
  }
  if (price > 600) {
    profiles.push(`Professionals and power users who need a reliable daily driver with premium build quality and strong performance.`)
  }
  if (price <= 600 && price > 200) {
    profiles.push(`Everyday users seeking a well-rounded smartphone that handles social media, streaming, and communication without breaking the bank.`)
  }
  if (price <= 200) {
    profiles.push(`Budget-minded buyers who want essential smartphone features at an accessible price point.`)
  }

  if (profiles.length === 0) {
    profiles.push(`Anyone looking for a reliable smartphone that covers the basics well.`)
  }

  return profiles
}

export function generateFaq(product: Product) {
  const specs = product.specs
  const name = product.name
  const battery = specs["Battery"] || specs["Charging"] || ""
  const chipset = specs["Chipset"] || ""
  const display = specs["Display"] || ""
  const ram = specs["RAM"] || ""
  const storage = specs["Storage"] || ""

  const faq: { q: string; a: string }[] = []

  if (chipset) {
    faq.push({
      q: `What processor does the ${name} use?`,
      a: `The ${name} is powered by the ${chipset}, which delivers capable performance for everyday tasks, multitasking, and moderate gaming.`,
    })
  }

  if (display) {
    const size = display.match(/(\d+\.?\d*)\s*inches/)
    faq.push({
      q: `What is the display size and quality on the ${name}?`,
      a: `It features a ${size ? size[0] + " " : ""}display with ${display.includes("AMOLED") ? "vibrant AMOLED colors and deep blacks" : "good color reproduction and viewing angles"} for an enjoyable viewing experience.`,
    })
  }

  if (battery) {
    faq.push({
      q: `How is the battery life on the ${name}?`,
      a: `The device offers ${battery.includes("mAh") ? battery.match(/\d+\s*mAh/)?.[0] || "solid" : "solid"} battery life. ${battery.includes("W") ? `It supports fast charging at ${battery.match(/\d+W/)?.[0] || "various rates"} for quick top-ups.` : "Charging speeds are adequate for daily use."}`,
    })
  }

  if (ram && storage) {
    faq.push({
      q: `How much RAM and storage does the ${name} have?`,
      a: `It comes with ${ram} of RAM and ${storage} of internal storage${storage.includes("GB") && parseInt(storage) >= 128 ? ", providing ample space for apps and media." : ", which should suffice for basic needs."}`,
    })
  }

  const camSpec = specs["Rear Camera"] || specs["Camera"] || ""
  if (camSpec) {
    faq.push({
      q: `Is the ${name} good for photography?`,
      a: `The ${name} features a ${camSpec.includes("MP") ? camSpec.match(/\d+\s*MP/g)?.join(", ") || "capable" : "capable"} camera setup. ${camSpec.includes("OIS") ? "Optical image stabilization helps reduce blur in low-light conditions." : "It handles well-lit scenes with good detail and color reproduction."}`,
    })
  }

  return faq
}

export function generateBuyingGuides(category: string, price: number): string[] {
  const guides: string[] = []
  if (category.toLowerCase().includes("oneplus") || category.toLowerCase().includes("samsung") || category.toLowerCase().includes("google") || category.toLowerCase().includes("motorola") || category.toLowerCase().includes("xiaomi") || category.toLowerCase().includes("iqoo") || category.toLowerCase().includes("apple")) {
    if (price > 700) {
      guides.push("High-end smartphones in this range offer premium build materials, flagship processors, and the best camera systems available.")
      guides.push("Consider the ecosystem benefits — if you already use other devices from the same brand, the integration may enhance your experience.")
    } else if (price > 300) {
      guides.push("Mid-range smartphones have closed the gap with flagships significantly. You get 90-95% of the flagship experience at 50-60% of the price.")
      guides.push("Prioritize what matters most to you — display quality, camera performance, or battery life — since mid-range devices often excel in some areas while compromising in others.")
    } else {
      guides.push("Budget smartphones have improved dramatically. Look for a reliable processor and decent battery life as your top priorities.")
      guides.push("Don't overlook brand software support — some budget phones receive updates more consistently than others, which affects long-term value.")
    }
  }
  return guides
}
