import { useState } from "react";
import { useNavigate } from "react-router";
import { toast } from "react-toastify";
import api from "../../../../api/axios";
import { validateProduct } from "../utils/productValidation";
import { createProductFormData } from "../utils/productFormData";

function useAddProduct() {
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
            toast.error("You can upload a maximum of 5 images.");
            event.target.value = "";
            return;
        }

        const filesToAdd = selectedFiles.slice(0, remainingSlots);

        setImages((currentImages) => [...currentImages, ...filesToAdd]);

        if (selectedFiles.length > remainingSlots) {
            toast.info(`Only ${remainingSlots} image${remainingSlots > 1 ? "s" : ""} can be added.`);
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
            toast.error("Please fix the required fields");
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
            toast.success("Product created successfully");
            navigate("/admin/products");
        } catch (error) {
            console.error("Failed to create product:", error);

            const apiMessage = error.response?.data?.message || "";

            if (apiMessage.includes("sku_1")) {
                toast.error("This SKU already exists. Please enter a different SKU.");
            } else if (apiMessage.includes("name_1")) {
                toast.error("This product name already exists. Please enter a different name.");
            } else {
                toast.error("Failed to create product. Please check your data and try again.");
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