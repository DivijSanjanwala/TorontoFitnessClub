import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

export default function Schedule(props) {
    let navigate = useNavigate()
    const [schedule, setSchedule] = useState([])

    const [page, setPage] = useState(1);
    const [previous, setPrevious] = useState(false);
    const [next, setNext] = useState(false);

    const getSchedule = async () => {
        const response = await fetch(`${props.baseURL}/studios/user/schedule/?page=${page}`, {
            method: 'GET',
            headers: {
                'Content-type': 'application/json',
                'Authorization': `Bearer ${props.token}`,
            }
        })

        const data = await response.json()

        setNext(data.next)
        setPrevious(data.prev)
        setSchedule(data.data)
    }

    useEffect(() => {
        getSchedule()
    }, [])

    useEffect( () => {
        getSchedule()
    }, [page])

    let nextClicked = () => {
        setPage(page + 1)
    }

    let previousClicked = () => {
        setPage(page - 1)
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
            getSchedule()
        } else {
            navigate('/page-not-found', {state: {message: data.msg}})
        }
    }

    return (
        <div>
            <table className="table-auto min-w-full">
                <thead>
                <tr className="border-b">
                        <th scope="col" className="text-sm font-medium text-gray-900 px-6 py-4 text-left">Class</th>
                        <th scope="col" className="text-sm font-medium text-gray-900 px-6 py-4 text-left">Instructor</th>
                        <th scope="col" className="text-sm font-medium text-gray-900 px-6 py-4 text-left">Start Time</th>
                        <th scope="col" className="text-sm font-medium text-gray-900 px-6 py-4 text-left">Navigation</th>
                    </tr>
                </thead>
                <tbody>
                    {schedule.map((item) => (
                        <tr className="border-b" key={item.id}>
                            <td className="text-sm font-medium text-gray-900 px-6 py-4 text-left">{item.name}</td>
                            <td className="text-sm font-medium text-gray-900 px-6 py-4 text-left">{item.coach}</td>
                            <td className="text-sm font-medium text-gray-900 px-6 py-4 text-left">{item.datetime}</td>
                            <td className="text-sm font-medium text-gray-900 px-6 py-4 text-left"><button className="bg-orange-600 hover:bg-orange-500 text-white font-bold py-2 px-4 rounded-full" onClick={() => unenroll(item.id)}>Drop session</button></td>
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