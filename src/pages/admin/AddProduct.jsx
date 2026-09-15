// import ProductPageHeader from "./products/components/ProductPageHeader";
// import AddProductGallery from "./products/components/AddProductGallery";
// import AddProductForm from "./products/components/AddProductForm";
// import useAddProduct from "./products/hooks/useAddProduct";

// function AddProduct() {
//     const {
//         navigate,
//         formData,
//         errors,
//         images,
//         isSubmitting,
//         handleChange,
//         handleImageChange,
//         removeImage,
//         handleSubmit,
//     } = useAddProduct();

//     return (
//         <div className="bg-background p-4 md:p-6">
//             <ProductPageHeader title="Create Product" description="Launch a polished product entry" onBack={() => navigate("/admin/products")} />

// <<<<<<< HEAD
//             <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-6 lg:grid-cols-3"
//             >
//                 {/* images */}
//                 <AddProductGallery images={images} errors={errors} isSubmitting={isSubmitting}
//                     onImageChange={handleImageChange} onRemoveImage={removeImage}
//                 />

//                 {/* Product Info */}
//                 <AddProductForm formData={formData} errors={errors} isSubmitting={isSubmitting}
//                     onChange={handleChange} onCancel={() => navigate("/admin/products")}
//                 />
//             </form>
//         </div>
//     );
// }

// export default AddProduct;
// =======
//       <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-6 lg:grid-cols-3">
//         <AddProductForm
//           formData={formData}
//           errors={errors}
//           isSubmitting={isSubmitting}
//           onChange={handleChange}
//           onTagsChange={handleTagsChange}
//           onCancel={() => navigate("/admin/products")}
//         />

//         <AddProductGallery
//           images={images}
//           errors={errors}
//           isSubmitting={isSubmitting}
//           onImageChange={handleImageChange}
//           onRemoveImage={removeImage}
//         />
//       </form>
//     </div>
//   );
// }
// >>>>>>> d859b48 (W2-03: complete product management)


import ProductPageHeader from "./products/components/ProductPageHeader";
import AddProductGallery from "./products/components/AddProductGallery";
import AddProductForm from "./products/components/AddProductForm";
import useAddProduct from "./products/hooks/useAddProduct";

function AddProduct() {
  const {
    navigate,
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
    <div className="bg-background p-4 md:p-6">
      <ProductPageHeader
        title="Create Product"
        description="Launch a polished product entry"
        onBack={() => navigate("/admin/products")}
      />
      <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* images */}
        <AddProductGallery
          images={images}
          errors={errors}
          isSubmitting={isSubmitting}
          onImageChange={handleImageChange}
          onRemoveImage={removeImage}
        />
        {/* Product Info */}
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

export default AddProduct;