import { useNavigate } from "react-router";
import useAddProduct from "@/features/admin/products/useAddProduct";
import ProductPageHeader from "@/features/admin/products/components/ProductPageHeader";
import AddProductForm from "@/features/admin/products/components/AddProductForm";
import AddProductGallery from "@/features/admin/products/components/AddProductGallery";

export default function AddProduct() {
  const navigate = useNavigate();
  const {
    formData,
    errors,
    images,
    isSubmitting,
    handleChange,
    handleTagsChange,
    handleImageChange,
    removeImage,
    handleSubmit,
  } = useAddProduct();

  return (
    <div>
      <ProductPageHeader
        titleKey="products.addTitle"
        descriptionKey="products.addDescription"
        onBack={() => navigate("/admin/products")}
      />

      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 gap-6 lg:grid-cols-3"
      >
        <AddProductGallery
          images={images}
          errors={errors}
          isSubmitting={isSubmitting}
          onImageChange={handleImageChange}
          onRemoveImage={removeImage}
        />

        <AddProductForm
          formData={formData}
          errors={errors}
          isSubmitting={isSubmitting}
          onChange={handleChange}
          onTagsChange={handleTagsChange}
          onCancel={() => navigate("/admin/products")}
        />
      </form>
    </div>
  );
}