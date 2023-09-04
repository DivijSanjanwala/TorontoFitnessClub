import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

export default function ListClasses(props) {
    
        const [classes, setClasses] = useState([])

        const [name, setName] = useState('');
        const [coach, setCoach] = useState('');
        
        const navigate = useNavigate()
        const { state } = useLocation()

        const [changed, setChanged] = useState(false);

        const [page, setPage] = useState(1);
        const [previous, setPrevious] = useState(false);
        const [next, setNext] = useState(false);


        let getClasses = async () => {
            let url = `${props.baseURL}/studios/classes/search/?studio=${state.studioId}&page=${page}`

            url = name !== '' ? url + `&name=${name}` : url
            url = coach !== '' ? url + `&coach=${coach}` : url
            
            const response = await fetch(url, {
                method: 'GET',
                headers: {
                    'Content-type': 'application/json',
                    'Authorization': `Bearer ${props.token}`,
                }
            })

            const data = await response.json()

            setNext(data.next)
            setPrevious(data.prev)
            setClasses(data.data)
        }  

        let nextClicked = () => {
            setPage(page + 1)
        }
    
        let previousClicked = () => {
            setPage(page - 1)
        }
        
        let enroll = async (id) => {
            const response = await fetch(`${props.baseURL}/studios/classes/enroll/${id}/`, {
                method: 'GET',
                headers: {
                    'Content-type': 'application/json',
                    'Authorization': `Bearer ${props.token}`,
                }
            })

            const data = await response.json()

            if (data.success) {
                getClasses()
                setChanged((prev) => !prev)
            } else {
                navigate('/page-not-found', {state: {message: data.msg}})
            }
        }

        let unenroll = async (id) => {
            const response = await fetch(`${props.baseURL}/studios/classes/drop/${id}/`, {
                method: 'GET',
                headers: {
                    'Content-type': 'application/json',
                    'Authorization': `Bearer ${props.token}`,
                }
            })

            const data = await response.json()

            if (data.success) {
                getClasses()
                setChanged((prev) => !prev)
            } else {
                navigate('/page-not-found', {state: {message: data.msg}})
            }
        }

        useEffect(() => {
            getClasses()
        }, [page])

        useEffect(() => {
            getClasses()
        }, [])
    
        return (
            <div className="flex flex-col items-center gap-[1%] p-[2%]">
                <input 
                    value={name}
                    placeholder="Class Name"
                    class="block border border-grey-light px-5 py-6 rounded mb-4"
                    onChange={(e) => 
                    setName(e.currentTarget.value ? e.currentTarget.value : '')}/>
                <input 
                    value={coach}
                    placeholder="Coach/Instructor Name"
                    class="block border border-grey-light px-5 py-6 rounded mb-4"
                    onChange={(e) => 
                    setCoach(e.currentTarget.value ? e.currentTarget.value : '')}/>
                <button className="bg-orange-600 hover:bg-orange-500 text-white font-bold py-2 px-4 rounded-full" type="button" onClick={getClasses}>Search</button>
                <table class="table-auto min-w-full p-[1%]">
                    <thead>
                        <tr className="border-b">
                            <th className="text-sm font-medium text-gray-900 px-6 py-4 text-left">Class name</th>
                            <th className="text-sm font-medium text-gray-900 px-6 py-4 text-left">Coach Name</th>
                            <th className="text-sm font-medium text-gray-900 px-6 py-4 text-left">Keywords</th>
                            <th className="text-sm font-medium text-gray-900 px-6 py-4 text-left">Navigation</th>
                        </tr>
                    </thead>
                    <tbody>
                        {classes.map((item) => (
                            <tr className="border-b">
                                <td className="text-sm font-medium text-gray-900 px-6 py-4 text-left">{ item.name}</td>
                                <td className="text-sm font-medium text-gray-900 px-6 py-4 text-left"> { item.coach }</td>
                                <td className="text-sm font-medium text-gray-900 px-6 py-4 text-left">{ item.keywords }</td>
                                <td className="text-sm font-medium text-gray-900 px-6 py-4 text-left">
                                    <div className='flex flex-row items-center gap-2'>
                                        <button className="bg-orange-600 hover:bg-orange-500 text-white font-bold py-2 px-4 rounded-full" disabled={item.enrolled} onClick={() => {enroll(item.id)}}>{item.enrolled ? 'Enrolled' : 'Enroll'}</button>
                                        <button className="bg-orange-600 hover:bg-orange-500 text-white font-bold py-2 px-4 rounded-full" disabled={!item.enrolled} onClick={() => {unenroll(item.id)}}>Unenroll</button>
                                        <button className="bg-orange-600 hover:bg-orange-500 text-white font-bold py-2 px-4 rounded-full" onClick={() => navigate('/view/sessions', {'state': {studioId: state.studioId, classId: item.id}})}>Upcoming Sessions</button>
                                    </div>
                                </td>
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