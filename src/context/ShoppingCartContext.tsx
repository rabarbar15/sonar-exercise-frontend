import { ReactNode, createContext, useContext, useEffect, useState, useMemo } from "react";
import { ShoppingCart } from "../components/ShoppingCart";

type ShoppingCartProviderProps =  Readonly<{
    children: ReactNode
}>

type CartItem = {
    id: number
    quantity: number
}

type ShoppingCartContext = {
    getItemQuantity: (id: number) => number
    increaseCartQuantity: (id: number) => void
    decreaseCartQuantity: (id: number) => void
    removeFromCart: (id: number) => void
    openCart: () => void
    closeCart: () => void
    cartQuantity: number
    cartItems: CartItem[]
}


const ShoppingCartContext = createContext({} as
    ShoppingCartContext
)

export function useShoppingCart() {
    return useContext(ShoppingCartContext)
}

export function ShoppingCartProvider( { children }: ShoppingCartProviderProps ) {
    const [cartItems, setCartItems] = useState<CartItem[]>([])
    const [isOpen, setIsOpen] = useState(false)

    const cartQuantity = cartItems.reduce(
        (quantity, item) => item.quantity + quantity,
        0
    )

    const openCart = () => setIsOpen(true)
    const closeCart = () => setIsOpen(false)

    function getItemQuantity(id: number) {
        return cartItems.find(item => item.id === id)?.quantity || 0
    } 

    useEffect(() => {
        console.log(cartItems);
      }, [cartItems])
    

    function increaseCartQuantity(id: number) {
        setCartItems(currItems => {
            if (currItems.find(item => item.id === id) == null) {
                return [...currItems, { id, quantity: 1}]
            } else {
                return currItems.map(item => {
                    if (item.id === id) {
                        return { ...item, quantity: item.quantity + 1}
                    } else {
                        return item
                    }
                })
            }
        })
    }

    function decreaseCartQuantity(id: number) {
        setCartItems(currItems => {
            if (currItems.find(item => item.id === id)?.quantity === 1) {
                return currItems.filter(item => item.id !== id)
            } else {
                return currItems.map(item => {
                    if (item.id === id) {
                        return { ...item, quantity: item.quantity - 1}
                    } else {
                        return item
                    }
                })
            }
        })
    }

    function removeFromCart(id: number) {
        setCartItems(currItems => {
            return currItems.filter(item => item.id !== id)
        })
    }

    const contextValue = useMemo(
        () => ({
          getItemQuantity,
          increaseCartQuantity,
          decreaseCartQuantity,
          removeFromCart,
          toggleCart,
          cartItems,
          cartQuantity,
        }),
        [getItemQuantity, increaseCartQuantity, decreaseCartQuantity, removeFromCart, toggleCart, cartItems, cartQuantity]
      );

    return <ShoppingCartContext.Provider value={contextValue}>
        {children}

        <ShoppingCart isOpen={isOpen}></ShoppingCart>
    </ShoppingCartContext.Provider>
}

