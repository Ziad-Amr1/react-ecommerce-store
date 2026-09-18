import { useTranslation } from "react-i18next";
import { useState } from "react";
import { useNavigate } from "react-router";
import { toast } from "react-toastify";
import api from "../../../../api/axios";
import { validateProduct } from "../utils/productValidation";
import { createProductFormData } from "../utils/productFormData";

function useAddProduct() {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const [errors, setErrors] = useState({});
    const [images, setImages] = useState([]);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const [formData, setFormData] = useState(() => {
        const savedData = localStorage.getItem("addProductForm");

        return savedData ? JSON.parse(savedData)
            : {
                name: "",
                shortDescription: "",
                description: "",
                price: "",
                discountPrice: "",
                stock: "",
                sku: "",
                category: "",
                brand: "",
            };
    });

    const handleChange = (event) => {
        const { id, value } = event.target;

        setFormData((currentData) => {
            const updatedData = { ...currentData, [id]: value };
            localStorage.setItem("addProductForm", JSON.stringify(updatedData));
            return updatedData;
        });
    };

    const handleImageChange = (event) => {
        const selectedFiles = Array.from(event.target.files);
        const remainingSlots = 5 - images.length;

        if (remainingSlots <= 0) {
            toast.error(t("products.maxImagesError"));
            event.target.value = "";
            return;
        }

        const filesToAdd = selectedFiles.slice(0, remainingSlots);

        setImages((currentImages) => [...currentImages, ...filesToAdd]);

        if (selectedFiles.length > remainingSlots) {
            toast.info(
                t("products.imagesAddedInfo", {
                    count: remainingSlots,
                }),
            );
        }

        setErrors((currentErrors) => ({ ...currentErrors, images: "" }));
        event.target.value = "";
    };

    const removeImage = (index) => {
        setImages((currentImages) => currentImages.filter((_, imageIndex) => imageIndex !== index));
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        const validationErrors = validateProduct(formData, {
            requireImage: true,
            images,
            validateShortDescriptionLength: true,
        });

        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            toast.error(t("products.requiredFieldsError"));
            return;
        }

        setErrors({});
        setIsSubmitting(true);

        try {
            const data = createProductFormData(formData, images);

            await api.post("/products", data, {
                headers: { "Content-Type": "multipart/form-data" },
            });

            localStorage.removeItem("addProductForm");
            toast.success(t("products.createSuccess"));
            navigate("/admin/products");
        } catch (error) {
            console.error("Failed to create product:", error);

            const apiMessage = error.response?.data?.message || "";

            if (apiMessage.includes("sku_1")) {
                toast.error(t("products.duplicateSku"));
            } else if (apiMessage.includes("name_1")) {
                toast.error(t("products.duplicateName"));
            } else {
                toast.error(t("products.createError"));
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    return {
        navigate,
        formData,
        errors,
        images,
        isSubmitting,
        handleChange,
        handleImageChange,
        removeImage,
        handleSubmit,
    };
}

export default useAddProduct;