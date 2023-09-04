import {useEffect, useState} from "react";
import { useNavigate } from 'react-router-dom';

const ListAllSubscriptionsView = (props) => {
    // Default = "all"
    const [subscriptions, setSubscriptions] = useState([])
    const [changed, setChanged]= useState(false)
    const navigate = useNavigate();

    const [page, setPage] = useState(1);
    const [previous, setPrevious] = useState(false);
    const [next, setNext] = useState(false);

    async function getSubscriptions() {
        try {

            const response = await fetch(`http://127.0.0.1:8000/subscriptions/all/?page=${page}`, {
                method: 'GET',
                headers: {
                    'Content-type': 'application/json',
                    'Authorization': `Bearer ${props.token}`, // notice the Bearer before your token
                }
            })
            
            const data = await response.json()
    
            setNext(data.next)
            setPrevious(data.prev)
            setSubscriptions(data.data)
            
        } catch(error) {
            console.log(error)
        }
    }

    let nextClicked = () => {
        setPage(page + 1)
    }

    let previousClicked = () => {
        setPage(page - 1)
    }

    useEffect(() => {
        getSubscriptions();
    }, [changed, page]) 
    // When "changed" changes, use effect is called.

    let cancelSubscription = async (id) => {
        const response = await fetch(`${props.baseURL}/subscriptions/${id}/cancel/`, {
            method: 'POST',
            headers: {
                'Content-type': 'application/json',
                'Authorization': `Bearer ${props.token}`,
            }
        })

        const data = await response.json()
        console.log(data)

        if (data.status) {
            setChanged(!changed)
        } else {
            console.log('page not found cancelSubscriptions()')
            navigate('/page-not-found', {state: {message: data.msg}})
        }
    }
    
    return(
        <div class="flex flex-col h-screen">
        {subscriptions.length !== 0 &&
        <div>
            <table class="table-auto min-w-full">
            <thead>
                <tr className="border-b">
                    <th class="text-sm font-medium text-gray-900 px-6 py-4 text-left">Studio</th>
                    <th class="text-sm font-medium text-gray-900 px-6 py-4 text-left">User Name</th>
                    <th className="text-sm font-medium text-gray-900 px-6 py-4 text-left">Subscription Plan Registered</th>
                    <th className="text-sm font-medium text-gray-900 px-6 py-4 text-left">Start Date</th>
                    <th className="text-sm font-medium text-gray-900 px-6 py-4 text-left">End Date</th>
                    <th className="text-sm font-medium text-gray-900 px-6 py-4 text-left">Payment Time</th>
                    <th className="text-sm font-medium text-gray-900 px-6 py-4 text-left">Card Name</th>
                    <th className="text-sm font-medium text-gray-900 px-6 py-4 text-left">Card Number</th>
                </tr>
            </thead>
            <tbody>
            {subscriptions.map((subscription) => (
                
                <tr className="border-b" key={subscription.id}>
                    <td className="text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap">{ subscription.studio }</td>
                    <td className="text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap">{ subscription.user }</td>
                    <td className="text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap">{ subscription.plan }</td>
                    <td className="text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap">{ subscription.start_date }</td>
                    <td className="text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap">{ subscription.end_date }</td>
                    <td className="text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap">{ subscription.payment_time }</td>
                    <td className="text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap">{ subscription.card_name }</td>
                    <td className="text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap">{ subscription.card_number }</td>
                    <td><button className="bg-orange-600 hover:bg-orange-500 text-white font-bold py-2 px-4 rounded-full" onClick={() =>
                        {cancelSubscription(subscription.id)}}>
                            Cancel Subscription</button></td>
                    <td>
                        <button className="bg-orange-600 hover:bg-orange-500 text-white font-bold py-2 px-4 rounded-full" onClick={() => 
                            {navigate(`/view/studio`,
                            {
                                'state': {
                                    'studioId': subscription.studio
                            }}
                            )}}>
                                View Studio</button>
                    </td>
                    <td>
                        <button class="bg-orange-600 hover:bg-orange-500 text-white font-bold py-2 px-4 rounded-full" onClick={() => 
                            {
                                navigate(`/subscriptions/update`, 
                                {
                                    'state': {
                                        'subscription_id': subscription.id
                                }}
                                )
                            }
                        }>Update Subscription</button>
                    </td>
                </tr>
            ))}
            </tbody>
        </table>
        <div className="flex flex-row ml-[10%] mr-[10%] gap-[80%] mt-[10%]">
            <button className="bg-orange-600 hover:bg-orange-500 text-white font-bold py-2 px-4 rounded-full" onClick={previousClicked} disabled={!previous}>Previous</button>
            <button className="bg-orange-600 hover:bg-orange-500 text-white font-bold py-2 px-4 rounded-full" onClick={nextClicked} disabled={!next}>Next</button>
        </div>
    </div>}
    {subscriptions.length === 0 &&
    <h1>You do not have any subcriptions!</h1>
    }
    </div> 
    )
}

export default ListAllSubscriptionsView;