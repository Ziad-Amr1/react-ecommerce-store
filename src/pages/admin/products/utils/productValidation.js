export function validateProduct(formData, options = {}) {
    const { requireImage = false, images = [], validateShortDescriptionLength = false } = options;
    const validationErrors = {};

    if (!formData.name.trim()) {
        validationErrors.name = "Product name is required";
    }

    if (!formData.shortDescription.trim()) {
        validationErrors.shortDescription = "Short description is required";
    } else if (validateShortDescriptionLength && formData.shortDescription.trim().length < 10) {
        validationErrors.shortDescription = "Short description must be at least 10 characters";
    }

    if (!formData.description.trim()) {
        validationErrors.description = "Description is required";
    } else if (formData.description.trim().length < 20) {
        validationErrors.description = "Description must be at least 20 characters";
    }

    if (formData.price === "") {
        validationErrors.price = "Price is required";
    } else if (Number(formData.price) <= 0) {
        validationErrors.price = "Price must be greater than 0";
    }

    if (formData.discountPrice !== "") {
        if (Number(formData.discountPrice) <= 0) {
            validationErrors.discountPrice = "Discount price must be greater than 0";
        } else if (Number(formData.discountPrice) >= Number(formData.price)) {
            validationErrors.discountPrice = "Discount price must be lower than price";
        }
    }

    if (formData.stock === "") {
        validationErrors.stock = "Stock is required";
    } else if (Number(formData.stock) < 0) {
        validationErrors.stock = "Stock cannot be negative";
    }

    if (!formData.sku.trim()) {
        validationErrors.sku = "SKU is required";
    }

    if (!formData.category.trim()) {
        validationErrors.category = "Category is required";
    }

    if (!formData.brand.trim()) {
        validationErrors.brand = "Brand is required";
    }

    if (requireImage && images.length === 0) {
        validationErrors.images = "At least one product image is required";
    }

    return validationErrors;
}