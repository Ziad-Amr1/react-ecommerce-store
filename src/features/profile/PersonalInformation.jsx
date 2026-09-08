import {
  User,
  Mail,
  Phone,
  Calendar,
} from "lucide-react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const information = [
  {
    label: "Full Name",
    value: "John Doe",
    icon: User,
  },
  {
    label: "Email Address",
    value: "john.doe@example.com",
    icon: Mail,
  },
  {
    label: "Phone Number",
    value: "+20 100 123 4567",
    icon: Phone,
  },
  {
    label: "Date of Birth",
    value: "January 15, 1995",
    icon: Calendar,
  },
];

const PersonalInformation = () => {
  return (
    <Card className="border-(--color-border) bg-(--color-surface) shadow-sm">
      <CardHeader>
        <CardTitle className="text-xl text-(--color-foreground)">
          Personal Information
        </CardTitle>

        <CardDescription className="text-(--color-muted)">
          Manage and review your personal account information.
        </CardDescription>
      </CardHeader>

      <CardContent>
        <div className="grid gap-4 sm:grid-cols-2">
          {information.map((item) => {
            const Icon = item.icon;

            return (
              <div
                key={item.label}
                className="flex items-center gap-4 rounded-xl border border-(--color-border) bg-(--color-background) p-4"
              >
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-(--color-secondary) text-(--color-primary)">
                  <Icon size={19} />
                </div>

                <div className="min-w-0">
                  <p className="text-sm text-(--color-muted)">
                    {item.label}
                  </p>

                  <p className="mt-1 truncate font-medium text-(--color-foreground)">
                    {item.value}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};

export default PersonalInformation;
