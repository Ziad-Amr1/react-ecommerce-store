import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import { ShoppingCart, Plus } from "lucide-react";

export default function Cart() {

  const [cart, setCart] = useState(() => {
    const savedCart = localStorage.getItem("cart");

    return savedCart ? JSON.parse(savedCart) : [];
  });

  const [coupon, setCoupon] = useState("");

  const [discount, setDiscount] = useState(0);

  const clearCart = () => {
    setCart([]);
  };

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  const products = [
    {
      id: 1,
      name: "T-Shirt",
      price: 250,
      image: "https://via.placeholder.com/150",
      stock: 5
    },
    {
      id: 2,
      name: "Jeans",
      price: 500,
      image: "https://via.placeholder.com/150",
      stock: 10
    },
    {
      id: 3,
      name: "Sneakers",
      price: 750,
      image: "https://via.placeholder.com/150",
      stock: 3
    },
    {
      id: 4,
      name: "Hoodie",
      price: 400,
      image: "https://via.placeholder.com/150",
      stock: 7
    },
    {
      id: 5,
      name: "Cap",
      price: 150,
      image: "https://via.placeholder.com/150",
      stock: 8
    },
    {
      id: 6,
      name: "Bag",
      price: 600,
      image: "https://via.placeholder.com/150",
      stock: 12
    },
  ];

  // Add Item
  const addToCart = (product) => {
    const existingItem = cart.find((item) => item.id === product.id);

    if (existingItem) {
      updateQuantity(product.id, 1);
    } else {
      setCart([
        ...cart,
        {
          ...product,
          quantity: 1,
        },
      ]);
    }
  };

  // Remove Item
  const removeItem = (id) => {
    setCart(cart.filter((item) => item.id !== id));
  };

  // Increase / Decrease Quantity
  const updateQuantity = (id, change) => {
    setCart(
      cart.map((item) =>
        item.id === id
          ? {
            ...item,
            quantity: Math.min(
              item.quantity + change,
              item.stock
            ),
          }
          : item
      )
    );
  };
  // Apply Coupon
  const applyCoupon = () => {
    if (coupon === "SAVE10") {
      setDiscount(subtotal * 0.1);
    } else {
      setDiscount(0);
    }
  };

  // Calculate Subtotal
  const subtotal = cart.reduce((total, item) => {
    return total + item.price * item.quantity;
  }, 0);

  const tax = (subtotal - discount) * 0.14;

  const shipping = 50;

  // Calculate Total Price
  const totalPrice = subtotal - discount + tax + shipping;

  return (
    <div className="mx-auto max-w-4xl p-5">
      <h1 className="mb-5 text-2xl font-bold">
        Shopping Cart
      </h1>

      {cart.length === 0 ? (
        <Empty>
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <ShoppingCart />
            </EmptyMedia>

            <EmptyTitle>
              Your cart is empty
            </EmptyTitle>

            <EmptyDescription>
              Add some products to your cart.
            </EmptyDescription>
          </EmptyHeader>

          <EmptyContent>
            <Button>
              Continue Shopping
            </Button>
          </EmptyContent>
        </Empty>
      ) : (
        <div className="mb-10">

          {cart.map((item) => (
            <Card
              key={item.id}
              className="mb-4"
            >
              <CardContent className="flex items-center gap-4 p-4">
                <img
                  src={item.image}
                  alt={item.name}
                  className="h-20 w-20 rounded object-cover"
                />

                <div className="flex-1">
                  <h2 className="font-semibold">
                    {item.name}
                  </h2>

                  <p>
                    ${item.price}
                  </p>
                </div>

                <Button
                  onClick={() =>
                    updateQuantity(item.id, -1)
                  }
                >
                  -
                </Button>

                <span>
                  {item.quantity}
                </span>

                <Button
                  onClick={() =>
                    updateQuantity(item.id, 1)
                  }
                >
                  +
                </Button>

                <Button
                  variant="destructive"
                  onClick={() =>
                    removeItem(item.id)
                  }
                >
                  Remove
                </Button>

              </CardContent>
            </Card>
          ))}

          <Button onClick={clearCart} className="mb-3">
            Clear Cart
          </Button>

          <p>
            Subtotal: ${subtotal}
          </p>

          <div className="flex gap-2">
            <input
              value={coupon}
              onChange={(e) =>
                setCoupon(e.target.value)
              }
              placeholder=" Enter coupon"
            />

            <Button onClick={applyCoupon}>
              Apply
            </Button>
          </div>

          <p>
            Discount: ${discount}
          </p>

          <p>Tax: ${tax}</p>


          <p>Shipping: ${shipping}</p>

          <p className="font-bold">
            Total: ${totalPrice}
          </p>

        </div>
      )}

      <div className="mt-10">
        <h2 className="mb-5 text-xl font-bold">
          Available Products
        </h2>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 md:grid-cols-3">

          {products.map((product) => (
            <Card key={product.id}>
              <CardContent className="p-4">

                <img
                  src={product.image}
                  alt={product.name}
                  className="mb-4 h-40 w-full rounded object-cover"
                />

                <h3 className="text-lg font-semibold">
                  {product.name}
                </h3>

                <p className="mb-4 text-muted-foreground">
                  ${product.price}
                </p>

                <Button
                  className="w-full"
                  onClick={() =>
                    addToCart(product)
                  }
                >
                  <Plus size={18} />
                  Add to Cart
                </Button>

              </CardContent>
            </Card>
          ))}

        </div>
      </div>
    </div>
  );
}