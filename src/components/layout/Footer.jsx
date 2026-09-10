import brandLogo from "/brand-logo.webp";
import {
  FaFacebookF,
  FaYoutube,
  FaLinkedinIn,
  FaTwitter,
} from "react-icons/fa";
import { Phone, Mail, MapPin } from "lucide-react";
import visaImage from "/visa.svg";
import paypalImage from "/paypal.svg";
import mastercardImage from "/mastercard.svg";
import amexImage from "/amex.svg";
import { useTranslation } from "react-i18next";

export default function Footer() {
  const { t } = useTranslation();
  return (
    <section className="w-full bg-[var(--color-secondary)]/10 mx-auto mt-30 ">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 py-10 px-6 sm:px-10 lg:px-12">
        <div className="font-display">
          <img
            src={brandLogo}
            alt="Oversea store logo"
            className="w-[60%] justify-center mx-auto sm:ms-0"
          />
          <div className="flex items-center justify-center sm:justify-start gap-2 py-2">
            <Phone size={18} />
            <p className="text-[var(--color-link)]">+20123456789</p>
          </div>
          <div className="flex items-center justify-center sm:justify-start gap-2 py-2">
            <Mail size={18} />
            <p className="text-[var(--color-link)]">support@oversea.com</p>
          </div>
          <div className="flex items-center justify-center sm:justify-start gap-2 py-2">
            <MapPin size={18} />
            <p className="text-[var(--color-link)]">
              {t("footer.city")}, {t("footer.country")}
            </p>
          </div>
        </div>

        <div className="text-center sm:text-start">
          <h3 className="text-[var(--color-primary)] text-xl font-bold font-display">
            {t("footer.shop")}
          </h3>
          <ul className="flex flex-col gap-3 text-md mt-2 font-body">
            <li>
              <a href="#" className="text-[var(--color-link)]">
                {t("footer.newArrivals")}
              </a>
            </li>
            <li>
              <a href="#" className="text-[var(--color-link)]">
                {t("footer.bestSellers")}
              </a>
            </li>
            <li>
              <a href="#" className="text-[var(--color-link)]">
                {t("footer.categories")}
              </a>
            </li>
            <li>
              <a href="#" className="text-[var(--color-link)]">
                {t("footer.promoCodes")}{" "}
              </a>
            </li>
          </ul>
        </div>

        <div className="text-center sm:text-start">
          <h3 className="text-[var(--color-primary)] text-xl font-bold font-display">
            {t("footer.services")}
          </h3>

          <ul className="flex flex-col gap-3 text-md mt-2 font-body">
            <li>
              <a href="#" className="text-[var(--color-link)]">
                {t("footer.faq")}
              </a>
            </li>
            <li>
              <a href="#" className="text-[var(--color-link)]">
                {t("footer.shippingReturns")}
              </a>
            </li>
            <li>
              <a href="#" className="text-[var(--color-link)]">
                {t("footer.trackOrder")}
              </a>
            </li>
            <li>
              {" "}
              <a href="#" className="text-[var(--color-link)]">
                {t("footer.contactUs")}
              </a>
            </li>
          </ul>
        </div>

        <div className="text-center sm:text-start">
          <h3 className="text-[var(--color-primary)] text-xl font-bold font-display">
            {t("footer.company")}
          </h3>

          <ul className="flex flex-col gap-3 text-md mt-2 font-body">
            <li>
              <a href="#" className="text-[var(--color-link)]">
                {t("footer.aboutUs")}
              </a>
            </li>
            <li>
              <a href="#" className="text-[var(--color-link)]">
                {t("footer.career")}
              </a>
            </li>
            <li>
              <a href="#" className="text-[var(--color-link)]">
                {t("footer.press")}
              </a>
            </li>
            <li>
              <a href="#" className="text-[var(--color-link)]">
                {t("footer.privacyPolicy")}
              </a>
            </li>
          </ul>
        </div>
      </div>
      <hr className=" border-gray-300" />
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 px-6 py-1">
        <p className="text-sm text-[var(--color-text-primary)] p-4 font-body text-center lg:text-start">
          {t("footer.copyrightText")}
        </p>
        <div className="flex gap-6 items-center justify-center lg:justify-start">
          <img src={mastercardImage} alt="master card" className="w-12" />
          <img src={visaImage} alt="visa" className="w-12" />
          <img src={paypalImage} alt="paypal" className="w-12" />
          <img src={amexImage} alt="amex" className="w-12" />
        </div>

        <div className="flex flex-wrap justify-center gap-3 items-center">
          <div className="flex justify-center items-center text-xl size-8 text-[var(--color-secondary)] hover:text-[#1877f2]">
            <FaFacebookF className="cursor-pointer" />
          </div>
          <div className="flex justify-center items-center text-xl size-8 text-[var(--color-secondary)] hover:text-[#ff0000] ">
            <FaYoutube className="cursor-pointer" />
          </div>
          <div className="flex justify-center items-center text-xl size-8 text-[var(--color-secondary)] hover:text-[#0a66c2]">
            <FaLinkedinIn className="cursor-pointer" />
          </div>
          <div className="flex justify-center items-center text-xl size-8 text-[var(--color-secondary)] hover:text-[#1da1f2]">
            <FaTwitter className="cursor-pointer" />
          </div>
        </div>
      </div>
    </section>
  );
}
