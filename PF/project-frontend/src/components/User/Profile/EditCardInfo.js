import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

export default function EditCardInfo(props) {

    const navigate = useNavigate()
    const [defaultCardInfo, setDefaultCardInfo] = useState(null);
    const [card, setCard] = useState([]);
    const [cardNumber, setCardNumber] = useState("");
    const [cardName, setCardName] = useState("");
    const [error, setError] = useState('');

    useEffect(() => {
        const getResponse = async () => {
            const response = await fetch(`${props.baseURL}/accounts/userinfo/`, {
                method: 'GET',
                headers: {
                    'Content-type': 'application/json',
                    'Authorization': `Bearer ${props.token}`,
                }
            })

            const data = await response.json()
            console.log(data.data)
            if (data.success) {
                // setDefaultCardInfo(data.data)
                if (data.data.card){
                setCardName(data.data.card.name)
                setCardNumber(data.data.card.number)
                }else{
                    setCardName('')
                    setCardNumber('')
                }
                setCard('card')
            } else {
                navigate('/page-not-found', {state: {message: data.msg}})
            }
        }
        getResponse()
    }, [])

    const handleUpdateCard = async (e) => {
        e.preventDefault()
        if (cardName === null) {
            setError('Please update the card name')
        } else if (cardNumber === null) {
            setError('Please update the card number')
        } else {
            const response = await fetch(`${props.baseURL}/accounts/add_card/`, {
                method: 'POST',
                headers: {
                    'Content-type': 'application/json',
                    'Authorization': `Bearer ${props.token}`,
                },
                body: JSON.stringify({
                    name: cardName,
                    number: cardNumber
                })
            })

            const data = await response.json()

            if (data.status) {
                setCard(data.data)
                setError('')
            } else {
                setError(data.reason)
            }
        }
    }
    
    return (
        <div className="flex flex-col items-center p-[2%]">
        <h2 className='p-[1%] text-xl'>Change the name on the Card and Card Number here.</h2>
        <form onSubmit={(e) => {handleUpdateCard(e)}}>
        <div className="flex flex-col items-center p-[1%]">
        <label name="cardname">Name on Card: </label>
        <input 
            value={cardName}
            fname="cardname"
            type='text'
            class="block border border-grey-light px-5 py-6 rounded mb-4"
            onChange={(e) => setCardName(e.currentTarget.value)}
            /></div>
        <div className="flex flex-col items-center p-[1%]">
        <label name="cardnumber">Card Number: </label>
        <input 
            value={cardNumber}
            fname="cardnumber"
            type="text"
            class="block border border-grey-light px-5 py-6 rounded mb-4"
            onChange={(e) => setCardNumber(e.currentTarget.value)}
            />
            </div>
            <div className="flex flex-col items-center p-[1%]">
        <button
        type="submit"
                  class="bg-orange-600 hover:bg-orange-500 text-white font-bold py-2 px-4 rounded-full"
              >Change Card Info</button></div>
            </form>
        </div>
    )}