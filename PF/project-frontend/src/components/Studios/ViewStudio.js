import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Carousel from '../BaseComponents/Carousel';

export default function ViewStudio(props) {

    const [studio, setStudio] = useState(null)

    const [links, setLinks] = useState([])

    const navigate = useNavigate()
    const { state } = useLocation()

    const [subscribed, setSubscribed] = useState(true);
    const [plans, setPlans] = useState([]);
    const [selectedPlan, setSelectedPlan] = useState(null);

    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);

    const [error, setError] = useState(null);


    useEffect(() => {
        
        const getStudioData = async () => {

            const response = await fetch(`${props.baseURL}/studios/details/${state.studioId}/`, {
                method: 'GET',
                headers: {
                    'Content-type': 'application/json',
                    'Authorization': `Bearer ${props.token}`,
                }
            })

            const data = await response.json()

            if (data.success) {
                setStudio(data.data)
            } else {
                navigate('/page-not-found', {state: {message: data.msg}})
            }
        }

        const checkSubs = async () => {
            const response = await fetch(`${props.baseURL}/subscriptions/check_subscription/${state.studioId}/`, {
                method: 'GET',
                headers: {
                    'Content-type': 'application/json',
                    'Authorization': `Bearer ${props.token}`,
                }
            })

            const data = await response.json()

            if (data.status) {
                setSubscribed(data.data)
            } else {
                navigate('/page-not-found', {state: {message: data.reason}})
            }
        }

        const getPlans = async () => {
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
                navigate('/page-not-found', {state: {message: data.reason}})
            }
        }

        const getImages = async () => {
            const response = await fetch(`${props.baseURL}/studios/images/${state.studioId}/`, {
                method: 'GET',
                headers: {
                    'Content-type': 'application/json',
                    'Authorization': `Bearer ${props.token}`,
                }
            })

            const data = await response.json()

            if (data.success) {
                setLinks(data.data.images)
            } else {
                navigate('/page-not-found', {state: {message: data.msg}})
            }
        }

        getStudioData()
        checkSubs()
        getPlans()
        getImages()

    }, [])


    const handleSubscribe = async (id) => {
        if (selectedPlan == null) {
            setError('Please select a plan')
        } else if (startDate == null) {
            setError('Please select a start date')
        } else if (endDate == null) {
            setError('Please select an end date')
        } else {
            
            const response = await fetch(`${props.baseURL}/subscriptions/create/`, {
                method: 'POST',
                headers: {
                    'Content-type': 'application/json',
                    'Authorization': `Bearer ${props.token}`,
                },
                body: JSON.stringify({
                    studio: id,
                    plan: selectedPlan,
                    start_date: startDate,
                    end_date: endDate,
                })
            })

            const data = await response.json()
    
            if (data.status) {
                setSubscribed(true)
                setError('')
            } else {
                setError(data.reason)
            }
        } 
    }
    

    return (
        <div className="flex flex-col items-center p-[2%]">
            {studio && 
            <div className="flex flex-col items-center">
                <h1 className="text-xl">{ studio.name }</h1>
                <h2 className="text-med">{ studio.address }</h2>
                <h2 className="text-small">{ studio.phone_number }</h2>
                {subscribed && 

                    <button className="mt-[5%] bg-orange-600 hover:bg-orange-500 text-white font-bold py-2 px-4 rounded-full" onClick={() => {navigate('/view_classes', {'state': {studioId: state.studioId}})}}>View Classes</button>
                }
                {!subscribed && 
                <div>
                    <div className="flex flex-row items-center p-[2%]">
                        <h2 className='p-[1%] text-xl'>Subscribe to Enroll in classes</h2>
                        <select onChange={(e) => setSelectedPlan(e.target.value)}>
                            <option value={null}>Select plan</option>
                            {plans.map((plan) => {
                                return <option value={plan.id}>{plan.name}</option>
                            })}
                        </select>
                    </div>
                    <div className="flex flex-row items-center p-[2%]">
                        <h2 className='p-[1%] text-xl'>Select the period of subscription. You will be charged monthly in this period.</h2>
                        <div className="flex flex-col items-center p-[1%]">
                        <label name="startDate">Start Date</label>
                        <input 
                            value={startDate}
                            fname="startDate"
                            type='date'
                            class="block border border-grey-light px-5 py-6 rounded mb-4"
                            onChange = {(e) => setStartDate(e.currentTarget.value)}
                            /></div>
                        <div className="flex flex-col items-center p-[1%]">
                        <label name="endDate">End Date</label>
                        <input 
                            value={endDate}
                            fname="endDate"
                            type="date"
                            class="block border border-grey-light px-5 py-6 rounded mb-4"
                            onChange={(e) => setEndDate(e.currentTarget.value)}
                            /></div>
                    </div>
                    <div className="flex flex-col items-center mt-[2%]">
                    <button className="bg-orange-600 hover:bg-orange-500 text-white font-bold py-2 px-4 rounded-full" onClick={() => handleSubscribe(state.studioId)}>Subscribe</button></div>
                    {error && <h2>{error}</h2>}
                </div>
                }

            </div>}
            <h2 className='mt-[2%] text-xl'>View the Studio Images!</h2>
            <Carousel images={links.map(item => `${props.baseURL}/studios${item}`)}/>   
        </div>
    )
}