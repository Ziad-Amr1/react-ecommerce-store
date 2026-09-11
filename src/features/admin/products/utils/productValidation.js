import {
  MIN_DESCRIPTION_LENGTH,
  MIN_SHORT_DESCRIPTION_LENGTH,
} from "../constants";

// Returns an object mapping field name -> i18n key. Callers translate the keys.
export function validateProduct(formData, options = {}) {
  const { requireImage = false, images = [], isCreate = false } = options;
  const validationErrors = {};

  if (!formData.name?.trim()) {
    validationErrors.name = "products.validation.nameRequired";
  }

  if (!formData.shortDescription?.trim()) {
    validationErrors.shortDescription = "products.validation.shortDescriptionRequired";
  } else if (
    isCreate &&
    formData.shortDescription.trim().length < MIN_SHORT_DESCRIPTION_LENGTH
  ) {
    validationErrors.shortDescription = "products.validation.shortDescriptionMin";
  }

  if (!formData.description?.trim()) {
    validationErrors.description = "products.validation.descriptionRequired";
  } else if (formData.description.trim().length < MIN_DESCRIPTION_LENGTH) {
    validationErrors.description = "products.validation.descriptionMin";
  }

  if (formData.price === "" || formData.price == null) {
    validationErrors.price = "products.validation.priceRequired";
  } else if (!(Number(formData.price) > 0)) {
    validationErrors.price = "products.validation.pricePositive";
  }

  if (formData.discountPrice !== "" && formData.discountPrice != null) {
    if (!(Number(formData.discountPrice) > 0)) {
      validationErrors.discountPrice = "products.validation.discountPricePositive";
    } else if (Number(formData.discountPrice) >= Number(formData.price)) {
      validationErrors.discountPrice = "products.validation.discountPriceLower";
    }
  }

  if (formData.stock === "" || formData.stock == null) {
    validationErrors.stock = "products.validation.stockRequired";
  } else if (Number(formData.stock) < 0) {
    validationErrors.stock = "products.validation.stockNonNegative";
  }

  if (!formData.category?.trim()) {
    validationErrors.category = "products.validation.categoryRequired";
  }

  if (requireImage && images.length === 0) {
    validationErrors.images = "products.validation.imageRequired";
  }

  return validationErrors;
}