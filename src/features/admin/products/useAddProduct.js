import { useState } from "react";
import { useNavigate } from "react-router";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import { MAX_IMAGES } from "./constants";
import { createProduct } from "./product.service";
import { createProductFormData } from "./utils/productFormData";
import { validateProduct } from "./utils/productValidation";

const INITIAL_STATE = {
  name: "",
  shortDescription: "",
  description: "",
  price: "",
  discountPrice: "",
  stock: "",
  sku: "",
  category: "",
  subcategory: "",
  brand: "",
  tags: [],
};

export default function useAddProduct() {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const [formData, setFormData] = useState(INITIAL_STATE);
  const [errors, setErrors] = useState({});
  const [images, setImages] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (event) => {
    const { id, value } = event.target;
    setFormData((current) => ({ ...current, [id]: value }));
  };

  const handleTagsChange = (tags) => {
    setFormData((current) => ({ ...current, tags }));
  };

  const handleImageChange = (event) => {
    const selectedFiles = Array.from(event.target.files || []);
    const remainingSlots = MAX_IMAGES - images.length;

    if (remainingSlots <= 0) {
      toast.error(t("products.maxImages"));
      event.target.value = "";
      return;
    }

    const filesToAdd = selectedFiles.slice(0, remainingSlots);
    setImages((current) => [...current, ...filesToAdd]);

    if (selectedFiles.length > remainingSlots) {
      toast.info(t("products.onlySomeImages", { count: remainingSlots }));
    }

    event.target.value = "";
  };

  const removeImage = (index) => {
    setImages((current) => current.filter((_, imageIndex) => imageIndex !== index));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const validationKeys = validateProduct(formData, {
      requireImage: true,
      images,
      isCreate: true,
    });

    if (Object.keys(validationKeys).length > 0) {
      const validationErrors = {};
      Object.entries(validationKeys).forEach(([field, key]) => {
        validationErrors[field] = t(key);
      });
      setErrors(validationErrors);
      toast.error(t("products.validationNotice"));
      return;
    }

    setErrors({});
    setIsSubmitting(true);

    try {
      const data = createProductFormData(formData, images);
      await createProduct(data);
      toast.success(t("products.created"));
      navigate("/admin/products");
    } catch (error) {
      const apiMessage = error.response?.data?.message || "";

      if (apiMessage.includes("sku_1")) {
        toast.error(t("products.skuExists"));
      } else if (apiMessage.includes("name_1")) {
        toast.error(t("products.nameExists"));
      } else {
        toast.error(t("products.createFailed"));
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    formData,
    errors,
    images,
    isSubmitting,
    handleChange,
    handleTagsChange,
    handleImageChange,
    removeImage,
    handleSubmit,
  };
}