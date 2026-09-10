// import { useEffect, useMemo } from "react";

// function ProductImagePreview({ file, alt }) {
//     const previewUrl = useMemo(() => URL.createObjectURL(file), [file]);

//     useEffect(() => {
//         return () => URL.revokeObjectURL(previewUrl);
//     }, [previewUrl]);

//     return <img src={previewUrl} alt={alt} className="h-full w-full object-cover" />;
// }

// export default ProductImagePreview;
import { useEffect, useMemo } from "react";

function ProductImagePreview({ file, alt }) {
    const previewUrl = useMemo(() => {
        if (!file) return "";
        return URL.createObjectURL(file);
    }, [file]);

    useEffect(() => {
        return () => {
            if (previewUrl) {
                URL.revokeObjectURL(previewUrl);
            }
        };
    }, [previewUrl]);

    if (!previewUrl) {
        return null;
    }

    return (
        <img src={previewUrl} alt={alt} className="h-full w-full object-cover" />
    );
}

export default ProductImagePreview;
