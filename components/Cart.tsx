import { useAppSelector } from "@/lib/hooks";
import { Trash2, ShoppingCart } from "lucide-react";
import Image from "next/image";
import { removeItem } from "@/lib/redux/features/cart.slicer";
import { useDispatch } from "react-redux";

export default function Cart() {
  const dispatch = useDispatch();
  const cart = useAppSelector((state) => state.cart.items);

  const handleRemoveItem = (productId: string) => {
    dispatch(removeItem(productId));
  };

  return (
    <div>
      {cart.length === 0 ? (
        <div className="flex flex-col items-center justify-center">
          <ShoppingCart className="w-24 h-24 text-muted-foreground" />
          <p className="text-muted-foreground">Your cart is empty</p>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {cart.map((item) => (
            <div
              key={item.productId}
              className="flex items-center gap-4"
            >
              <div className="relative w-20 h-20">
                <Image src={item.image} alt={item.name} fill className="object-cover rounded-md" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-medium">{item.name}</h3>
                <p className="text-sm text-muted-foreground">
                  {item.quantity} x ${item.price}
                </p>
              </div>
              <button onClick={() => handleRemoveItem(item.productId)}>
                <Trash2 className="w-5 h-5 text-muted-foreground hover:text-destructive" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
