import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import { MAX_IMAGES } from "./constants";
import { updateProduct } from "@/services/product.service";
import { filterDuplicateFiles } from "./utils/fileUtils";
import { createProductFormData } from "./utils/productFormData";
import { validateProduct } from "./utils/productValidation";

function toFormData(product) {
  return {
    name: product.name || "",
    shortDescription: product.shortDescription || "",
    description: product.description || "",
    price: product.price ?? "",
    discountPrice: product.discountPrice ?? "",
    stock: product.stock ?? "",
    sku: product.sku || "",
    category: product.category || "",
    subcategory: product.subcategory || "",
    brand: product.brand || "",
    tags: product.tags || [],
  };
}

export default function useProductDrawer(product, onUpdated) {
  const { t } = useTranslation();
  const [isEditing, setIsEditing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState(() => (product ? toFormData(product) : {}));
  const [errors, setErrors] = useState({});
  const [images, setImages] = useState((product?.images || []).slice(0, MAX_IMAGES));
  const [newImages, setNewImages] = useState([]);
  const [deletedImages, setDeletedImages] = useState([]);

  useEffect(() => {
    if (!product || isEditing) return undefined;

    queueMicrotask(() => {
      setFormData(toFormData(product));
      setImages((product.images || []).slice(0, MAX_IMAGES));
      setNewImages([]);
      setDeletedImages([]);
      setErrors({});
    });
  }, [product, isEditing]);

  const pristineSnapshot = useMemo(
    () => (product ? JSON.stringify(toFormData(product)) : null),
    [product],
  );

  const isDirty =
    isEditing &&
    pristineSnapshot !== null &&
    (JSON.stringify(formData) !== pristineSnapshot ||
      newImages.length > 0 ||
      deletedImages.length > 0);

  const startEditing = () => {
    setFormData(toFormData(product));
    setImages((product?.images || []).slice(0, MAX_IMAGES));
    setNewImages([]);
    setDeletedImages([]);
    setErrors({});
    setIsEditing(true);
  };

  const cancelEditing = () => {
    setFormData(toFormData(product));
    setImages((product?.images || []).slice(0, MAX_IMAGES));
    setNewImages([]);
    setDeletedImages([]);
    setErrors({});
    setIsEditing(false);
  };

  const handleChange = (event) => {
    const { id, value } = event.target;
    setFormData((current) => ({ ...current, [id]: value }));
  };

  const handleTagsChange = (tags) => {
    setFormData((current) => ({ ...current, tags }));
  };

  const handleImageChange = (event) => {
    const selectedFiles = Array.from(event.target.files || []);

    if (!selectedFiles.length) return;

    const remainingSlots = MAX_IMAGES - (images.length + newImages.length);

    if (remainingSlots <= 0) {
      toast.error(t("products.maxImages", { max: MAX_IMAGES }));
      event.target.value = "";
      return;
    }

    const validFiles = selectedFiles.filter((file) => file.type.startsWith("image/"));
    const dedupedFiles = filterDuplicateFiles(validFiles, [...images, ...newImages]);
    const filesToAdd = dedupedFiles.slice(0, remainingSlots);

    if (!filesToAdd.length) {
      event.target.value = "";
      return;
    }

    setNewImages((current) => [...current, ...filesToAdd]);

    if (validFiles.length > filesToAdd.length || selectedFiles.length > validFiles.length) {
      toast.info(t("products.onlySomeImages", { count: remainingSlots }));
    }

    event.target.value = "";
  };

  const handleDeleteExistingImage = (image) => {
    setDeletedImages((current) =>
      current.includes(image.public_id) ? current : [...current, image.public_id],
    );

    setImages((current) =>
      current.filter((currentImage) => currentImage.public_id !== image.public_id),
    );
  };

  const handleRemoveNewImage = (index) => {
    setNewImages((current) => current.filter((_, imageIndex) => imageIndex !== index));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const validationKeys = validateProduct(formData, { isCreate: false });

    if (Object.keys(validationKeys).length > 0) {
      const validationErrors = {};

      Object.entries(validationKeys).forEach(([field, key]) => {
        validationErrors[field] = t(key);
      });

      setErrors(validationErrors);
      toast.error(t("products.validationNotice"));
      return false;
    }

    setErrors({});
    setIsSubmitting(true);

    try {
      const data = createProductFormData(formData, newImages, deletedImages);
      const response = await updateProduct(product._id, data);
      const updatedProduct = response?.product;

      toast.success(t("products.updated"));
      setIsEditing(false);
      setNewImages([]);
      setDeletedImages([]);

      if (updatedProduct) {
        setImages((updatedProduct.images || []).slice(0, MAX_IMAGES));
        setFormData(toFormData(updatedProduct));
        onUpdated(updatedProduct);
      } else {
        onUpdated({
          ...product,
          ...formData,
          images,
        });
      }

      return true;
    } catch (error) {
      const apiMessage =
        error.response?.data?.message ||
        error.response?.data?.errors?.[0] ||
        "";

      toast.error(apiMessage || t("products.updateFailed"));
      return false;
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    isEditing,
    isSubmitting,
    isDirty,
    formData,
    errors,
    images,
    newImages,
    startEditing,
    cancelEditing,
    handleChange,
    handleTagsChange,
    handleImageChange,
    handleDeleteExistingImage,
    handleRemoveNewImage,
    handleSubmit,
  };
}