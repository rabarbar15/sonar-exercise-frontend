import { Container, Stack } from 'react-bootstrap'
import { useShoppingCart } from '../context/ShoppingCartContext'
import { PaymentItem } from '../components/PaymentsItem'
import { formatCurrency } from '../utilities/formatCurrency'
import { useFetchBooks, createOrder } from '../data/FetchData'
import { useState, React } from 'react'


interface Book {
  id: number
  quantity: number
}

type Order = {
  id: number,
  name: string,
  books: Book[]
}

const Payment = () => {
  const { cartItems } = useShoppingCart()
  const { books } = useFetchBooks()
  const [name, setName] = useState("")

  const price = cartItems.reduce((total, cartItem) => {
              const item = books.find((item: any) => item.id === cartItem.id)
              return total + (item?.price || 0) * cartItem.quantity
              }, 0)
  const shipment = 500
  const total = price + shipment

  const handleSubmit = async (event: React.SyntheticEvent<HTMLFormElement>) => {
    event.preventDefault()

    const order: Order = {
      id: 0,
      name: name,
      books: cartItems
    }

    try {
      createOrder(order)
    } catch (err) {
      console.error(err)
    }

  }

  return (
    <>
      <h3 className='m-4'>Books selected for purchase</h3>
        {cartItems.length !== 0 ? (<Container 
        className='bg-light m-1 d-flex justify-content-center align-items-center'
        style={{padding: "1rem"}}  
      >
        
        <Stack gap={4} className="border rounded p-4">
          {cartItems.map((item, index) => (
            <React.Fragment key={item.id}>
              <PaymentItem {...item} />
              {index !== cartItems.length - 1 && <hr
              className='my-0' />}
            </React.Fragment>
          ))}
        </Stack>
        
        <Stack 
          className='rounded p-4 m-3 align-items-start'
          style={{ minWidth: "100px", maxWidth: "400px", minHeight: "200px",
            maxHeight: "350px", background: "#f2f2f2" }}  
        >
          <div className='d-flex flex-column fs-5 justify-content-between w-100 align-items-start'>
            <h3>Summary</h3>
            <hr style={{borderColor: "grey", width: "100%"}}/>

            <div className='d-flex justify-content-between w-100 align-items-start fs-6'>
              <p>Products:</p>
              <div>{formatCurrency(price)}</div>
            </div>

            <div className='d-flex justify-content-between w-100 align-items-start fs-6'>
              <p>Shipment:</p>
              <div>{formatCurrency(shipment)}</div>
            </div>

            <div className='d-flex justify-content-between w-100 align-items-start fs-5'>
              <p>Total:</p>
              <div>{formatCurrency(total)}</div>
            </div>
          </div>

          <hr style={{borderColor: "grey", width: "100%"}}/>

          <div className='w-100'>
            <form onSubmit={handleSubmit} className=''>
              <div className="d-flex align-items-center justify-content-between">
                <label className="p-2" htmlFor="name">Name: </label>
                <input type="name" className="form-control" id="name" aria-describedby="emailHelp" placeholder="Jan Kowalski" value={name} onChange={(e) => setName(e.target.value)}  />
                <button type="submit" className="btn btn-danger m-2 btn-lg btn-block">Order</button>
              </div>
            </form>
          </div>
      
        </Stack>
      </Container>) : (
          <h5 className='p-4'>You have no books selected yet :c</h5>
      )}
    </>
  )
}

export default Payment