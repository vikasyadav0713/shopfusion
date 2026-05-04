import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const products = [
  [
  { name: "SoundPeak ANC Pro 700", price: 18999, description: "Industry-leading active noise cancellation with 30-hour battery life and premium leather ear cushions.", image: "https://source.unsplash.com/400x300/?headphones", stock: 32, category: "Electronics" },
  { name: "Lenovo IdeaPad Slim 5", price: 47999, description: "Ultra-thin laptop with Intel Core i5, 16GB RAM, and a stunning 14-inch FHD display for professionals on the go.", image: "https://source.unsplash.com/400x300/?laptop", stock: 18, category: "Electronics" },
  { name: "Samsung Galaxy Buds3 Pro", price: 13999, description: "Ergonomic true wireless earbuds with adaptive EQ and seamless Galaxy device integration.", image: "https://source.unsplash.com/400x300/?earbuds", stock: 55, category: "Electronics" },
  { name: "Zebronics Zeb-Pixashot 4K", price: 6499, description: "Compact 4K action camera with waterproof casing and 170-degree wide-angle lens.", image: "https://source.unsplash.com/400x300/?action+camera", stock: 20, category: "Electronics" },
  { name: "Mi Smart Band 8 Pro", price: 3999, description: "Advanced fitness band with SpO2 monitoring, 1.74-inch AMOLED display, and 14-day battery.", image: "https://source.unsplash.com/400x300/?smartband", stock: 70, category: "Electronics" },
  { name: "Apple iPad Air M2", price: 49999, description: "Powerful M2 chip meets the versatility of iPad Air — perfect for creative professionals and students.", image: "https://source.unsplash.com/400x300/?ipad", stock: 14, category: "Electronics" },
  { name: "Logitech MX Master 3S", price: 8999, description: "Precision wireless mouse with MagSpeed scroll wheel and ergonomic design for all-day productivity.", image: "https://source.unsplash.com/400x300/?computer+mouse", stock: 40, category: "Electronics" },
  { name: "Realme Narzo 70 Pro", price: 17999, description: "Segment-leading AMOLED display with 67W SuperVOOC charging and a 50MP Sony AI camera.", image: "https://source.unsplash.com/400x300/?smartphone", stock: 33, category: "Electronics" },
  { name: "Portronics Kronos Y2 Speaker", price: 2499, description: "360-degree surround sound Bluetooth speaker with RGB lighting and 10-hour playtime.", image: "https://source.unsplash.com/400x300/?bluetooth+speaker", stock: 60, category: "Electronics" },
  { name: "TP-Link Archer AX73 Router", price: 9999, description: "Wi-Fi 6 router with 5400Mbps speeds, OFDMA technology, and coverage for large homes.", image: "https://source.unsplash.com/400x300/?wifi+router", stock: 22, category: "Electronics" },
  { name: "Canon EOS R50 Mirrorless", price: 46999, description: "Compact mirrorless camera with 24.2MP sensor and 4K video, perfect for content creators.", image: "https://source.unsplash.com/400x300/?mirrorless+camera", stock: 9, category: "Electronics" },
  { name: "Havells Krone 5-in-1 AC", price: 39999, description: "Smart inverter AC with 5-star rating, PM 2.5 filter, and Wi-Fi connectivity via app control.", image: "https://source.unsplash.com/400x300/?air+conditioner", stock: 11, category: "Electronics" },
  { name: "Syska Smart LED Strip 5m", price: 1299, description: "Wi-Fi enabled RGB LED strip with 16 million color options and voice assistant compatibility.", image: "https://source.unsplash.com/400x300/?led+strip", stock: 85, category: "Electronics" },
  { name: "Corsair K70 RGB Pro Keyboard", price: 12999, description: "Mechanical gaming keyboard with Cherry MX switches and per-key RGB backlighting for esports precision.", image: "https://source.unsplash.com/400x300/?mechanical+keyboard", stock: 27, category: "Electronics" },
  { name: "Anker PowerCore 26800mAh", price: 3799, description: "High-capacity power bank with triple USB ports and 65W PD fast charging for laptops and phones.", image: "https://source.unsplash.com/400x300/?power+bank", stock: 50, category: "Electronics" },
  { name: "Sony Bravia 55-inch 4K OLED", price: 49999, description: "Cinematic OLED TV with Acoustic Surface Audio and Google TV for an immersive home theatre experience.", image: "https://source.unsplash.com/400x300/?smart+tv", stock: 7, category: "Electronics" },
  { name: "Godrej 564L French Door Refrigerator", price: 44999, description: "Premium French door fridge with InverterPro technology and dual-zone cooling for freshness.", image: "https://source.unsplash.com/400x300/?refrigerator", stock: 8, category: "Electronics" },
  { name: "Dyson V15 Detect Vacuum", price: 45999, description: "Laser-guided cordless vacuum that detects microscopic dust and auto-adjusts suction accordingly.", image: "https://source.unsplash.com/400x300/?vacuum+cleaner", stock: 12, category: "Electronics" },
  { name: "Onida 32-inch HD Smart TV", price: 10999, description: "Budget-friendly HD TV with Android OS, built-in Chromecast, and Dolby Audio for everyday viewing.", image: "https://source.unsplash.com/400x300/?television", stock: 30, category: "Electronics" },
  { name: "Noise ColorFit Ultra 3", price: 4499, description: "Smartwatch with 1.96-inch AMOLED display, BT calling, and 100+ sports modes for active users.", image: "https://source.unsplash.com/400x300/?smartwatch", stock: 65, category: "Electronics" },

  { name: "Levi's 511 Slim Fit Jeans", price: 3499, description: "Classic slim-fit denim with a tapered leg and stretch comfort fabric for all-day wear.", image: "https://source.unsplash.com/400x300/?jeans", stock: 80, category: "Fashion" },
  { name: "Allen Solly Formal Blazer", price: 5999, description: "Tailored single-breasted blazer in premium wool blend, perfect for boardroom confidence.", image: "https://source.unsplash.com/400x300/?blazer", stock: 35, category: "Fashion" },
  { name: "Nike Air Max 270", price: 11999, description: "Iconic lifestyle sneakers with a full-length Air unit and breathable mesh upper for all-day comfort.", image: "https://source.unsplash.com/400x300/?sneakers", stock: 45, category: "Fashion" },
  { name: "Fossil Gen 6 Hybrid Watch", price: 14999, description: "Analog-digital hybrid smartwatch with wellness tracking hidden beneath a timeless dial.", image: "https://source.unsplash.com/400x300/?watch", stock: 25, category: "Fashion" },
  { name: "H&M Oversized Linen Shirt", price: 1799, description: "Relaxed-fit linen shirt in earthy tones, ideal for summer brunches and weekend outings.", image: "https://source.unsplash.com/400x300/?linen+shirt", stock: 90, category: "Fashion" },
  { name: "Zara Floral Midi Dress", price: 4299, description: "Elegant midi dress with floral print and a tiered skirt, effortlessly transitioning from day to evening.", image: "https://source.unsplash.com/400x300/?midi+dress", stock: 55, category: "Fashion" },
  { name: "Puma Softride Premier Slip-On", price: 3999, description: "Laceless athletic shoes with SoftFoam+ insole technology for superior cushioning and easy wear.", image: "https://source.unsplash.com/400x300/?running+shoes", stock: 60, category: "Fashion" },
  { name: "Hidesign Roma Leather Tote", price: 8999, description: "Hand-stitched full-grain leather tote with ample compartments — crafted for the modern professional woman.", image: "https://source.unsplash.com/400x300/?leather+bag", stock: 20, category: "Fashion" },
  { name: "Roadster Cargo Joggers", price: 1499, description: "Utility-inspired joggers with multiple pockets and elastic cuffs for a street-ready look.", image: "https://source.unsplash.com/400x300/?joggers", stock: 75, category: "Fashion" },
  { name: "Fabindia Kurta Set for Men", price: 2599, description: "Handcrafted cotton kurta with subtle block print — a refined take on Indian ethnic wear.", image: "https://source.unsplash.com/400x300/?kurta", stock: 40, category: "Fashion" },
  { name: "Adidas Ultraboost 22", price: 14999, description: "Premium running shoes with Boost midsole technology that returns energy with every stride.", image: "https://source.unsplash.com/400x300/?adidas+shoes", stock: 28, category: "Fashion" },
  { name: "Mango Satin Slip Skirt", price: 3299, description: "Luxe satin skirt with a bias cut and elastic waistband — chic enough for date night or the office.", image: "https://source.unsplash.com/400x300/?skirt", stock: 50, category: "Fashion" },
  { name: "Tommy Hilfiger Polo T-Shirt", price: 2999, description: "Classic pique polo in a regular fit with signature Tommy branding on the chest.", image: "https://source.unsplash.com/400x300/?polo+shirt", stock: 65, category: "Fashion" },
  { name: "Bata Comfit Leather Loafers", price: 2299, description: "Slip-on leather loafers with memory foam footbed and anti-skid sole for all-day comfort.", image: "https://source.unsplash.com/400x300/?loafers", stock: 42, category: "Fashion" },
  { name: "W Women's Embroidered Kurta", price: 1899, description: "Soft cotton kurta with floral embroidery at the hem — perfect for festive casual occasions.", image: "https://source.unsplash.com/400x300/?women+kurta", stock: 55, category: "Fashion" },
  { name: "Ray-Ban Aviator Classic", price: 7999, description: "Timeless gold-frame aviator sunglasses with crystal green G-15 lenses and UV protection.", image: "https://source.unsplash.com/400x300/?sunglasses", stock: 30, category: "Fashion" },
  { name: "Jockey Ultra Soft Innerwear Set", price: 899, description: "Premium combed cotton innerwear with tagless design and stretchable waistband for everyday ease.", image: "https://source.unsplash.com/400x300/?innerwear", stock: 100, category: "Fashion" },
  { name: "Crocs Classic Clog Sandal", price: 2999, description: "Iconic ventilated clog in Croslite foam with customizable Jibbitz charm ports for playful style.", image: "https://source.unsplash.com/400x300/?sandals", stock: 70, category: "Fashion" },
  { name: "Louis Philippe Formal Trousers", price: 2799, description: "Flat-front formal trousers in wrinkle-resistant fabric with a sharp silhouette for the discerning professional.", image: "https://source.unsplash.com/400x300/?formal+trousers", stock: 38, category: "Fashion" },
  { name: "Pepe Jeans Denim Jacket", price: 4499, description: "Classic washed denim jacket with chest pockets and a relaxed fit for a timeless streetwear look.", image: "https://source.unsplash.com/400x300/?denim+jacket", stock: 30, category: "Fashion" },

  { name: "IKEA KALLAX Shelf Unit", price: 8999, description: "Versatile modular shelving unit in white, compatible with KALLAX inserts for smart storage solutions.", image: "https://source.unsplash.com/400x300/?shelf+unit", stock: 22, category: "Home" },
  { name: "Philips Air Purifier 2000i", price: 14999, description: "Removes 99.97% of allergens and pollutants with real-time air quality feedback on a connected app.", image: "https://source.unsplash.com/400x300/?air+purifier", stock: 18, category: "Home" },
  { name: "Prestige Svachh Deep Kadai", price: 1499, description: "Hard anodized deep kadai with lid and special collecting bowl to minimize oil splatter.", image: "https://source.unsplash.com/400x300/?cookware", stock: 65, category: "Home" },
  { name: "Nilkamal Easy Chair Recliner", price: 12999, description: "Cushioned fabric recliner with manual footrest extension and lumbar support for ultimate relaxation.", image: "https://source.unsplash.com/400x300/?recliner+chair", stock: 10, category: "Home" },
  { name: "Bombay Dyeing Floral Bedsheet Set", price: 1899, description: "100% cotton king-size bedsheet with 2 pillow covers — soft, breathable, and vibrant all-season.", image: "https://source.unsplash.com/400x300/?bedsheet", stock: 75, category: "Home" },
  { name: "Wonderchef Nutri-Blend Pro", price: 4499, description: "Compact personal blender with 22000 RPM motor, ideal for smoothies, juices, and baby food.", image: "https://source.unsplash.com/400x300/?blender", stock: 40, category: "Home" },
  { name: "Godrej Interio Study Table", price: 7499, description: "Engineered wood study table with keyboard tray, CPU stand, and wire management for home offices.", image: "https://source.unsplash.com/400x300/?study+table", stock: 14, category: "Home" },
  { name: "Orient Electric Wall Fan Hector", price: 2999, description: "400mm wall fan with powerful air delivery, 3-speed control, and aerodynamic blade design.", image: "https://source.unsplash.com/400x300/?wall+fan", stock: 35, category: "Home" },
  { name: "Pigeon Handy Chopper Plus", price: 599, description: "Manual food chopper with stainless steel blades that minces onions and veggies in seconds.", image: "https://source.unsplash.com/400x300/?kitchen+chopper", stock: 90, category: "Home" },
  { name: "Home Centre Cosmo Sofa 3-Seater", price: 24999, description: "Plush 3-seater sofa in premium fabric with high-density foam cushions and solid wood legs.", image: "https://source.unsplash.com/400x300/?sofa", stock: 8, category: "Home" },
  { name: "Hafele Mortise Door Lock", price: 3299, description: "Heavy-duty stainless steel door lock with anti-pick pins and smooth lever operation for security.", image: "https://source.unsplash.com/400x300/?door+lock", stock: 50, category: "Home" },
  { name: "Elica 60cm Chimney Hood", price: 11999, description: "Filterless kitchen chimney with auto-clean technology and touch control for odour-free cooking.", image: "https://source.unsplash.com/400x300/?kitchen+chimney", stock: 16, category: "Home" },
  { name: "Solimo Bamboo Laundry Hamper", price: 1299, description: "Eco-friendly bamboo hamper with removable canvas liner and breathable lid for tidy laundry rooms.", image: "https://source.unsplash.com/400x300/?laundry+basket", stock: 60, category: "Home" },
  { name: "TTK Prestige Electric Kettle Evo", price: 1799, description: "1.7L stainless steel kettle with rapid boil, auto shut-off, and a 360-degree cordless base.", image: "https://source.unsplash.com/400x300/?electric+kettle", stock: 55, category: "Home" },
  { name: "Wakefit Orthopaedic Memory Foam Mattress", price: 18999, description: "7-inch queen-size mattress with dual comfort foam layers engineered to support spinal alignment.", image: "https://source.unsplash.com/400x300/?mattress", stock: 13, category: "Home" },
  { name: "Hindware Activa Shower Set", price: 4999, description: "Multi-function overhead shower with hand shower and adjustable slide bar for a spa-like experience.", image: "https://source.unsplash.com/400x300/?shower+set", stock: 25, category: "Home" },
  { name: "Borosil Vision Glass Set of 6", price: 899, description: "Toughened borosilicate glass tumblers that are microwave-safe, dishwasher-safe, and chip-resistant.", image: "https://source.unsplash.com/400x300/?glass+set", stock: 80, category: "Home" },
  { name: "Cello Wonder Storage Box 3-Piece", price: 699, description: "Airtight food-grade plastic containers with locking lids — perfect for pantry and fridge organisation.", image: "https://source.unsplash.com/400x300/?storage+containers", stock: 95, category: "Home" },
  { name: "Orient Areva BLDC Ceiling Fan", price: 5499, description: "Energy-saving BLDC ceiling fan with remote control and 5-star BEE rating for year-round comfort.", image: "https://source.unsplash.com/400x300/?ceiling+fan", stock: 30, category: "Home" },
  { name: "Pepperfry Ceramic Planter Set", price: 1499, description: "Set of 3 hand-painted ceramic planters in gradient pastels — ideal for succulents and indoor herbs.", image: "https://source.unsplash.com/400x300/?ceramic+planter", stock: 45, category: "Home" },

  { name: "Decathlon Domyos Yoga Mat 6mm", price: 1299, description: "Non-slip NBR foam yoga mat with alignment lines and a carry strap for studio or home practice.", image: "https://source.unsplash.com/400x300/?yoga+mat", stock: 85, category: "Fitness" },
  { name: "Boldfit Resistance Band Set", price: 799, description: "Set of 5 latex resistance bands with varying tension levels for strength, rehab, and flexibility training.", image: "https://source.unsplash.com/400x300/?resistance+bands", stock: 90, category: "Fitness" },
  { name: "Durafit Elliptical Cross Trainer", price: 24999, description: "Heavy-duty elliptical with 16 resistance levels, digital monitor, and 12kg flywheel for cardio training.", image: "https://source.unsplash.com/400x300/?elliptical+trainer", stock: 7, category: "Fitness" },
  { name: "Cosco Ab Wheel Roller Pro", price: 999, description: "Double-wheel ab roller with non-slip handles and a kneeling pad for core strengthening workouts.", image: "https://source.unsplash.com/400x300/?ab+roller", stock: 70, category: "Fitness" },
  { name: "HealthSense Smart Scale LS-175", price: 2499, description: "Bluetooth body fat scale that measures 13 body metrics including BMI, bone mass, and hydration.", image: "https://source.unsplash.com/400x300/?weighing+scale", stock: 50, category: "Fitness" },
  { name: "Sportneer Foam Roller Deep Tissue", price: 1799, description: "High-density EVA foam roller with textured surface for myofascial release and muscle recovery.", image: "https://source.unsplash.com/400x300/?foam+roller", stock: 60, category: "Fitness" },
  { name: "Kore Pro Adjustable Dumbbells 20kg", price: 4999, description: "Space-saving dial-a-weight dumbbell set that replaces 9 pairs of weights with a single adjustment.", image: "https://source.unsplash.com/400x300/?dumbbells", stock: 20, category: "Fitness" },
  { name: "Fitbit Charge 6", price: 14999, description: "Advanced fitness tracker with built-in GPS, ECG app, Google Maps integration, and sleep coaching.", image: "https://source.unsplash.com/400x300/?fitness+tracker", stock: 35, category: "Fitness" },
  { name: "Lifelong LLM79 Treadmill", price: 18999, description: "Motorised treadmill with 3HP motor, 12 preset programs, and a foldable deck for compact home gyms.", image: "https://source.unsplash.com/400x300/?treadmill", stock: 10, category: "Fitness" },
  { name: "Nivia Pro Knitted Football", price: 1299, description: "FIFA-approved match football with hand-stitched seams and all-surface play for grassroots to club level.", image: "https://source.unsplash.com/400x300/?football", stock: 55, category: "Fitness" },
  { name: "Adidas Predator Edge Gloves", price: 3499, description: "Goalkeeper gloves with Demonskin spines on fingers for superior ball control and grip in wet conditions.", image: "https://source.unsplash.com/400x300/?goalkeeper+gloves", stock: 25, category: "Fitness" },
  { name: "GNC Whey Protein Gold 2kg", price: 5499, description: "Banned substance tested whey protein with 24g protein per serving, available in chocolate and vanilla.", image: "https://source.unsplash.com/400x300/?protein+powder", stock: 45, category: "Fitness" },
  { name: "Yonex Astrox 22F Badminton Racket", price: 3999, description: "Isometric head frame racket for faster swing speeds and improved smash accuracy in competitive play.", image: "https://source.unsplash.com/400x300/?badminton+racket", stock: 30, category: "Fitness" },
  { name: "Burnlab Jump Rope Pro", price: 999, description: "Speed jumping rope with ball-bearing handles and adjustable steel cable for HIIT and CrossFit training.", image: "https://source.unsplash.com/400x300/?jump+rope", stock: 75, category: "Fitness" },
  { name: "Strauss Pull-Up Doorway Bar", price: 1499, description: "No-screw doorway pull-up bar with foam grips and adjustable width — supports up to 120kg.", image: "https://source.unsplash.com/400x300/?pull+up+bar", stock: 40, category: "Fitness" },
  { name: "Decathlon Kipsta Knee Guard", price: 799, description: "Protective knee compression sleeve with dual-axis hinges for joint stability during sport activity.", image: "https://source.unsplash.com/400x300/?knee+support", stock: 65, category: "Fitness" },
  { name: "Instafit Wooden Kettlebell 16kg", price: 3299, description: "Chrome-coated iron kettlebell with flat base and powder-coat finish for deadlifts, swings, and squats.", image: "https://source.unsplash.com/400x300/?kettlebell", stock: 18, category: "Fitness" },
  { name: "MuscleBlaze Creatine Monohydrate 250g", price: 999, description: "Unflavoured pure creatine monohydrate for explosive power, endurance, and faster post-workout recovery.", image: "https://source.unsplash.com/400x300/?supplement+powder", stock: 80, category: "Fitness" },
  { name: "Cosco Olympic Barbell Set 50kg", price: 8999, description: "Olympic-grade chrome barbell set with rubber weight plates for home gym strength and powerlifting routines.", image: "https://source.unsplash.com/400x300/?barbell", stock: 9, category: "Fitness" },
  { name: "HealthSense Pulse Oximeter", price: 1199, description: "Fingertip pulse oximeter with OLED display showing SpO2, pulse rate, and perfusion index in 10 seconds.", image: "https://source.unsplash.com/400x300/?pulse+oximeter", stock: 55, category: "Fitness" },

  { name: "Atomic Habits – James Clear", price: 599, description: "A practical, science-backed framework for building good habits and breaking bad ones, one tiny change at a time.", image: "https://source.unsplash.com/400x300/?self+help+book", stock: 100, category: "Books" },
  { name: "The Psychology of Money – Morgan Housel", price: 499, description: "Timeless lessons on wealth, greed, and happiness through 19 compelling short stories about financial behaviour.", image: "https://source.unsplash.com/400x300/?finance+book", stock: 90, category: "Books" },
  { name: "Sapiens – Yuval Noah Harari", price: 699, description: "A sweeping narrative of humanity's journey from Stone Age hunter-gatherers to the digital age's tech overlords.", image: "https://source.unsplash.com/400x300/?history+book", stock: 75, category: "Books" },
  { name: "The Alchemist – Paulo Coelho", price: 399, description: "A magical fable about following your dreams and listening to your heart — one of the bestselling novels ever.", image: "https://source.unsplash.com/400x300/?novel", stock: 95, category: "Books" },
  { name: "Deep Work – Cal Newport", price: 549, description: "A compelling argument for the power of focused, uninterrupted work and a practical guide to achieving it.", image: "https://source.unsplash.com/400x300/?productivity+book", stock: 60, category: "Books" },
  { name: "Rich Dad Poor Dad – Robert Kiyosaki", price: 449, description: "The personal finance classic that challenges conventional wisdom about money, assets, and building wealth.", image: "https://source.unsplash.com/400x300/?business+book", stock: 80, category: "Books" },
  { name: "The Lean Startup – Eric Ries", price: 599, description: "A revolutionary approach to building businesses that teaches validated learning and pivot-or-persist decision making.", image: "https://source.unsplash.com/400x300/?startup+book", stock: 50, category: "Books" },
  { name: "Thinking, Fast and Slow – Kahneman", price: 649, description: "Nobel laureate Daniel Kahneman explains the two systems that drive our thinking and the biases that shape decisions.", image: "https://source.unsplash.com/400x300/?psychology+book", stock: 45, category: "Books" },
  { name: "Zero to One – Peter Thiel", price: 549, description: "Contrarian startup wisdom from PayPal's co-founder on building companies that create new value, not just compete.", image: "https://source.unsplash.com/400x300/?entrepreneurship+book", stock: 55, category: "Books" },
  { name: "The Silent Patient – Alex Michaelides", price: 499, description: "A gripping psychological thriller about a famous painter who shoots her husband and then never speaks again.", image: "https://source.unsplash.com/400x300/?thriller+book", stock: 70, category: "Books" },
  { name: "Ikigai – Hector Garcia", price: 399, description: "Explores the Japanese philosophy of finding purpose and the secret to a long, joyful, and fulfilling life.", image: "https://source.unsplash.com/400x300/?philosophy+book", stock: 85, category: "Books" },
  { name: "Educated – Tara Westover", price: 549, description: "A memoir about a woman who grows up without formal education and ultimately earns a PhD from Cambridge.", image: "https://source.unsplash.com/400x300/?memoir+book", stock: 40, category: "Books" },
  { name: "The Art of War – Sun Tzu", price: 299, description: "Ancient Chinese military treatise with timeless wisdom on strategy, leadership, and competitive advantage.", image: "https://source.unsplash.com/400x300/?strategy+book", stock: 100, category: "Books" },
  { name: "Steve Jobs – Walter Isaacson", price: 799, description: "The authorised biography of Apple's visionary co-founder, based on 40 exclusive interviews with Jobs himself.", image: "https://source.unsplash.com/400x300/?biography+book", stock: 35, category: "Books" },
  { name: "To Kill a Mockingbird – Harper Lee", price: 449, description: "Pulitzer Prize-winning classic exploring racial injustice and moral growth through the eyes of young Scout Finch.", image: "https://source.unsplash.com/400x300/?classic+literature", stock: 60, category: "Books" },
  { name: "Dune – Frank Herbert", price: 699, description: "Epic science fiction saga set on the desert planet Arrakis — a masterwork of world-building and political intrigue.", image: "https://source.unsplash.com/400x300/?science+fiction+book", stock: 50, category: "Books" },
  { name: "Can't Hurt Me – David Goggins", price: 599, description: "Ex-Navy SEAL David Goggins shares his extraordinary life story and tools to unlock 100% of your potential.", image: "https://source.unsplash.com/400x300/?motivational+book", stock: 65, category: "Books" },
  { name: "The Midnight Library – Matt Haig", price: 499, description: "A moving novel about a library between life and death where each book represents a life you could have lived.", image: "https://source.unsplash.com/400x300/?fiction+novel", stock: 55, category: "Books" },
  { name: "Mein Kampf – Historical Reference Edition", price: 799, description: "Annotated scholarly edition with extensive historical commentary and context by leading historians for academic study.", image: "https://source.unsplash.com/400x300/?history+reference+book", stock: 15, category: "Books" },
  { name: "Good to Great – Jim Collins", price: 649, description: "A rigorous research-backed study of why some companies make the leap to greatness and others do not.", image: "https://source.unsplash.com/400x300/?leadership+book", stock: 48, category: "Books" }
]
].flat();

const keywordImages: Array<{ keyword: RegExp; url: string }> = [
  {
    keyword: /laptop|ipad|computer/i,
    url: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=800&q=80",
  },
  {
    keyword: /headphones|earbuds/i,
    url: "https://images.unsplash.com/photo-1518441902110-18d6f9cde8b2?auto=format&fit=crop&w=800&q=80",
  },
  {
    keyword: /sneakers|shoes/i,
    url: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800&q=80",
  },
  {
    keyword: /sofa|chair|table|furniture/i,
    url: "https://images.unsplash.com/photo-1505691938895-1758d7feb511?auto=format&fit=crop&w=800&q=80",
  },
  {
    keyword: /book|novel|biography/i,
    url: "https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=800&q=80",
  },
];

const fallbackByCategory: Record<string, string> = {
  Electronics:
    "https://images.unsplash.com/photo-1512446816042-444d64126703?auto=format&fit=crop&w=800&q=80",
  Fashion:
    "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=800&q=80",
  Home:
    "https://images.unsplash.com/photo-1505691938895-1758d7feb511?auto=format&fit=crop&w=800&q=80",
  Fitness:
    "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&w=800&q=80",
  Books:
    "https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=800&q=80",
};

const resolveImage = (name: string, category: string) => {
  const matched = keywordImages.find((entry) => entry.keyword.test(name));
  if (matched) return matched.url;
  return fallbackByCategory[category] ?? fallbackByCategory.Electronics;
};

const stableProducts = products.map(({ image: _image, ...product }) => {
  const resolvedImage = resolveImage(product.name, product.category);
  return {
    ...product,
    image: resolvedImage,
    images: [resolvedImage],
  };
});

async function main() {
  console.log("Clearing old data...");

  await prisma.orderItem.deleteMany({});
  await prisma.order.deleteMany({});
  await prisma.cart.deleteMany({});
  await prisma.product.deleteMany({});

  console.log("Inserting new products...");

  await prisma.product.createMany({
    data: stableProducts,
  });

  const count = await prisma.product.count();
  console.log("Total products:", count);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());