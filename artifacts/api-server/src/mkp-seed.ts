import { db, mkpDealsTable, mkpWishlistTable, mkpAlertsTable } from "@workspace/db";
import { eq, count } from "drizzle-orm";

const DEMO_USER = "demo-user";

const DEALS = [
  { title: "Samsung Galaxy S24 FE 128GB", description: "Fan Edition with Exynos 2400e chip, 6.7\" display", platform: "shopee", originalPrice: "18990", salePrice: "12990", discountPercent: "31.59", category: "Smartphones", url: "https://shopee.co.th", isTrending: true, isVerified: true },
  { title: "Apple AirPods Pro 2nd Gen", description: "Active noise cancellation, USB-C charging case", platform: "lazada", originalPrice: "9990", salePrice: "6490", discountPercent: "35.04", category: "Earphones", url: "https://lazada.co.th", isTrending: true, isVerified: true },
  { title: "Xiaomi Redmi Note 13 Pro+ 5G", description: "200MP camera, Snapdragon 7s Gen 2", platform: "tiktok", originalPrice: "12990", salePrice: "7990", discountPercent: "38.49", category: "Smartphones", url: "https://tiktokshop.com", isTrending: true, isVerified: true },
  { title: "Sony WH-1000XM5 Headphones", description: "Industry-leading noise canceling, 30hr battery", platform: "shopee", originalPrice: "12990", salePrice: "8990", discountPercent: "30.79", category: "Headphones", url: "https://shopee.co.th", isTrending: true, isVerified: true },
  { title: "ASUS ROG Phone 8 Pro", description: "Snapdragon 8 Gen 3, 165Hz AMOLED, gaming focused", platform: "lazada", originalPrice: "34990", salePrice: "24990", discountPercent: "28.58", category: "Smartphones", url: "https://lazada.co.th", isTrending: false, isVerified: true },
  { title: "Nike Air Max 270 React", description: "Men's running shoes, multiple colorways", platform: "shopee", originalPrice: "4990", salePrice: "2990", discountPercent: "40.08", category: "Footwear", url: "https://shopee.co.th", isTrending: true, isVerified: true },
  { title: "Dyson Airwrap Complete", description: "Multi-styler with Coanda airflow technology", platform: "lazada", originalPrice: "19900", salePrice: "14900", discountPercent: "25.13", category: "Beauty", url: "https://lazada.co.th", isTrending: false, isVerified: true },
  { title: "iPad Pro 11-inch M4 256GB", description: "M4 chip, Ultra Retina XDR display, Wi-Fi", platform: "shopee", originalPrice: "36900", salePrice: "29900", discountPercent: "18.97", category: "Tablets", url: "https://shopee.co.th", isTrending: true, isVerified: true },
  { title: "Anker MagGo 15W Wireless Charger", description: "MagSafe compatible, foldable stand design", platform: "tiktok", originalPrice: "1490", salePrice: "890", discountPercent: "40.27", category: "Accessories", url: "https://tiktokshop.com", isTrending: false, isVerified: true },
  { title: "Logitech MX Master 3S Mouse", description: "8K DPI sensor, MagSpeed scroll, silent clicks", platform: "lazada", originalPrice: "3890", salePrice: "2490", discountPercent: "35.99", category: "Peripherals", url: "https://lazada.co.th", isTrending: false, isVerified: true },
  { title: "Uniqlo HEATTECH Ultra Warm Set", description: "Extra warm inner wear", platform: "tiktok", originalPrice: "990", salePrice: "590", discountPercent: "40.40", category: "Clothing", url: "https://tiktokshop.com", isTrending: true, isVerified: true },
  { title: "Kindle Paperwhite 16GB", description: "6.8\" display, 300 PPI, waterproof, 10 weeks battery", platform: "lazada", originalPrice: "6990", salePrice: "4490", discountPercent: "35.76", category: "E-readers", url: "https://lazada.co.th", isTrending: false, isVerified: true },
  { title: "Philips Hue Starter Kit E27", description: "3 smart bulbs + bridge, 16M colors, app controlled", platform: "shopee", originalPrice: "3990", salePrice: "2490", discountPercent: "37.59", category: "Smart Home", url: "https://shopee.co.th", isTrending: false, isVerified: true },
  { title: "Garmin Venu 3 GPS Smartwatch", description: "Health + fitness tracker, AMOLED, sleep coaching", platform: "lazada", originalPrice: "16990", salePrice: "12990", discountPercent: "23.54", category: "Smartwatches", url: "https://lazada.co.th", isTrending: true, isVerified: true },
  { title: "Levi's 511 Slim Fit Jeans", description: "Classic slim cut, stretch denim, dark wash", platform: "tiktok", originalPrice: "2490", salePrice: "1290", discountPercent: "48.19", category: "Clothing", url: "https://tiktokshop.com", isTrending: false, isVerified: true },
];

export async function seedMkpIfEmpty(log: (msg: string) => void) {
  try {
    // Seed deals if empty
    const [{ total: dealCount }] = await db.select({ total: count() }).from(mkpDealsTable);
    if (Number(dealCount) === 0) {
      await db.insert(mkpDealsTable).values(DEALS);
      log(`MKP: seeded ${DEALS.length} deals`);
    }

    // Seed demo wishlist + alerts if empty for demo user
    const [{ total: wishlistCount }] = await db
      .select({ total: count() })
      .from(mkpWishlistTable)
      .where(eq(mkpWishlistTable.userId, DEMO_USER));

    if (Number(wishlistCount) === 0) {
      const wishlistItems = await db.insert(mkpWishlistTable).values([
        { userId: DEMO_USER, name: "iPhone 15 Pro", category: "Smartphones", budgetMin: "30000", budgetMax: "45000", platform: "shopee", status: "watching", notes: "prefer natural titanium" },
        { userId: DEMO_USER, name: "Sony WH-1000XM5", category: "Headphones", budgetMin: "7000", budgetMax: "12000", platform: "any", status: "matched", notes: "noise cancelling must" },
        { userId: DEMO_USER, name: "Nike Air Max", category: "Footwear", budgetMin: "2000", budgetMax: "5000", platform: "shopee", status: "watching" },
        { userId: DEMO_USER, name: "iPad Pro M4", category: "Tablets", budgetMin: "25000", budgetMax: "40000", platform: "lazada", status: "watching" },
        { userId: DEMO_USER, name: "Samsung Galaxy S24", category: "Smartphones", budgetMin: "10000", budgetMax: "18000", platform: "shopee", status: "matched" },
      ]).returning();

      const now = new Date();
      const yesterday = new Date(now.getTime() - 86400000);

      await db.insert(mkpAlertsTable).values([
        { userId: DEMO_USER, wishlistItemId: wishlistItems[1].id, platform: "shopee", originalPrice: "12990", alertPrice: "8990", currentPrice: "8990", triggered: true, triggeredAt: yesterday },
        { userId: DEMO_USER, wishlistItemId: wishlistItems[4].id, platform: "shopee", originalPrice: "18990", alertPrice: "12990", currentPrice: "12990", triggered: true, triggeredAt: now },
        { userId: DEMO_USER, wishlistItemId: wishlistItems[0].id, platform: "shopee", originalPrice: "43900", alertPrice: "35000", currentPrice: "40900", triggered: false, triggeredAt: null },
        { userId: DEMO_USER, wishlistItemId: wishlistItems[2].id, platform: "shopee", originalPrice: "4990", alertPrice: "2990", currentPrice: "3590", triggered: false, triggeredAt: null },
        { userId: DEMO_USER, wishlistItemId: wishlistItems[3].id, platform: "lazada", originalPrice: "36900", alertPrice: "29000", currentPrice: "29900", triggered: false, triggeredAt: null },
      ]);

      log(`MKP: seeded ${wishlistItems.length} wishlist items + 5 alerts for demo user`);
    }
  } catch (err) {
    log(`MKP seed warning: ${err}`);
  }
}
