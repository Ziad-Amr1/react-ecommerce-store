import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent
} from "@/components/ui/card";
import { Search, User, ShoppingBag, Package, Users, DollarSign, Clock, CircleCheck, Menu } from "lucide-react";
import {
  Badge
} from "@/components/ui/badge";

const cardList = [
  {
    id: 1,
    cardTitle: "Total Orders",
    cardDescription: "All orders received",
    cardNumber: 169,
    cardColor: "green",
    cardIcon: ShoppingBag,
  },
  {
    id: 2,
    cardTitle: "Total Products",
    cardDescription: "All products in store",
    cardNumber: 86,
    cardColor: "blue",
    cardIcon: Package,
  },
  {
    id: 3,
    cardTitle: "Total Users",
    cardDescription: "Registered customers",
    cardNumber: 1240,
    cardColor: "purple",
    cardIcon: Users,
  },
  {
    id: 4,
    cardTitle: "Total Revenue",
    cardDescription: "Total sales revenue",
    cardNumber: "$24,680",
    cardColor: "yellow",
    cardIcon: DollarSign,
  },
  {
    id: 5,
    cardTitle: "Pending Orders",
    cardDescription: "Orders waiting to process",
    cardNumber: 24,
    cardColor: "orange",
    cardIcon: Clock,
  },
  {
    id: 6,
    cardTitle: "Completed Orders",
    cardDescription: "Successfully delivered",
    cardNumber: 145,
    cardColor: "emerald",
    cardIcon: CircleCheck,
  },
];

export default function Dashboard() {
  return (
    <div className="p-6 w-full space-y-6">
      <Card>
        <CardHeader>
          <span className="text-lg text-(--color-text-primary)">
            Admin overview
          </span>
          <CardTitle>
            Real-time commerce health
          </CardTitle>
          <CardDescription>
            Monitor your storefront with AI-style clarity and live API metrics.
          </CardDescription>
        </CardHeader>
      </Card>

      <div className="grid grid-cols-3 gap-6">
        {cardList.map((card) => {

          const Icon = card.cardIcon;

          return (
            <Card key={card.id}>
              <CardHeader>
                <CardTitle className="text-xlg">{card.CardTitle}</CardTitle>
                <CardDescription>{card.cardDescription}</CardDescription>
              </CardHeader>

              <CardContent>
                <h2 className="text-lg">{card.cardNumber}</h2>
                <Badge className="w-12 h-12 rounded-xl flex items-center justify-center mt-2">
                  <Icon size={28} />
                </Badge>
              </CardContent>
            </Card>
          )
        }

        )}
      </div>
    </div>

  );
}