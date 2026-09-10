export function validateProduct(formData, options = {}, t) {
    const { requireImage = false, images = [], validateShortDescriptionLength = false } = options;
    const validationErrors = {};

    if (!formData.name.trim()) {
        validationErrors.name = t("products.validation.nameRequired");
    }

    if (!formData.shortDescription.trim()) {
        validationErrors.shortDescription = t("products.validation.shortDescriptionRequired");
    } else if (validateShortDescriptionLength && formData.shortDescription.trim().length < 10) {
        validationErrors.shortDescription = t("products.validation.shortDescriptionMin");
    }

    if (!formData.description.trim()) {
        validationErrors.description = t("products.validation.descriptionRequired");
    } else if (formData.description.trim().length < 20) {
        validationErrors.description = t("products.validation.descriptionMin");
    }

    if (formData.price === "") {
        validationErrors.price = t("products.validation.priceRequired");
    } else if (Number(formData.price) <= 0) {
        validationErrors.price = t("products.validation.priceGreaterThanZero");
    }

    if (formData.discountPrice !== "") {
        if (Number(formData.discountPrice) <= 0) {
            validationErrors.discountPrice = t("products.validation.discountPriceGreaterThanZero");
        } else if (Number(formData.discountPrice) >= Number(formData.price)) {
            validationErrors.discountPrice = t("products.validation.discountPriceLowerThanPrice");
        }
    }

    if (formData.stock === "") {
        validationErrors.stock = t("products.validation.stockRequired");
    } else if (Number(formData.stock) < 0) {
        validationErrors.stock = t("products.validation.stockNotNegative");
    }

    if (!formData.sku.trim()) {
        validationErrors.sku = t("products.validation.skuRequired");
    }

    if (!formData.category.trim()) {
        validationErrors.category = t("products.validation.categoryRequired");
    }

    if (!formData.brand.trim()) {
        validationErrors.brand = t("products.validation.brandRequired");
    }

    if (requireImage && images.length === 0) {
        validationErrors.images = t("products.validation.imageRequired");
    }

    return validationErrors;
}