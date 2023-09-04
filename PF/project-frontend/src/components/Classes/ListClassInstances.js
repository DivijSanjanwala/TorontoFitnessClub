import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

export default function ListClasses(props) {
    
        const [classes, setClasses] = useState([])

        const [name, setName] = useState('');
        const [coach, setCoach] = useState('');
        
        const [afterDateTime, setAfterDateTime] = useState('');
        const [beforeDateTime, setBeforeDateTime] = useState('');
        const [date, setDate] = useState('');

        const [page, setPage] = useState(1);
        const [previous, setPrevious] = useState(false);
        const [next, setNext] = useState(false);
        
        const navigate = useNavigate()
        const { state } = useLocation()


        let getClasses = async () => {
            let url = `${props.baseURL}/studios/classes/search/?studio=${state.studioId}&page=${page}&sessions=true`

            url += `&class=${state.classId}`
            url = name !== '' ? url + `&name=${name}` : url
            url = coach !== '' ? url + `&coach=${coach}` : url
            url = afterDateTime !== '' ? url + `&after=${afterDateTime}:00` : url
            url = beforeDateTime !== '' ? url + `&before=${beforeDateTime}:00` : url
            url = date !== '' ? url + `&date=${date}` : url
            
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
            setPage((prev) => prev + 1)
        }
    
        let previousClicked = () => {
            setPage((prev) => prev - 1)
        }
        
        let enroll = async (id) => {
            const response = await fetch(`${props.baseURL}/studios/classes/enroll/session/${id}/`, {
                method: 'GET',
                headers: {
                    'Content-type': 'application/json',
                    'Authorization': `Bearer ${props.token}`,
                }
            })

            const data = await response.json()

            if (data.success) {
                getClasses()
            } else {
                navigate('/page-not-found', {state: {message: data.msg}})
            }
        }

        let unenroll = async (id) => {
            const response = await fetch(`${props.baseURL}/studios/classes/drop/session/${id}/`, {
                method: 'GET',
                headers: {
                    'Content-type': 'application/json',
                    'Authorization': `Bearer ${props.token}`,
                }
            })

            const data = await response.json()

            if (data.success) {
                getClasses()
            } else {
                navigate('/page-not-found', {state: {message: data.msg}})
            }
        }

        useEffect(() => {
            getClasses()
        }, [])

        useEffect(() => {
            getClasses()
        }, [page])

    
        return (
            <div className="flex flex-col items-center p-[1%] gap-[1%]">
                <div className="flex flex-row items-center gap-[1%]">
                <div className="flex flex-col items-center py-[2%]">
                <label name="className">Class Name</label>
                <input 
                    value={name}
                    placeholder="Class Name"
                    fname="className"
                    class="block border border-grey-light px-5 py-6 rounded mb-4"
                    onChange={(e) => 
                    setName(e.currentTarget.value ? e.currentTarget.value : '')}
                    />
                </div>
                <div className="flex flex-col items-center py-[2%]">
                <label name="coachName">Coach/Instructor Name</label>
                <input 
                    value={coach}
                    fname="coachName"
                    placeholder="Coach/Instructor Name"
                    class="block border border-grey-light px-5 py-6 rounded mb-4"
                    onChange={(e) => 
                    setCoach(e.currentTarget.value ? e.currentTarget.value : '')}
                    />
                </div>
                <div className="flex flex-col items-center py-[2%]">
                <label name="dateAfter">Date After</label>
                <input 
                    value={afterDateTime}
                    placeholder="After"
                    fname="dateAfter"
                    type='datetime-local'
                    class="block border border-grey-light px-5 py-6 rounded mb-4"
                    onChange = {(e) => 
                    setAfterDateTime(e.currentTarget.value ? e.currentTarget.value : '')}
                    />
                </div>
                <div className="flex flex-col items-center py-[2%]">
                <label name="dateBefore">Date Before</label>
                <input 
                    value={beforeDateTime}
                    fname="dateBefore"
                    placeholder="Before"
                    type='datetime-local'
                    class="block border border-grey-light px-5 py-6 rounded mb-4"
                    onChange={(e) => 
                    setBeforeDateTime(e.currentTarget.value ? e.currentTarget.value : '')}
                    />
                </div>
                <div className="flex flex-col items-center py-[2%]">
                <label name="onDate">On the Date</label>
                <input 
                    value={date}
                    placeholder="On a Date"
                    fname="onDate"
                    type='datetime-local'
                    class="block border border-grey-light px-5 py-6 rounded mb-4"
                    onChange = {(e) => 
                    setDate(e.currentTarget.value ? e.currentTarget.value : '')}
                    />
                </div>
                <div className="flex flex-row items-center">
                    <button className="bg-orange-600 hover:bg-orange-500 text-white font-bold py-2 px-4 rounded-full" type="button" onClick={getClasses}>Search</button>
                </div>
                </div>
                <table class="table-auto min-w-full">
                    <thead>
                        <tr className="border-b">
                            <th className="text-sm font-medium text-gray-900 px-6 py-4 text-left">Class name</th>
                            <th className="text-sm font-medium text-gray-900 px-6 py-4 text-left">Coach Name</th>
                            <th className="text-sm font-medium text-gray-900 px-6 py-4 text-left">Keywords</th>
                            <th className="text-sm font-medium text-gray-900 px-6 py-4 text-left">Datetime</th>
                            <th className="text-sm font-medium text-gray-900 px-6 py-4 text-left">Navigation</th>
                        </tr>
                    </thead>
                    <tbody>
                        {classes.map((item) =>  
                             (
                                <tr className="border-b">
                                    <td className="text-sm font-medium text-gray-900 px-6 py-4 text-left">{ item.name}</td>
                                    <td className="text-sm font-medium text-gray-900 px-6 py-4 text-left"> { item.coach }</td>
                                    <td className="text-sm font-medium text-gray-900 px-6 py-4 text-left">{ item.keywords }</td>
                                    <td className="text-sm font-medium text-gray-900 px-6 py-4 text-left">{ item.datetime }</td>
                                    <td className="text-sm font-medium text-gray-900 px-6 py-4 text-left">
                                        <div className='flex flex-row items-center gap-2'>
                                            <button className="bg-orange-600 hover:bg-orange-500 text-white font-bold py-2 px-4 rounded-full" disabled={item.enrolled} onClick={() => {enroll(item.id)}}>{item.enrolled ? 'Enrolled' : 'Enroll'}</button>
                                            <button className="bg-orange-600 hover:bg-orange-500 text-white font-bold py-2 px-4 rounded-full" disabled={!item.enrolled} onClick={() => {unenroll(item.id)}}>Unenroll</button>
                                        </div>
                                    </td>
                                </tr>
                            )
                        )}
                    </tbody>
                </table>
                <div className="flex flex-row ml-[10%] mr-[10%] gap-[80%] mt-[10%]">
                <button className="bg-orange-600 hover:bg-orange-500 text-white font-bold py-2 px-4 rounded-full" onClick={previousClicked} disabled={!previous}>Previous</button>
                <button className="bg-orange-600 hover:bg-orange-500 text-white font-bold py-2 px-4 rounded-full" onClick={nextClicked} disabled={!next}>Next</button>
                </div>
            </div>
        )}