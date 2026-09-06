import { ArrowLeft } from "lucide-react";
import { Button } from "../../../../components/ui/button";

function ProductPageHeader({ title, description, onBack }) {
    return (
        <div className="mb-6">
            <Button variant="outline" className="mb-4 cursor-pointer border-border bg-background text-foreground hover:bg-muted" onClick={onBack}>
                <ArrowLeft className="mr-2 h-4 w-4" />Back to Products
            </Button>

            <div>
                <h1 className="font-display text-2xl font-bold text-foreground">{title}</h1>
                <p className="text-sm text-muted-foreground">{description}</p>
            </div>
        </div>
    );
}

export default ProductPageHeader;