import { Pencil, Mail, Phone } from "lucide-react";

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";

import { Button } from "@/components/ui/button";

import {
  Card,
  CardContent,
} from "@/components/ui/card";

const ProfileHeader = () => {
  return (
    <Card className="border-(--color-border) bg-(--color-surface) shadow-sm">
      <CardContent className="flex flex-col gap-6 p-6 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-col items-center gap-4 sm:flex-row">
          {/* Avatar */}
          <Avatar className="h-24 w-24 border-4 border-(--color-background)">
            <AvatarImage
              src="https://i.pravatar.cc/300?img=47"
              alt="John Doe"
            />

            <AvatarFallback className="bg-(--color-primary) text-lg text-(--color-background)">
              JD
            </AvatarFallback>
          </Avatar>

          {/* User Info */}
          <div className="text-center sm:text-left">
            <h1 className="text-2xl font-bold text-(--color-foreground)">
              John Doe
            </h1>

            <div className="mt-3 space-y-2 text-sm text-(--color-muted)">
              <div className="flex items-center justify-center gap-2 sm:justify-start">
                <Mail size={16} />
                <span>john.doe@example.com</span>
              </div>

              <div className="flex items-center justify-center gap-2 sm:justify-start">
                <Phone size={16} />
                <span>+20 100 123 4567</span>
              </div>
            </div>
          </div>
        </div>

        {/* Edit Button */}
        <Button className="gap-2 bg-(--color-primary) text-(--color-background) hover:opacity-90">
          <Pencil size={17} />
          Edit Profile
        </Button>
      </CardContent>
    </Card>
  );
};

export default ProfileHeader;
