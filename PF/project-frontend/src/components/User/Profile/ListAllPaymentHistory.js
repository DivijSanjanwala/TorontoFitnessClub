import {useEffect, useState} from "react";

const ListAllPaymentHistory = (props) => {
    // Default = "all"
    const [payments, setPaymentHistory ] = useState([])
    
    const [page, setPage] = useState(1);
    const [previous, setPrevious] = useState(false);
    const [next, setNext] = useState(false);

    async function getPayments() {
        try {
        
        const response = await fetch(`http://127.0.0.1:8000/subscriptions/paymenthistory/?page=${page}`, {
            method: 'GET',
            headers: {
                'Content-type': 'application/json',
                'Authorization': `Bearer ${props.token}`, // notice the Bearer before your token
            }
        })
        const data  = await response.json();

        setNext(data.next)
        setPrevious(data.prev)
        setPaymentHistory(data.data)
        } catch(error){
            console.log(error.message)
        }
    }

    useEffect( () => {
        getPayments()
    }, [])

    useEffect( () => {
        getPayments()
    }, [page])

    let nextClicked = () => {
        setPage(page + 1)
    }

    let previousClicked = () => {
        setPage(page - 1)
    }

    if (! payments) {
        return(
            <>
            <h1>You haven't made any payments!</h1>
            </>
        )
    } 
        
    return(
        <div>
            <table className="table-auto min-w-full">
            <thead>
                <tr className="border-b">
                    <th className="text-sm font-medium text-gray-900 px-6 py-4 text-left">Plan Name</th>
                    <th className="text-sm font-medium text-gray-900 px-6 py-4 text-left">Payment Time</th>
                    <th className="text-sm font-medium text-gray-900 px-6 py-4 text-left">Card Holder Name</th>
                    <th className="text-sm font-medium text-gray-900 px-6 py-4 text-left">Card Number</th>
                </tr>
            </thead>
            <tbody>
                {payments.map((paymentObject) => (
                    <tr className="border-b">
                        <td className="text-sm font-medium text-gray-900 px-6 py-4 text-left">{ paymentObject.plan_name }</td>
                        <td className="text-sm font-medium text-gray-900 px-6 py-4 text-left"> { paymentObject.payment_time }</td>
                        <td className="text-sm font-medium text-gray-900 px-6 py-4 text-left">{ paymentObject.card_name }</td>
                        <td className="text-sm font-medium text-gray-900 px-6 py-4 text-left">{ paymentObject.card_number }</td>
                    </tr>
                ))}
                </tbody>
            </table>
            <div className="flex flex-row ml-[10%] mr-[10%] gap-[80%] mt-[10%]">
                <button className="bg-orange-600 hover:bg-orange-500 text-white font-bold py-2 px-4 rounded-full" onClick={previousClicked} disabled={!previous}>Previous</button>
                <button className="bg-orange-600 hover:bg-orange-500 text-white font-bold py-2 px-4 rounded-full" onClick={nextClicked} disabled={!next}>Next</button>
            </div>
        </div>
        )
    }


export default ListAllPaymentHistory;