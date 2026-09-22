import electronicsImage from "@/features/landing/assets/electronics.webp";
import menFashionImage from "@/features/landing/assets/fashion.webp";
import womensFashionImage from "../assets/womenFashion.webp";
import beautyImage from "@/features/landing/assets/beauty.webp";
import homeLivingImage from "@/features/landing/assets/living.webp";
import skinCareImage from "../assets/skincare.webp";
import gamingImage from "../assets/gaming.webp";
import accessoriesImage from "@/features/landing/assets/accessories.webp";
import healthImage from "../assets/health.webp";
import jewelryImage from "../assets/jewelary.webp";
import fragranceImage from "../assets/fragrance.webp";
import sunglassesImage from "@/features/landing/assets/sunglasses.webp";

const categories = [
  {
    key: "electronics",
    title: "Electronics",
    image: electronicsImage,
    category: "electronics",
    subcategories: ["Audio", "Smart Home", "Wearables", "Gadgets"],
  },
  {
    key: "menFashion",
    title: "Men's Fashion",
    image: menFashionImage,
    category: "men'sFashion",
    subcategories: ["Apparel", "Footwear", "Outerwear"],
  },
  {
    key: "womenFashion",
    title: "Women's Fashion",
    image: womensFashionImage,
    category: "women'sFashion",
    subcategories: ["Apparel", "Footwear", "Outerwear"],
  },
  {
    key: "beauty",
    title: "Beauty",
    image: beautyImage,
    category: "beauty",
    subcategories: ["Skincare", "Makeup", "Grooming", "Haircare"],
  },
  {
    key: "homeLiving",
    title: "Home & Living",
    image: homeLivingImage,
    category: "home",
    subcategories: ["Vases", "Wall Art", "Cushions", "Frames", "Candles"],
  },
  {
    key: "skinCare",
    title: "Skin Care",
    image: skinCareImage,
    category: "skinCare",
    subcategories: ["Skincare", "Skincare Tools"],
  },
  {
    key: "gaming",
    title: "Gaming",
    image: gamingImage,
    category: "gaming",
    subcategories: ["Consoles", "Controllers", "Gaming PCs", "Accessories"],
  },
  {
    key: "accessories",
    title: "Accessories",
    image: accessoriesImage,
    category: "accessories",
    subcategories: ["Wallets", "Bags", "Watches", "Belts", "Travel"],
  },
  {
    key: "health",
    title: "Health & Nutrition",
    image: healthImage,
    category: "health",
    subcategories: ["Vitamins", "Supplements", "Fitness", "Wellness"],
  },
  {
    key: "jewelry",
    title: "Jewelry",
    image: jewelryImage,
    category: "jewelry",
    subcategories: ["Necklaces", "Rings", "Earrings", "Bracelets"],
  },
  {
    key: "fragrance",
    title: "Fragrances",
    image: fragranceImage,
    category: "fragrance",
    subcategories: ["Perfumes", "Colognes", "Gift Sets"],
  },
  {
    key: "sunglasses",
    title: "Sunglasses",
    image: sunglassesImage,
    category: "sunglasses",
    subcategories: ["Aviator", "Classic", "Sport", "Vintage", "Minimal"],
  },
];

export default categories;
