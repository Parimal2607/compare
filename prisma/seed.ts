import * as dotenv from "dotenv"
import * as path from "path"
dotenv.config()

import { PrismaClient } from "../src/generated/prisma/client"
import { PrismaLibSql } from "@prisma/adapter-libsql"

const dbPath = path.resolve(process.cwd(), "prisma/dev.db")
const dbUrl = `file:///${dbPath.replace(/\\/g, "/")}`

const adapter = new PrismaLibSql({ url: dbUrl })
const prisma = new PrismaClient({ adapter })

async function main() {
  const existingCategories = await prisma.category.findMany()
  if (existingCategories.length > 0) {
    console.log("Database already seeded, skipping.")
    return
  }

  const categories = [
    { id: "smartphones", name: "Smartphones", slug: "smartphones" },
    { id: "laptops", name: "Laptops", slug: "laptops" },
    { id: "gaming-consoles", name: "Gaming Consoles", slug: "gaming-consoles" },
  ]

  for (const cat of categories) {
    await prisma.category.create({ data: cat })
  }
  console.log("Seeded categories")

  const products = [
    {
      id: "iphone-17-pro-max",
      name: "iPhone 17 Pro Max",
      slug: "iphone-17-pro-max",
      image: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=600&q=80",
      heroImage: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=1200&q=80",
      description: "Apple's flagship smartphone with A19 Pro chip, titanium design, and advanced camera system.",
      price: "$1,199",
      rating: 4.7,
      categoryId: "smartphones",
      specs: JSON.stringify({
        Display: "6.9-inch Super Retina XDR OLED",
        Processor: "A19 Pro (3nm)",
        RAM: "8GB",
        Storage: "256GB / 512GB / 1TB",
        Battery: "4,685 mAh",
        Camera: "48MP Main + 48MP Ultra Wide + 12MP Telephoto",
        OS: "iOS 20",
        Weight: "227g",
      }),
      pros: JSON.stringify(["Best-in-class video recording", "Smooth iOS ecosystem", "Premium build quality", "Long software support"]),
      cons: JSON.stringify(["Very expensive", "No USB-C to 3.5mm adapter", "Slow charging (30W max)", "No expandable storage"]),
    },
    {
      id: "samsung-galaxy-s28",
      name: "Samsung Galaxy S28 Ultra",
      slug: "samsung-galaxy-s28",
      image: "https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=600&q=80",
      heroImage: "https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=1200&q=80",
      description: "Samsung's premium flagship with Snapdragon 9 Gen 4, S Pen support, and 200MP camera.",
      price: "$1,099",
      rating: 4.6,
      categoryId: "smartphones",
      specs: JSON.stringify({
        Display: "6.8-inch Dynamic AMOLED 2X",
        Processor: "Snapdragon 9 Gen 4 (3nm)",
        RAM: "12GB",
        Storage: "256GB / 512GB / 1TB",
        Battery: "5,500 mAh",
        Camera: "200MP Main + 50MP Ultra Wide + 12MP Telephoto + 10MP Periscope",
        OS: "Android 16 / One UI 8",
        Weight: "233g",
      }),
      pros: JSON.stringify(["Best zoom camera (10x optical)", "S Pen included", "Bigger battery & faster charging", "More RAM for same price"]),
      cons: JSON.stringify(["One UI can feel bloated", "Bulky and heavy", "Slower software updates", "Less resale value"]),
    },
    {
      id: "macbook-pro-m5",
      name: 'MacBook Pro 16" M5',
      slug: "macbook-pro-m5",
      image: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=600&q=80",
      heroImage: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=1200&q=80",
      description: "Apple's most powerful laptop with M5 Max chip, Liquid Retina XDR display, and all-day battery.",
      price: "$2,499",
      rating: 4.8,
      categoryId: "laptops",
      specs: JSON.stringify({
        Display: "16.2-inch Liquid Retina XDR",
        Processor: "M5 Max (3nm)",
        RAM: "36GB Unified",
        Storage: "512GB / 1TB / 2TB SSD",
        Battery: "Up to 22 hours",
        Weight: "2.14 kg",
        Ports: "3x Thunderbolt 5, HDMI, SDXC",
      }),
      pros: JSON.stringify(["Outstanding performance per watt", "Best-in-class display", "Excellent build quality", "Great battery life"]),
      cons: JSON.stringify(["Very expensive", "Limited gaming support", "No touchscreen", "Repair costs are high"]),
    },
    {
      id: "dell-xps-16",
      name: "Dell XPS 16 (2026)",
      slug: "dell-xps-16",
      image: "https://images.unsplash.com/photo-1593642632823-8f785ba67e45?w=600&q=80",
      heroImage: "https://images.unsplash.com/photo-1593642632823-8f785ba67e45?w=1200&q=80",
      description: "Dell's premium Windows laptop with Intel Core Ultra 9, OLED display, and sleek design.",
      price: "$2,199",
      rating: 4.5,
      categoryId: "laptops",
      specs: JSON.stringify({
        Display: "16.3-inch OLED 4K+",
        Processor: "Intel Core Ultra 9 285H",
        RAM: "32GB LPDDR5X",
        Storage: "1TB SSD",
        Battery: "Up to 15 hours",
        Weight: "1.8 kg",
        Ports: "2x Thunderbolt 4, USB-A, HDMI, 3.5mm",
      }),
      pros: JSON.stringify(["Beautiful OLED display", "More ports than MacBook", "Touchscreen option", "Windows compatibility"]),
      cons: JSON.stringify(["Battery life lags behind MacBook", "Can get hot under load", "Webcam placement", "Less resale value"]),
    },
    {
      id: "ps5-pro",
      name: "PlayStation 5 Pro",
      slug: "ps5-pro",
      image: "https://images.unsplash.com/photo-1606813907291-d86efa9b94db?w=600&q=80",
      heroImage: "https://images.unsplash.com/photo-1606813907291-d86efa9b94db?w=1200&q=80",
      description: "Sony's upgraded console with ray tracing, 8K support, and faster SSD for immersive gaming.",
      price: "$699",
      rating: 4.6,
      categoryId: "gaming-consoles",
      specs: JSON.stringify({
        CPU: "Custom AMD Zen 4 (8-core)",
        GPU: "Custom AMD RDNA 4 (16.7 TFLOPS)",
        RAM: "16GB GDDR6",
        Storage: "2TB NVMe SSD",
        Resolution: "Up to 8K",
        "Ray Tracing": "Yes (3rd gen)",
        "Disc Drive": "Ultra HD Blu-ray",
      }),
      pros: JSON.stringify(["Powerful hardware for the price", "Huge exclusive game library", "DualSense controller", "Fast SSD"]),
      cons: JSON.stringify(["Still no native 8K games", "Expensive games", "Limited backward compatibility", "Large size"]),
    },
    {
      id: "xbox-series-x-2",
      name: "Xbox Series X 2",
      slug: "xbox-series-x-2",
      image: "https://images.unsplash.com/photo-1621259182978-fbf93132d53d?w=600&q=80",
      heroImage: "https://images.unsplash.com/photo-1621259182978-fbf93132d53d?w=1200&q=80",
      description: "Microsoft's next-gen console with improved GPU, Quick Resume, and Game Pass integration.",
      price: "$649",
      rating: 4.5,
      categoryId: "gaming-consoles",
      specs: JSON.stringify({
        CPU: "Custom AMD Zen 5 (8-core)",
        GPU: "Custom AMD RDNA 4 (18.2 TFLOPS)",
        RAM: "20GB GDDR6",
        Storage: "2TB NVMe SSD",
        Resolution: "Up to 8K",
        "Ray Tracing": "Yes (3rd gen)",
        "Disc Drive": "Ultra HD Blu-ray",
      }),
      pros: JSON.stringify(["Game Pass best value in gaming", "Quick Resume feature", "More GPU power than PS5 Pro", "Backward compatibility"]),
      cons: JSON.stringify(["Fewer exclusives than PlayStation", "Controller lacks innovation", "UI can be slow", "Less popular in some regions"]),
    },
  ]

  for (const product of products) {
    await prisma.product.create({ data: product })
  }
  console.log("Seeded products")

  const comparisons = [
    {
      id: "iphone-vs-samsung",
      title: "iPhone 17 Pro Max vs Samsung Galaxy S28 Ultra",
      slug: "iphone-17-pro-max-vs-samsung-galaxy-s28-ultra",
      description: "Which flagship smartphone reigns supreme? A deep dive into Apple and Samsung's best.",
      categoryId: "smartphones",
      productAId: "iphone-17-pro-max",
      productBId: "samsung-galaxy-s28",
      summary: "Both phones are excellent, but they cater to different priorities. The iPhone 17 Pro Max excels in video recording, ecosystem, and long-term software support. The Galaxy S28 Ultra wins on camera versatility (especially zoom), battery life, and display customization.",
      verdict: "If you're deeply invested in the Apple ecosystem and prioritize video quality, go with the iPhone 17 Pro Max. If you want the best zoom camera, faster charging, and more RAM for your money, the Samsung Galaxy S28 Ultra is the better choice.",
      winnerIndex: 1,
      heroImage: "https://images.unsplash.com/photo-1468495244123-6c6c332eeece?w=1400&q=80",
      prosPerProductA: JSON.stringify(["Best-in-class video recording", "Smooth iOS ecosystem", "Premium build quality", "Long software support"]),
      consPerProductA: JSON.stringify(["Very expensive", "Slow charging (30W max)", "No expandable storage"]),
      prosPerProductB: JSON.stringify(["Best zoom camera (10x optical)", "S Pen included", "Bigger battery & faster charging", "More RAM for same price"]),
      consPerProductB: JSON.stringify(["One UI can feel bloated", "Bulky and heavy", "Less resale value"]),
    },
    {
      id: "macbook-vs-xps",
      title: "MacBook Pro M5 vs Dell XPS 16",
      slug: "macbook-pro-m5-vs-dell-xps-16",
      description: "The ultimate creator laptop showdown: Apple Silicon vs Intel Core Ultra.",
      categoryId: "laptops",
      productAId: "macbook-pro-m5",
      productBId: "dell-xps-16",
      summary: "The MacBook Pro M5 dominates in raw performance per watt, battery life, and display quality. The Dell XPS 16 fights back with a gorgeous OLED touchscreen, more port selection, and Windows flexibility.",
      verdict: "For creators and professionals who want the best battery life and performance, pick the MacBook Pro M5. If you need Windows, a touchscreen, or more ports, the Dell XPS 16 is your best bet.",
      winnerIndex: 0,
      heroImage: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=1400&q=80",
      prosPerProductA: JSON.stringify(["Outstanding performance per watt", "Best-in-class display", "Excellent build quality", "Great battery life"]),
      consPerProductA: JSON.stringify(["Very expensive", "Limited gaming support", "No touchscreen"]),
      prosPerProductB: JSON.stringify(["Beautiful OLED display", "More ports than MacBook", "Touchscreen option", "Windows compatibility"]),
      consPerProductB: JSON.stringify(["Battery life lags behind MacBook", "Can get hot under load", "Less resale value"]),
    },
    {
      id: "ps5-vs-xbox",
      title: "PlayStation 5 Pro vs Xbox Series X 2",
      slug: "ps5-pro-vs-xbox-series-x-2",
      description: "Next-gen console war: Sony's powerhouse vs Microsoft's Game Pass machine.",
      categoryId: "gaming-consoles",
      productAId: "ps5-pro",
      productBId: "xbox-series-x-2",
      summary: "The PS5 Pro offers incredible exclusives and a superior controller, while the Xbox Series X 2 has slightly more GPU power and the unbeatable value of Game Pass.",
      verdict: "Choose the PS5 Pro if exclusive games and the DualSense controller matter most. Choose the Xbox Series X 2 if you want Game Pass, more raw power, and better backward compatibility.",
      winnerIndex: 0,
      heroImage: "https://images.unsplash.com/photo-1493711662062-fa541adb3fc8?w=1400&q=80",
      prosPerProductA: JSON.stringify(["Powerful hardware for the price", "Huge exclusive game library", "DualSense controller", "Fast SSD"]),
      consPerProductA: JSON.stringify(["Still no native 8K games", "Expensive games", "Limited backward compatibility"]),
      prosPerProductB: JSON.stringify(["Game Pass best value in gaming", "Quick Resume feature", "More GPU power than PS5 Pro", "Backward compatibility"]),
      consPerProductB: JSON.stringify(["Fewer exclusives than PlayStation", "Controller lacks innovation", "Less popular in some regions"]),
    },
  ]

  for (const comparison of comparisons) {
    await prisma.comparison.create({ data: comparison })
  }
  console.log("Seeded comparisons")

  console.log("Database seeded successfully!")
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
