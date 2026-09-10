import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default function UserAvatar({ user }) {
  return (
    <Avatar>
      <AvatarImage
        src="https://github.com/shadcn.png"
        alt="User Avatar Image"
        className="grayscale"
      />
      <AvatarFallback>{user.username[0]}</AvatarFallback>
    </Avatar>
  );
}
