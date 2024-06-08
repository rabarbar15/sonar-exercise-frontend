import { Button, Stack } from "react-bootstrap"
import { useShoppingCart } from "../context/ShoppingCartContext"
import { formatCurrency } from "../utilities/formatCurrency"
import { useFetchBooks } from "../data/FetchData"

type CartItemProps = {
    id: number
    quantity: number
}

export function CartItem({ id, quantity }: CartItemProps) {
    const { removeFromCart } = useShoppingCart()
    const { books } = useFetchBooks()

    const item = books.find((book: any) => book.id === id)
    if (item == null) return null

    return (
        <Stack direction="horizontal" gap={2} className="d-flex align-items-center">
            {/* <img 
                className="rounded"
                src={item.imgUrl} 
                style={{ width: "105px", height: "140px", objectFit: "cover"}} 
            /> */}

             <div className="me-auto">
                <div>
                    {item.name} <span className="text-muted" style={{ fontSize: "0.65rem" }}>x{quantity}</span>
                </div>

                <div className="text-muted" style={{ fontSize: ".75rem" }}>
                    {formatCurrency(item.price)}
                </div>
             </div>

             <div> {formatCurrency(item.price * quantity)}</div>

             <Button variant="outline-danger" size="sm" onClick={() => {
                removeFromCart(item.id)
             }}>&times;</Button>
        </Stack>
    )
}