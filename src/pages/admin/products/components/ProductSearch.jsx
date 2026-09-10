import { useTranslation } from "react-i18next";
import { Input } from "../../../../components/ui/input";
import { Button } from "../../../../components/ui/button";

export default function ProductSearch({ search, handleSearchChange, handleSearch, isFetching }) {
    const { t } = useTranslation();
    
    return (
        <div className="flex w-full flex-1 flex-col gap-3 md:flex-row">
            <div className="relative flex flex-1 gap-2">
                <div className="relative flex-1">
                    <Input value={search} onChange={handleSearchChange} placeholder={t("products.search")} className="h-10"
                        onKeyDown={(event) => {
                            if (event.key === "Enter") {
                                handleSearch();
                            }
                        }}
                    />
                </div>

                <Button className="cursor-pointer bg-primary text-primary-foreground hover:bg-primary-hover" onClick={handleSearch} disabled={isFetching}>{t("products.searchButton")}</Button>
            </div>
        </div>
    );
}