import electronicsImage from "../assets/electronics.webp";
import menFashionImage from "../assets/fashion.webp";
import womensFashionImage from "../assets/womenFashion.webp";
import beautyImage from "../assets/beauty.webp";
import homeImage from "../assets/living.webp";
import skinCareImage from "../assets/skincare.webp";
import gamingImage from "../assets/gaming.webp";
import accessoriesImage from "../assets/accessories.webp";
import healthImage from "../assets/health.webp";
import fragranceImage from "../assets/fragrance.webp";
import jewelryImage from "../assets/jewelary.webp";

const categories = [
  {
    key: "electronics",
    title: "Electronics",
    image: electronicsImage,
    category: "electronics",
  },
  {
    key: "menFashion",
    title: "Men's Fashion",
    image: menFashionImage,
    category: "men'sFashion",
  },
  {
    key: "womenFashion",
    title: "Women's Fashion",
    image: womensFashionImage,
    category: "women'sFashion",
  },
  {
    key: "beauty",
    title: "Beauty",
    image: beautyImage,
    category: "beauty",
  },
  {
    key: "homeLiving",
    title: "Home",
    image: homeImage,
    category: "home",
  },
  {
    key: "skinCare",
    title: "Skin care",
    image: skinCareImage,
    category: "skinCare",
  },

  // additional categories
  {
    key: "gaming",
    title: "Gaming",
    image: gamingImage,
    category: "gaming",
  },
  {
    key: "accessories",
    title: "Acessories",
    image: accessoriesImage,
    category: "accessories",
  },
  {
    key: "health",
    title: "Health $ Nutrition",
    image: healthImage,
    category: "health",
  },
  {
    key: "jewelry",
    title: "Jewelry",
    image: jewelryImage,
    category: "Jewelry",
  },
  {
    key: "fragrance",
    title: "Fragrance",
    image: fragranceImage,
    category: "fragrance",
  },
];

export default categories;
