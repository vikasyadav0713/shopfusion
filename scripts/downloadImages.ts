import axios from "axios";
import fs from "fs";
import path from "path";

const IMAGE_DIR = path.join(process.cwd(), "public", "products");
const IMAGE_WIDTH = 400;
const IMAGE_HEIGHT = 300;
const DELAY_MS = 200;

const products = [
  { name: "Cello Wonder Storage Box 3-Piece", category: "Home" },
  { name: "HealthSense Smart Scale LS-175", category: "Fitness" },
  { name: "Noise ColorFit Ultra 3", category: "Electronics" },
  { name: "Nike Air Max 270", category: "Fashion" },
  { name: "Hidesign Roma Leather Tote", category: "Fashion" },
  { name: "Bata Comfit Leather Loafers", category: "Fashion" },
  { name: "Louis Philippe Formal Trousers", category: "Fashion" },
  { name: "Godrej Interio Study Table", category: "Home" },
  { name: "Elica 60cm Chimney Hood", category: "Home" },
  { name: "Solimo Bamboo Laundry Hamper", category: "Home" },
  { name: "Adidas Predator Edge Gloves", category: "Fitness" },
  { name: "Instafit Wooden Kettlebell 16kg", category: "Fitness" },
  { name: "Sapiens – Yuval Noah Harari", category: "Books" },
  { name: "Onida 32-inch HD Smart TV", category: "Electronics" },
  { name: "SoundPeak ANC Pro 700", category: "Electronics" },
  { name: "Lenovo IdeaPad Slim 5", category: "Electronics" },
  { name: "Samsung Galaxy Buds3 Pro", category: "Electronics" },
  { name: "Zebronics Zeb-Pixashot 4K", category: "Electronics" },
  { name: "Mi Smart Band 8 Pro", category: "Electronics" },
  { name: "Apple iPad Air M2", category: "Electronics" },
  { name: "Syska Smart LED Strip 5m", category: "Electronics" },
  { name: "Anker PowerCore 26800mAh", category: "Electronics" },
  { name: "Logitech MX Master 3S", category: "Electronics" },
  { name: "Realme Narzo 70 Pro", category: "Electronics" },
  { name: "Portronics Kronos Y2 Speaker", category: "Electronics" },
  { name: "TP-Link Archer AX73 Router", category: "Electronics" },
  { name: "Canon EOS R50 Mirrorless", category: "Electronics" },
  { name: "Havells Krone 5-in-1 AC", category: "Electronics" },
  { name: "Godrej 564L French Door Refrigerator", category: "Electronics" },
  { name: "Corsair K70 RGB Pro Keyboard", category: "Electronics" },
  { name: "Sony Bravia 55-inch 4K OLED", category: "Electronics" },
  { name: "Dyson V15 Detect Vacuum", category: "Electronics" },
  { name: "Puma Softride Premier Slip-On", category: "Fashion" },
  { name: "Roadster Cargo Joggers", category: "Fashion" },
  { name: "Fabindia Kurta Set for Men", category: "Fashion" },
  { name: "Mango Satin Slip Skirt", category: "Fashion" },
  { name: "W Women's Embroidered Kurta", category: "Fashion" },
  { name: "Ray-Ban Aviator Classic", category: "Fashion" },
  { name: "Crocs Classic Clog Sandal", category: "Fashion" },
  { name: "Pepe Jeans Denim Jacket", category: "Fashion" },
  { name: "IKEA KALLAX Shelf Unit", category: "Home" },
  { name: "Prestige Svachh Deep Kadai", category: "Home" },
  { name: "Nilkamal Easy Chair Recliner", category: "Home" },
  { name: "Bombay Dyeing Floral Bedsheet Set", category: "Home" },
  { name: "Wonderchef Nutri-Blend Pro", category: "Home" },
  { name: "Home Centre Cosmo Sofa 3-Seater", category: "Home" },
  { name: "Hafele Mortise Door Lock", category: "Home" },
  { name: "Levi's 511 Slim Fit Jeans", category: "Fashion" },
  { name: "Adidas Ultraboost 22", category: "Fashion" },
  { name: "Jockey Ultra Soft Innerwear Set", category: "Fashion" },
  { name: "Philips Air Purifier 2000i", category: "Home" },
  { name: "Orient Electric Wall Fan Hector", category: "Home" },
  { name: "Allen Solly Formal Blazer", category: "Fashion" },
  { name: "Fossil Gen 6 Hybrid Watch", category: "Fashion" },
  { name: "H&M Oversized Linen Shirt", category: "Fashion" },
  { name: "Zara Floral Midi Dress", category: "Fashion" },
  { name: "Tommy Hilfiger Polo T-Shirt", category: "Fashion" },
  { name: "Pigeon Handy Chopper Plus", category: "Home" },
  { name: "Pepperfry Ceramic Planter Set", category: "Home" },
  { name: "Decathlon Domyos Yoga Mat 6mm", category: "Fitness" },
  { name: "Boldfit Resistance Band Set", category: "Fitness" },
  { name: "Cosco Ab Wheel Roller Pro", category: "Fitness" },
  { name: "Kore Pro Adjustable Dumbbells 20kg", category: "Fitness" },
  { name: "Fitbit Charge 6", category: "Fitness" },
  { name: "Nivia Pro Knitted Football", category: "Fitness" },
  { name: "GNC Whey Protein Gold 2kg", category: "Fitness" },
  { name: "Yonex Astrox 22F Badminton Racket", category: "Fitness" },
  { name: "Strauss Pull-Up Doorway Bar", category: "Fitness" },
  { name: "Decathlon Kipsta Knee Guard", category: "Fitness" },
  { name: "MuscleBlaze Creatine Monohydrate 250g", category: "Fitness" },
  { name: "Cosco Olympic Barbell Set 50kg", category: "Fitness" },
  { name: "Atomic Habits – James Clear", category: "Books" },
  { name: "The Psychology of Money – Morgan Housel", category: "Books" },
  { name: "TTK Prestige Electric Kettle Evo", category: "Home" },
  { name: "Durafit Elliptical Cross Trainer", category: "Fitness" },
  { name: "Lifelong LLM79 Treadmill", category: "Fitness" },
  { name: "Burnlab Jump Rope Pro", category: "Fitness" },
  { name: "HealthSense Pulse Oximeter", category: "Fitness" },
  { name: "Wakefit Orthopaedic Memory Foam Mattress", category: "Home" },
  { name: "Hindware Activa Shower Set", category: "Home" },
  { name: "Borosil Vision Glass Set of 6", category: "Home" },
  { name: "Sportneer Foam Roller Deep Tissue", category: "Fitness" },
  { name: "Orient Areva BLDC Ceiling Fan", category: "Home" },
  { name: "Dune – Frank Herbert", category: "Books" },
  { name: "Can't Hurt Me – David Goggins", category: "Books" },
  { name: "The Midnight Library – Matt Haig", category: "Books" },
  { name: "Zero to One – Peter Thiel", category: "Books" },
  { name: "The Silent Patient – Alex Michaelides", category: "Books" },
  { name: "Ikigai – Hector Garcia", category: "Books" },
  { name: "Educated – Tara Westover", category: "Books" },
  { name: "The Art of War – Sun Tzu", category: "Books" },
  { name: "Mein Kampf – Historical Reference Edition", category: "Books" },
  { name: "Good to Great – Jim Collins", category: "Books" },
  { name: "The Alchemist – Paulo Coelho", category: "Books" },
  { name: "Deep Work – Cal Newport", category: "Books" },
  { name: "Rich Dad Poor Dad – Robert Kiyosaki", category: "Books" },
  { name: "The Lean Startup – Eric Ries", category: "Books" },
  { name: "Thinking, Fast and Slow – Kahneman", category: "Books" },
  { name: "Steve Jobs – Walter Isaacson", category: "Books" },
  { name: "To Kill a Mockingbird – Harper Lee", category: "Books" },
];

function extractKeyword(name: string, category: string): string {
  const cleaned = name
    .split(/\s*[–—]\s*/)[0]
    .replace(/\(.*?\)/g, "")
    .trim();

  if (category === "Books") {
    return `${cleaned} book cover`;
  }

  if (/macbook|laptop|notebook/i.test(cleaned)) {
    return "macbook laptop";
  }

  return cleaned;
}

function buildImageUrl(keyword: string): string {
  const encoded = encodeURIComponent(keyword.replace(/\s+/g, ","));
  return `https://loremflickr.com/${IMAGE_WIDTH}/${IMAGE_HEIGHT}/${encoded}`;
}

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function downloadImage(url: string, filename: string): Promise<boolean> {
  try {
    const response = await axios.get<ArrayBuffer>(url, {
      responseType: "arraybuffer",
      timeout: 15000,
      maxRedirects: 3,
      headers: {
        "User-Agent": "Mozilla/5.0 (compatible; ShopFusionImageBot/1.0)",
      },
    });

    const contentType = String(response.headers["content-type"] ?? "");
    if (!contentType.startsWith("image/")) {
      throw new Error(`Non-image response: ${contentType}`);
    }

    fs.writeFileSync(filename, Buffer.from(response.data));
    return true;
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error(`Failed: ${message}`);
    return false;
  }
}

async function main() {
  console.log("Working directory:", process.cwd());
  console.log("Image output dir:", IMAGE_DIR);

  if (!fs.existsSync(IMAGE_DIR)) {
    fs.mkdirSync(IMAGE_DIR, { recursive: true });
  }

  for (let index = 0; index < products.length; index += 1) {
    const product = products[index];
    const keyword = extractKeyword(product.name, product.category);
    const fileName = `product-${index}.jpg`;
    const filePath = path.join(IMAGE_DIR, fileName);

    if (fs.existsSync(filePath)) {
      console.log(`Skipped (exists): ${product.name} → ${keyword}`);
      continue;
    }

    const imageUrl = buildImageUrl(keyword);
    const success = await downloadImage(imageUrl, filePath);

    if (success) {
      console.log(`Downloaded: ${product.name} → ${keyword}`);
    }

    await delay(DELAY_MS);
  }

  console.log("All images processed ✅");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
