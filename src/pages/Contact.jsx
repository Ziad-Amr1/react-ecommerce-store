import { useState } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import {
  Mail,
  Phone,
  MapPin,
  Clock,
  Send,
  CheckCircle2,
  MessageSquare,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import AccountPageHeader from "@/components/layout/AccountPageHeader";
import SEO from "@/components/SEO/SEO";

const CONTACT_GEO = {
  region: "US-CA",
  placename: "San Francisco, CA",
  position: "37.7749;-122.4194",
};

export default function Contact() {
  const { t } = useTranslation();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) {
      toast.error(t("contact.form.validationError", "Please fill in all required fields."));
      return;
    }

    setIsSubmitting(true);
    // Simulate API submission
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
      toast.success(t("contact.form.successMessage", "Thank you! Your message has been sent."));
    }, 800);
  };

  return (
    <div className="py-8 font-body text-foreground">
      <SEO
        title={t("contact.title", "Contact Us")}
        description={t(
          "contact.description",
          "Have questions or feedback? We would love to hear from you. Get in touch with our support team.",
        )}
        url="/contact"
        geo={CONTACT_GEO}
      />
      <div className="mx-auto max-w-5xl space-y-8">
        <AccountPageHeader
          title={t("contact.title", "Contact Us")}
          description={t(
            "contact.description",
            "Have questions or feedback? We'd love to hear from you. Get in touch with our support team.",
          )}
        />

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-8">
          {/* Contact Form */}
          <Card className="rounded-2xl border bg-card">
            <CardHeader className="border-b bg-muted/20">
              <div className="flex items-center gap-2.5">
                <MessageSquare className="size-5 text-primary" />
                <CardTitle>{t("contact.form.title", "Send Us a Message")}</CardTitle>
              </div>
            </CardHeader>

            <CardContent className="p-6">
              {isSubmitted ? (
                <div className="flex flex-col items-center justify-center p-8 text-center space-y-3">
                  <div className="flex size-14 items-center justify-center rounded-full bg-primary/10 text-primary">
                    <CheckCircle2 className="size-8" />
                  </div>
                  <h3 className="font-display text-xl font-bold">
                    {t("contact.submitted.title", "Message Received!")}
                  </h3>
                  <p className="text-sm text-muted-foreground max-w-sm">
                    {t(
                      "contact.submitted.desc",
                      "Thank you for contacting us. A customer support representative will get back to you within 24 hours.",
                    )}
                  </p>
                  <Button
                    variant="outline"
                    onClick={() => {
                      setIsSubmitted(false);
                      setFormData({ name: "", email: "", subject: "", message: "" });
                    }}
                    className="mt-4 rounded-xl cursor-pointer"
                  >
                    {t("contact.submitted.sendAnother", "Send another message")}
                  </Button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <Label htmlFor="contact-name">
                        {t("contact.form.nameLabel", "Your Name")} *
                      </Label>
                      <Input
                        id="contact-name"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder={t("contact.form.namePlaceholder", "John Doe")}
                        required
                        className="rounded-xl"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <Label htmlFor="contact-email">
                        {t("contact.form.emailLabel", "Email Address")} *
                      </Label>
                      <Input
                        id="contact-email"
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder={t("contact.form.emailPlaceholder", "you@example.com")}
                        required
                        className="rounded-xl"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="contact-subject">
                      {t("contact.form.subjectLabel", "Subject")}
                    </Label>
                    <Input
                      id="contact-subject"
                      value={formData.subject}
                      onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                      placeholder={t("contact.form.subjectPlaceholder", "How can we help you?")}
                      className="rounded-xl"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="contact-message">
                      {t("contact.form.messageLabel", "Message")} *
                    </Label>
                    <Textarea
                      id="contact-message"
                      rows={5}
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      placeholder={t("contact.form.messagePlaceholder", "Write your message here...")}
                      required
                      className="rounded-xl"
                    />
                  </div>

                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full sm:w-auto rounded-xl gap-2 cursor-pointer"
                  >
                    <Send className="size-4" />
                    <span>
                      {isSubmitting
                        ? t("contact.form.submitting", "Sending...")
                        : t("contact.form.submit", "Send Message")}
                    </span>
                  </Button>
                </form>
              )}
            </CardContent>
          </Card>

          {/* Contact Information Sidebar */}
          <div className="space-y-4">
            <Card className="rounded-2xl border bg-card p-5">
              <CardContent className="p-0 flex items-start gap-4">
                <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <Mail className="size-5" />
                </div>
                <div>
                  <h4 className="font-semibold text-sm">
                    {t("contact.info.emailTitle", "Email Support")}
                  </h4>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    support@ecommercestore.com
                  </p>
                  <p className="text-xs text-muted-foreground">
                    response@ecommercestore.com
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="rounded-2xl border bg-card p-5">
              <CardContent className="p-0 flex items-start gap-4">
                <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <Phone className="size-5" />
                </div>
                <div>
                  <h4 className="font-semibold text-sm">
                    {t("contact.info.phoneTitle", "Phone Support")}
                  </h4>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    +1 (800) 123-4567
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Toll-Free Customer Service
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="rounded-2xl border bg-card p-5">
              <CardContent className="p-0 flex items-start gap-4">
                <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <Clock className="size-5" />
                </div>
                <div>
                  <h4 className="font-semibold text-sm">
                    {t("contact.info.hoursTitle", "Business Hours")}
                  </h4>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Mon - Fri: 9:00 AM - 6:00 PM
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Sat - Sun: 10:00 AM - 4:00 PM
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="rounded-2xl border bg-card p-5">
              <CardContent className="p-0 flex items-start gap-4">
                <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <MapPin className="size-5" />
                </div>
                <div>
                  <h4 className="font-semibold text-sm">
                    {t("contact.info.locationTitle", "Headquarters")}
                  </h4>
                  <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">
                    123 Commerce Boulevard, Suite 400<br />
                    San Francisco, CA 94105
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
