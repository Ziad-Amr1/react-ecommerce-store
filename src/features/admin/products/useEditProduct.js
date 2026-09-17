import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import { MAX_IMAGES } from "./constants";
import { getProduct, updateProduct } from "@/services/product.service";
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

function toInitialState(item) {
  return {
    name: item.name || "",
    shortDescription: item.shortDescription || "",
    description: item.description || "",
    price: item.price ?? "",
    discountPrice: item.discountPrice ?? "",
    stock: item.stock ?? "",
    sku: item.sku || "",
    category: item.category || "",
    subcategory: item.subcategory || "",
    brand: item.brand || "",
    tags: item.tags || [],
  };
}

export default function useEditProduct() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { id } = useParams();

  const [product, setProduct] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState(INITIAL_STATE);
  const [errors, setErrors] = useState({});
  const [images, setImages] = useState([]);
  const [newImages, setNewImages] = useState([]);
  const [deletedImages, setDeletedImages] = useState([]);

  const [reloadKey, setReloadKey] = useState(0);
  const controllerRef = useRef(null);

  const fetchProduct = useCallback(() => {
    const controller = new AbortController();
    controllerRef.current?.abort();
    controllerRef.current = controller;

    getProduct(id, controller.signal)
      .then((data) => {
        if (controller.signal.aborted) {
          return;
        }

        const item = data.product;
        setProduct(item);
        setImages(item.images || []);
        setFormData(toInitialState(item));
      })
      .catch((fetchError) => {
        if (!controller.signal.aborted) {
          setError(fetchError);
        }
      })
      .finally(() => {
        if (!controller.signal.aborted) {
          setIsLoading(false);
        }
      });
  }, [id]);

  useEffect(() => {
    fetchProduct();

    return () => controllerRef.current?.abort();
  }, [fetchProduct, reloadKey]);

  const retry = () => {
    setError(null);
    setIsLoading(true);
    setReloadKey((key) => key + 1);
  };

  const pristineSnapshot = useMemo(
    () => (product ? JSON.stringify(toInitialState(product)) : null),
    [product],
  );

  const isDirty =
    pristineSnapshot !== null &&
    (JSON.stringify(formData) !== pristineSnapshot ||
      newImages.length > 0 ||
      deletedImages.length > 0);

  const handleChange = (event) => {
    const { id, value } = event.target;
    setFormData((current) => ({ ...current, [id]: value }));
  };

  const handleTagsChange = (tags) => {
    setFormData((current) => ({ ...current, tags }));
  };

  const handleImageChange = (event) => {
    const selectedFiles = Array.from(event.target.files || []);
    const remainingSlots = MAX_IMAGES - (images.length + newImages.length);

    if (remainingSlots <= 0) {
      toast.error(t("products.maxImages"));
      event.target.value = "";
      return;
    }

    const filesToAdd = selectedFiles.slice(0, remainingSlots);
    setNewImages((current) => [...current, ...filesToAdd]);

    if (selectedFiles.length > remainingSlots) {
      toast.info(t("products.onlySomeImages", { count: remainingSlots }));
    }

    event.target.value = "";
  };

  const handleDeleteExistingImage = (image) => {
    setDeletedImages((current) => [...current, image.public_id]);
    setImages((current) =>
      current.filter(
        (currentImage) => currentImage.public_id !== image.public_id,
      ),
    );
  };

  const handleRemoveNewImage = (index) => {
    setNewImages((current) =>
      current.filter((_, imageIndex) => imageIndex !== index),
    );
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
      return;
    }

    setErrors({});
    setIsSubmitting(true);

    try {
      const data = createProductFormData(formData, newImages, deletedImages);
      await updateProduct(id, data);
      toast.success(t("products.updated"));
      navigate("/admin/products");
    } catch (error) {
      const apiMessage = error.response?.data?.message || "";
      toast.error(apiMessage || t("products.updateFailed"));
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    product,
    isLoading,
    error,
    retry,
    isSubmitting,
    formData,
    errors,
    images,
    newImages,
    isDirty,
    handleChange,
    handleTagsChange,
    handleImageChange,
    handleDeleteExistingImage,
    handleRemoveNewImage,
    handleSubmit,
  };
}
