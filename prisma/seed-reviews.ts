import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// ────────────────────────────────────────────────────────────────────────────
// Fake user IDs (simulating Clerk user_xxx IDs) so each "person" is unique
// ────────────────────────────────────────────────────────────────────────────
const fakeUsers = [
  "user_2xR4kAnika",
  "user_2xR5kRahul",
  "user_2xR6kPriya",
  "user_2xR7kVikram",
  "user_2xR8kSneha",
  "user_2xR9kArjun",
  "user_2xRAkMeera",
  "user_2xRBkDevika",
  "user_2xRCkRohan",
  "user_2xRDkKavya",
  "user_2xREkSuresh",
  "user_2xRFkDivya",
  "user_2xRGkManish",
  "user_2xRHkPooja",
  "user_2xRIkAmit",
  "user_2xRJkNeha",
  "user_2xRKkSanjay",
  "user_2xRLkRitu",
  "user_2xRMkAshish",
  "user_2xRNkAnanya",
  "user_2xROkKaran",
  "user_2xRPkTanvi",
  "user_2xRQkAbhishek",
  "user_2xRRkSakshi",
  "user_2xRSkNitin",
  "user_2xRTkIsha",
  "user_2xRUkGaurav",
  "user_2xRVkSwati",
  "user_2xRWkPankaj",
  "user_2xRXkShruti",
];

// ────────────────────────────────────────────────────────────────────────────
// Review templates organised by category.  Each has a title, text, and a
// rating-weight so the distribution skews realistic (mostly 4–5 stars).
// ────────────────────────────────────────────────────────────────────────────
type ReviewTemplate = {
  title: string;
  text: string;
  rating: number;
};

const reviewPool: Record<string, ReviewTemplate[]> = {
  Electronics: [
    { rating: 5, title: "Absolutely love it!", text: "This product exceeded all my expectations. The build quality is premium and performance is top-notch. Best purchase I've made this year, truly worth every rupee spent. Highly recommend to anyone looking for quality." },
    { rating: 5, title: "Worth every penny", text: "After researching for weeks, I picked this and I'm so glad I did. The features are exactly as described, battery life is great, and it feels premium in hand. Fast shipping too!" },
    { rating: 5, title: "Incredible quality", text: "ShopFusion delivered this in perfect packaging. The product itself is sleek, modern, and works flawlessly. I've been using it daily for two weeks now and couldn't be happier with the performance." },
    { rating: 4, title: "Great product with minor quirks", text: "Overall very happy with this purchase. Performance is excellent and build quality feels solid. Took off one star because the initial setup was a bit confusing, but once configured it works beautifully." },
    { rating: 4, title: "Solid and reliable", text: "Does exactly what it promises. The quality is good for the price point and I appreciate the attention to detail in the design. Would have liked slightly better packaging but the product itself is excellent." },
    { rating: 4, title: "Good value for money", text: "Compared this with several alternatives and this offers the best bang for your buck. Sound quality is clear, connectivity is stable, and the design is modern. Definitely recommend for budget-conscious buyers." },
    { rating: 5, title: "Perfect gift choice", text: "Bought this as a birthday gift and the recipient was thrilled. The unboxing experience felt premium, the product looks stunning, and it performs way beyond what we expected at this price range." },
    { rating: 3, title: "Decent but could be better", text: "The product works fine for everyday use but doesn't quite match the premium claims in the description. Build quality is average and I noticed some minor issues after a week. Okay for the price but not exceptional." },
    { rating: 4, title: "Impressed with the performance", text: "Really smooth performance and the interface is intuitive. Took some time to explore all features but once I did, I was genuinely impressed. Battery holds up well through a full day of heavy use." },
    { rating: 5, title: "Best in class", text: "I've tried many products in this category and this is hands down the best one. The engineering quality shows in every detail. From the moment you take it out of the box, you know this is a premium product." },
    { rating: 2, title: "Expected more at this price", text: "For what I paid, I expected better build quality and more features. It works but feels a bit plasticky and the performance lags behind competitors. Adequate for basic use but disappointing overall." },
    { rating: 5, title: "Superb experience", text: "From ordering to delivery, everything was seamless. The product is exactly as shown in the images. Crystal clear display, responsive controls, and the battery lasts longer than advertised. A five-star experience." },
    { rating: 4, title: "Very good, not perfect", text: "This ticks almost every box on my wishlist. Great performance, good design, decent battery. The only reason I'm not giving 5 stars is the slightly tinny audio, but headphones solve that easily." },
    { rating: 3, title: "Average performer", text: "It's an okay product that does its job. Nothing extraordinary but nothing terrible either. If you're looking for something basic and affordable, this fits the bill. Don't expect to be blown away though." },
  ],
  Fashion: [
    { rating: 5, title: "Perfect fit and stunning quality", text: "The fabric quality is outstanding and the stitching is impeccable. Fits exactly as per the size chart. I received so many compliments the first time I wore it. Will definitely buy more from this brand." },
    { rating: 5, title: "Looks even better in person", text: "The photos don't do this justice. The colour is vibrant, the material feels luxurious, and it drapes beautifully. Packaging was also very classy. Already planning my next purchase." },
    { rating: 4, title: "Great style, comfortable wear", text: "Really happy with the design and comfort. Wore it for a full day and it stayed comfortable throughout. The fabric breathes well in Indian summers. Deducted one star because the colour is slightly different from the photo." },
    { rating: 4, title: "Good quality for the price", text: "Material is soft and comfortable, stitching looks durable. It's not luxury-brand level but for this price range, you're getting excellent value. Washed twice and no fading or shrinking so far." },
    { rating: 5, title: "My new favourite!", text: "This has become my go-to piece. The design is versatile — works for casual outings as well as semi-formal occasions. The attention to detail is commendable. Absolutely love the texture and finish." },
    { rating: 3, title: "Size runs a bit large", text: "The quality of the material is good but I had to exchange for a smaller size. The fit was much larger than expected based on the size chart. After the exchange, it looks fine. Consider sizing down." },
    { rating: 5, title: "Premium feel, great stitching", text: "You can tell this is a well-made product just by touching it. The fabric has a rich feel, the seams are clean, and the design details are thoughtful. Exactly what I needed for my wardrobe update." },
    { rating: 4, title: "Stylish and trendy", text: "Looks exactly like the product images. Comfortable and easy to style with different accessories. The colour options were great too. My only minor complaint is the packaging could have been better." },
    { rating: 2, title: "Colour faded after first wash", text: "Was excited about this purchase but the colour started fading after the very first wash despite following care instructions. The fit and design were great but durability is a concern. Disappointing." },
    { rating: 5, title: "Excellent craftsmanship", text: "As someone who is very particular about fashion, I'm thoroughly impressed with the quality, design, and overall finish. It fits perfectly, the fabric is premium, and I can see this lasting for years." },
    { rating: 4, title: "Comfortable and stylish", text: "Really enjoyed wearing this. The material is soft against the skin, and it pairs well with multiple outfits. Delivery was quick and the product matched the description. Would recommend to friends." },
    { rating: 3, title: "Okay for casual use", text: "The product looks decent for casual wear but the fabric feels a bit thin for the price. The stitching is fine and it fits well enough. Wouldn't wear it to a formal event but it's okay for daily wear." },
  ],
  Home: [
    { rating: 5, title: "Transformed my living space", text: "This product elevated the entire look and feel of my room. The quality is exceptional and it looks far more expensive than what I paid. Assembly was straightforward and the finish is flawless." },
    { rating: 5, title: "Kitchen essential!", text: "Cannot imagine my kitchen without this anymore. It's efficient, well-built, and makes everyday cooking so much easier. Cleaned up easily too. A must-have for every Indian household." },
    { rating: 4, title: "Sturdy and well-designed", text: "Very happy with the build quality and design aesthetics. It fits perfectly in our apartment. Minor assembly hiccup with one screw but once done, it's rock solid. Great value for this price range." },
    { rating: 4, title: "Good addition to our home", text: "Adds a nice touch to the room. The material feels durable and the design is modern without being too flashy. My wife loved the colour and it matches our existing décor perfectly." },
    { rating: 5, title: "Exceeded expectations", text: "I was skeptical about buying home products online but this completely won me over. The quality, finish, and functionality are all top-notch. It arrived well-packaged and damage-free. Will shop again!" },
    { rating: 3, title: "Decent quality, tricky assembly", text: "The product itself is fine once assembled, but the instructions were confusing and it took much longer than expected. A few of the parts didn't align perfectly. Functional but could be more polished." },
    { rating: 5, title: "Perfect for our new house", text: "We furnished our new apartment with several items from ShopFusion and this was the highlight. Premium materials, elegant design, and it just ties the whole room together beautifully." },
    { rating: 4, title: "Works great, looks great", text: "Both functional and aesthetically pleasing. The performance has been consistent over three months of daily use. Energy efficient and quiet operation. My only wish is that it came in more colour options." },
    { rating: 2, title: "Arrived with a scratch", text: "The product quality seems good but mine arrived with a visible scratch on the surface. The packaging could have been better padded. Had to contact customer service for a partial refund. Product itself works fine." },
    { rating: 5, title: "Best home purchase this year", text: "Everything about this screams quality — from the premium materials to the thoughtful design. It's functional, durable, and beautiful. My guests always ask where I got it. Worth every penny!" },
    { rating: 4, title: "Reliable and efficient", text: "Been using this daily for over a month and it has been very reliable. Easy to operate, energy efficient, and quiet. The build quality inspires confidence that it will last for years." },
    { rating: 3, title: "Average quality for the price", text: "It does the job but doesn't feel as premium as I expected. The finish has some imperfections and the design feels slightly dated. Not terrible but there are better options if you can stretch your budget." },
  ],
  Fitness: [
    { rating: 5, title: "Game changer for my workouts", text: "This has completely transformed my fitness routine. The quality is outstanding and it's clearly built to last. I use it almost every day and it still looks and performs like new. Must buy for fitness enthusiasts!" },
    { rating: 5, title: "Professional grade quality", text: "Feels like equipment you'd find in a premium gym. The grip is excellent, the weight distribution is perfect, and it's very durable. My home gym setup is now complete. Seriously impressed." },
    { rating: 4, title: "Great for home workouts", text: "Perfect for those who can't make it to the gym regularly. The build quality is solid and it doesn't take up much space. The only reason I'm not giving 5 stars is the instructions could be clearer." },
    { rating: 4, title: "Good quality, fast delivery", text: "Received this within two days and was impressed with the packaging. The product feels robust and well-made. I've been incorporating it into my daily routine and it's holding up really well." },
    { rating: 5, title: "Best fitness purchase ever", text: "As someone who's been into fitness for years, I can confidently say this is one of the best investments I've made. The quality rivals brands costing twice as much. Absolutely recommend to everyone." },
    { rating: 3, title: "Decent for beginners", text: "It's a good entry-level product for someone starting their fitness journey. The quality is okay for the price but if you're an advanced user, you might want to invest in something more premium." },
    { rating: 5, title: "Durable and effective", text: "Three months of intense daily use and not a single sign of wear. This is seriously built to last. The ergonomic design makes long workout sessions comfortable and the grip texture is perfect." },
    { rating: 4, title: "Impressive build quality", text: "The materials used are clearly high quality. Feels substantial in hand and performs exactly as described. Lost a star because the colour in person is slightly different from the photos, but functionally it's perfect." },
    { rating: 2, title: "Not for serious athletes", text: "It's an okay product for casual home workouts but doesn't meet the standards you'd expect for serious training. The construction feels a bit lightweight and the padding could be thicker. Average experience." },
    { rating: 5, title: "Worth the investment", text: "Initially hesitated because of the price but I'm so glad I went ahead. The performance, durability, and design are all exceptional. My trainer at the gym was impressed too. Five stars without doubt!" },
    { rating: 4, title: "Solid performer", text: "Very satisfied with this purchase. It integrates well into my existing workout setup and the quality is good for the price. Have been using it for six weeks now with no complaints whatsoever." },
    { rating: 3, title: "Gets the job done", text: "A basic but functional piece of fitness equipment. Nothing fancy about it but it does what you need it to do. For beginners or casual users, this is a perfectly adequate choice." },
  ],
  Books: [
    { rating: 5, title: "Life-changing read", text: "This book fundamentally changed how I think about life and work. Every chapter had insights that I found myself highlighting and sharing with friends. If you read one book this year, make it this one." },
    { rating: 5, title: "Couldn't put it down", text: "Started reading this on a Saturday morning and finished it by Sunday night. The writing is engaging, the ideas are powerful, and it left me thinking for days after. Absolutely brilliant storytelling." },
    { rating: 4, title: "Well-written and insightful", text: "A thoroughly enjoyable read with plenty of practical takeaways. The author has a clear, engaging writing style that makes complex ideas accessible. Took off one star as the middle section drags a bit." },
    { rating: 5, title: "Must-read masterpiece", text: "This is one of those rare books that lives up to all the hype. The depth of research, the clarity of writing, and the practical wisdom make it an essential read. I've already recommended it to everyone." },
    { rating: 4, title: "Great value, fast delivery", text: "The book arrived in pristine condition with good print quality. Content-wise, it's a solid read with plenty of actionable advice. Not every chapter resonated with me but overall, it's definitely worth buying." },
    { rating: 3, title: "Good but overhyped", text: "Decent book with some interesting points but I felt it was a bit overhyped by social media. The core message could have been conveyed in fewer pages. Still worth reading once but not life-changing for me." },
    { rating: 5, title: "A book that stays with you", text: "Even weeks after finishing, I find myself thinking about the ideas in this book. The author has a gift for making you reconsider things you took for granted. Beautiful writing and powerful message." },
    { rating: 4, title: "Engaging and thought-provoking", text: "This book challenged many of my preconceptions and gave me new frameworks to think about problems. The writing is crisp and the anecdotes are well-chosen. A solid addition to my bookshelf." },
    { rating: 5, title: "Gifted this to five friends", text: "After reading this, I immediately ordered five more copies as gifts. That's how much I believe in this book. It's the kind of wisdom everyone should have access to. Superb read from start to finish." },
    { rating: 2, title: "Not my cup of tea", text: "While the writing quality is decent, I found the content repetitive and the core ideas could have been a blog post. Some chapters felt like padding. Not a bad book per se, but not one I'd actively recommend." },
    { rating: 4, title: "Print quality is excellent", text: "ShopFusion delivered this book in perfect condition. The print is clear, pages are good quality, and the binding is sturdy. The content itself is interesting and well-researched. Happy with this purchase." },
    { rating: 5, title: "Read it twice already", text: "I rarely re-read books but this one deserved a second pass. So many nuances I missed the first time. The author's ability to weave stories with practical lessons is exceptional. An all-time favourite." },
  ],
};

// ────────────────────────────────────────────────────────────────────────────
// Helpers
// ────────────────────────────────────────────────────────────────────────────
function randomBetween(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function shuffleArray<T>(array: T[]): T[] {
  const copy = [...array];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

function randomDate(daysBack: number): Date {
  const now = new Date();
  const past = new Date(now.getTime() - daysBack * 24 * 60 * 60 * 1000);
  return new Date(past.getTime() + Math.random() * (now.getTime() - past.getTime()));
}

// ────────────────────────────────────────────────────────────────────────────
// Main
// ────────────────────────────────────────────────────────────────────────────
async function main() {
  console.log("🧹 Clearing existing reviews and helpful votes...");
  await prisma.helpfulVote.deleteMany({});
  await prisma.review.deleteMany({});

  console.log("📦 Fetching all products...");
  const products = await prisma.product.findMany({
    select: { id: true, name: true, category: true },
    orderBy: { id: "asc" },
  });

  console.log(`Found ${products.length} products. Generating reviews...\n`);

  let totalReviewsCreated = 0;

  for (const product of products) {
    const category = product.category;
    const templates = reviewPool[category] || reviewPool.Electronics;

    // Give each product between 5 and 12 reviews
    const numReviews = randomBetween(5, 12);

    // Pick random templates (allow repeats across products, but unique within a product)
    const shuffledTemplates = shuffleArray(templates);
    const selectedTemplates = shuffledTemplates.slice(0, Math.min(numReviews, shuffledTemplates.length));

    // If we need more reviews than templates, we can reuse some
    while (selectedTemplates.length < numReviews) {
      selectedTemplates.push(shuffledTemplates[randomBetween(0, shuffledTemplates.length - 1)]);
    }

    // Pick random unique users
    const shuffledUsers = shuffleArray(fakeUsers);

    const reviewData = selectedTemplates.map((template, index) => ({
      productId: product.id,
      userId: shuffledUsers[index % shuffledUsers.length],
      rating: template.rating,
      title: template.title,
      text: template.text,
      verifiedPurchase: Math.random() > 0.2, // 80% verified
      helpfulCount: randomBetween(0, 25),
      createdAt: randomDate(180), // reviews from the last 6 months
    }));

    // Deduplicate by userId for this product (unique constraint)
    const seenUsers = new Set<string>();
    const uniqueReviewData = reviewData.filter((r) => {
      if (seenUsers.has(r.userId)) return false;
      seenUsers.add(r.userId);
      return true;
    });

    // Insert reviews
    await prisma.review.createMany({ data: uniqueReviewData });

    // Calculate aggregates
    const totalRating = uniqueReviewData.reduce((sum, r) => sum + r.rating, 0);
    const avgRating = totalRating / uniqueReviewData.length;

    // Update the product's averageRating and reviewCount
    await prisma.product.update({
      where: { id: product.id },
      data: {
        averageRating: parseFloat(avgRating.toFixed(1)),
        reviewCount: uniqueReviewData.length,
      },
    });

    console.log(
      `  ✅ ${product.name.padEnd(45)} → ${uniqueReviewData.length} reviews (avg: ${avgRating.toFixed(1)}⭐)`
    );
    totalReviewsCreated += uniqueReviewData.length;
  }

  console.log(`\n🎉 Done! Created ${totalReviewsCreated} reviews across ${products.length} products.`);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
