function appendIfPresent(data, key, value) {
  if (value === "" || value == null) {
    return;
  }

  data.append(key, value);
}

export function createProductFormData(formData, images = [], deletedImages = []) {
  const data = new FormData();

  data.append("name", formData.name);
  data.append("shortDescription", formData.shortDescription);
  data.append("description", formData.description);
  data.append("price", formData.price);
  data.append("stock", formData.stock);

  appendIfPresent(data, "discountPrice", formData.discountPrice);
  appendIfPresent(data, "sku", formData.sku);
  appendIfPresent(data, "category", formData.category);
  appendIfPresent(data, "subcategory", formData.subcategory);
  appendIfPresent(data, "brand", formData.brand);

  if (formData.tags?.length > 0) {
    data.append("tags", JSON.stringify(formData.tags));
  }

  images.forEach((image) => {
    data.append("images", image);
  });

  if (deletedImages.length > 0) {
    data.append("deletedImages", JSON.stringify(deletedImages));
  }

  return data;
}