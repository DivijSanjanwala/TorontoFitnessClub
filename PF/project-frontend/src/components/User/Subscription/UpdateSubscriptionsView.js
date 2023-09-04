import { useState, useEffect} from "react";
import { useNavigate, useLocation } from 'react-router-dom';

export default function UpdateSubscriptionsView(props) {

    const { state } = useLocation()
    const [plans, setPlans] = useState([]);
    const [defaultPlan, setDefualtPlan] = useState('');
    const [selectedPlan, setSelectedPlan] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        async function getSubscriptionPlans() {
            try {
            
                const response = await fetch(`${props.baseURL}/subscriptions/subscriptionplans/`, {
                    method: 'GET',
                    headers: {
                        'Content-type': 'application/json',
                        'Authorization': `Bearer ${props.token}`,
                    }
                })

                const data = await response.json()

                if (data.status) {
                    setPlans(data.data)
                } else {
                    navigate('/page-not-found', {state: {message: data.msg}})
                }
            } catch(error) {
                console.log(error)
            }
        }
        getSubscriptionPlans();
    }, [])

    useEffect(() => {
        async function getDefaultSubscriptionPlan() {
            try {
                const response = await fetch(`${props.baseURL}/subscriptions/${state.subscription_id}/`, {
                    method: 'GET',
                    headers: {
                        'Content-type': 'application/json',
                        'Authorization': `Bearer ${props.token}`,
                    }
                })

                const data = await response.json()

                if (data.status) {
                    setDefualtPlan(data.data)
                } else {
                    navigate('/page-not-found', {state: {message: data.msg}})
                }
            } catch(error) {
                console.log(error)
            }
        } 
        getDefaultSubscriptionPlan()
    }, [selectedPlan])

    let updateSubscription = async () => {

      try {
        console.log(selectedPlan)
            const response = await fetch(`${props.baseURL}/subscriptions/${state.subscription_id}/update/`,
                {
                    method: "POST",
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${props.token}`,
                    },
                    body: JSON.stringify({
                        plan: selectedPlan,
                    }),
            })


            const data = await response.json()

            if (data.status) {
                setError('')
            } else {
                setError(data.reason)
            }
        } catch(error) {
            console.log(error)
        }
    }

return(
    <div className="flex flex-col items-center p-[2%]">
        <form onSubmit={(e) => {updateSubscription();
                                e.preventDefault()}} >
        <div className="text-xl py-[5%]">
        <h1 className="text-2xl py-[5%]">Enter the Subscription Plan to change</h1>
        <h2 className="text-xl py-[5%]">Your current plan is {defaultPlan.plan_name}</h2></div>
        <div className="flex flex-col items-center">
        <select onChange={(e) => setSelectedPlan(e.target.value)}>
            {plans.map((plan) => {
                return <option value={plan.id}>{plan.name}</option>
            })}
        </select></div>
        <div className="flex flex-col items-center py-[20%]">
        <button className="bg-orange-600 hover:bg-orange-500 text-white font-bold py-2 px-4 rounded-full" type='submit'>Change Subscription Plan</button></div>
        </form>
        {error !== '' && 
        <p>{error}</p>
        }
        {selectedPlan && 
        <h1 className="text-2xl py-[5%]">Your Subscription Plan has been changed to {selectedPlan}</h1>}
    </div>
)}