import { useTranslation } from "react-i18next"; 
import { useEffect, useState } from "react"; 
import { useNavigate, useParams } from "react-router"; 
import { toast } from "react-toastify"; 
import api from "../../../../api/axios"; 
import { validateProduct } from "../utils/productValidation"; 
import { createProductFormData } from "../utils/productFormData"; 
 
function useEditProduct() { 
    const { t } = useTranslation(); 
    const navigate = useNavigate(); 
    const { id } = useParams(); 
 
    const [product, setProduct] = useState(null); 
    const [isLoading, setIsLoading] = useState(true); 
    const [error, setError] = useState(null); 
    const [isSubmitting, setIsSubmitting] = useState(false); 
    const [images, setImages] = useState([]); 
    const [newImages, setNewImages] = useState([]); 
    const [deletedImages, setDeletedImages] = useState([]); 
    const [errors, setErrors] = useState({}); 
 
    const [formData, setFormData] = useState({ 
        name: "", 
        shortDescription: "", 
        description: "", 
        price: "", 
        discountPrice: "", 
        stock: "", 
        sku: "", 
        category: "", 
        brand: "", 
        // tags: [], 
    }); 
 
    const [initialData, setInitialData] = useState(null); 
 
    const isDirty = initialData !== null && (JSON.stringify(formData) !== JSON.stringify(initialData) || 
        newImages.length > 0 || deletedImages.length > 0); 
 
    useEffect(() => { 
        const fetchProduct = async () => { 
            setIsLoading(true); 
            setError(null); 
 
            try { 
                const response = await api.get(`/products/${id}`); 
                const productData = response.data.product; 
 
                setProduct(productData); 
                setImages(productData.images || []); 
 
                const productFormData = { 
                    name: productData.name || "", 
                    shortDescription: productData.shortDescription || "", 
                    description: productData.description || "", 
                    price: productData.price ?? "", 
                    discountPrice: productData.discountPrice ?? "", 
                    stock: productData.stock ?? "", 
                    sku: productData.sku || "", 
                    category: productData.category || "", 
                    brand: productData.brand || "", 
 
                    //! Initialize tags from the existing product so they can be edited. 
                    // tags: productData.tags || [], 
                }; 
 
                setFormData(productFormData); 
                setInitialData(productFormData); 
            } catch (error) { 
                console.error("Failed to load product:", error); 
                setError(t("products.loadProductError")); 
            } finally { 
                setIsLoading(false); 
            } 
        }; 
 
        fetchProduct(); 
    }, [id, t]); 
 
    const handleChange = (event) => { 
        const { id, value } = event.target; 
 
        setFormData((currentData) => ({ 
            ...currentData, 
            [id]: value, 
        })); 
 
        setErrors((currentErrors) => { 
            if (!currentErrors[id]) return currentErrors; 
 
            const updatedErrors = { ...currentErrors }; 
            delete updatedErrors[id]; 
 
            return updatedErrors; 
        }); 
    }; 
 
    //! Update the product tags when tags are added or removed. 
    // const handleTagsChange = (tags) => { 
    //     setFormData((currentData) => ({ 
    //         ...currentData, 
    //         tags, 
    //     })); 
    // }; 
 
    const handleImageChange = (event) => { 
        const selectedFiles = Array.from(event.target.files); 
        const totalImages = images.length + newImages.length; 
        const remainingSlots = 5 - totalImages; 
 
        if (remainingSlots <= 0) { 
            toast.error(t("products.maxImagesError")); 
            event.target.value = ""; 
            return; 
        } 
 
        const filesToAdd = selectedFiles.slice(0, remainingSlots); 
 
        setNewImages((currentImages) => [...currentImages, ...filesToAdd]); 
 
        if (selectedFiles.length > remainingSlots) { 
            toast.info( 
                t("products.imagesAddedInfo", { 
                    count: remainingSlots, 
                }), 
            ); 
        } 
 
        event.target.value = ""; 
    }; 
 
    const handleDeleteExistingImage = (image) => { 
        setDeletedImages((currentDeleted) => [...currentDeleted, image.public_id]); 
        setImages((currentImages) => currentImages.filter((currentImage) => currentImage.public_id !== image.public_id)); 
    }; 
 
    const handleRemoveNewImage = (index) => { 
        setNewImages((currentImages) => currentImages.filter((_, imageIndex) => imageIndex !== index)); 
    }; 
 
    const handleSubmit = async (event) => { 
        event.preventDefault(); 
 
        const validationErrors = validateProduct(formData, {}, t); 
 
        if (Object.keys(validationErrors).length > 0) { 
            setErrors(validationErrors); 
            toast.error(t("products.requiredFieldsError")); 
            return; 
        } 
 
        setErrors({}); 
        setIsSubmitting(true); 
 
        try { 
            const data = createProductFormData(formData, newImages, deletedImages); 
 
            await api.patch(`/products/update/${id}`, data, { 
                headers: { "Content-Type": "multipart/form-data" }, 
            }); 
 
            toast.success(t("products.updateSuccess")); 
            navigate("/admin/products"); 
        } catch (error) { 
            console.error("Failed to update product:", error); 
 
            const apiMessage = error.response?.data?.message || ""; 
 
            if (apiMessage.includes("E11000") || apiMessage.includes("duplicate key")) { 
                toast.error(t("products.duplicateUpdateName")); 
            } else { 
                toast.error(apiMessage || t("products.updateError")); 
            } 
        } finally { 
            setIsSubmitting(false); 
        } 
    }; 
 
    return { 
        navigate, 
        product, 
        isLoading, 
        error, 
        isSubmitting, 
        images, 
        newImages, 
        errors, 
        formData, 
        isDirty, 
        handleChange, 
        // handleTagsChange, 
        handleImageChange, 
        handleDeleteExistingImage, 
        handleRemoveNewImage, 
        handleSubmit, 
    }; 
} 
 
export default useEditProduct; 