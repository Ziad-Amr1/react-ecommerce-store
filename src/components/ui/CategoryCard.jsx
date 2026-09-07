import { ArrowRight } from "lucide-react";
function CategoryCard({ category }) {
  return (
    <div className="group relative h-[350px] overflow-hidden rounded-xl select-none cursor-pointer">
      <img
        src={category.image}
        alt="{category.name}"
        className="w-full h-full object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent">
        <div className="absolute p-4 text-[var(--color-surface)] bottom-0 left-0 translate-y-10 group-hover:translate-y-0 duration-300">
          <h3 className="text-lg lg:text-xl font-semibold ">{category.name}</h3>
          <button className="mt-2 flex items-center gap-2">
            Shop Now
            <ArrowRight size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}

export default CategoryCard;
