export function createProductFormData(formData, images = [], deletedImages = []) {
    const data = new FormData();

    data.append("name", formData.name);
    data.append("shortDescription", formData.shortDescription);
    data.append("description", formData.description);
    data.append("price", formData.price);

    if (formData.discountPrice) {
        data.append("discountPrice", formData.discountPrice);
    }

    data.append("stock", formData.stock);
    data.append("sku", formData.sku);
    data.append("category", formData.category);
    data.append("brand", formData.brand);

    //! Tags are sent as a JSON array string because the API expects multipart/form-data.
    // data.append("tags", JSON.stringify(formData.tags || []));

    images.forEach((image) => {
        data.append("images", image);
    });

    if (deletedImages.length > 0) {
        data.append("deletedImages", JSON.stringify(deletedImages));
    }

    return data;
}