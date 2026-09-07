import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export default function ProsCard({ item }) {
  return (
    <div className=" w-full select-none flex items-center cursor-pointer hover:animate-bounce">
      <Alert className="flex flex-col text-center md:text-start md:flex-row md:items-start items-center gap-3">
        <div>{item.icon}</div>
        <div className="capitalize">
          <AlertTitle className="font-bold mb-1">{item.title}</AlertTitle>
          <AlertDescription>{item.desc}</AlertDescription>
        </div>
      </Alert>
    </div>
  );
}
