import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

import GoogleMapReact from 'google-map-react';

import PlaceIcon from '@mui/icons-material/Place';
import StorefrontIcon from '@mui/icons-material/Storefront';

export default function StudioSearch(props) {

    const [studios, setStudios] = useState([])

    const [name, setName] = useState('');
    const [class_name, setClass] = useState('');
    const [coach, setCoach] = useState('');
    const [amentiy, setAmentiy] = useState('');

    const [longitude, setLongitude] = useState(0.0);
    const [latitude, setLatitude] = useState(0.0);

    const [page, setPage] = useState(1);
    const [previous, setPrevious] = useState(false);
    const [next, setNext] = useState(false);

    const navigate = useNavigate()

    const getStudios = async () => {
        let url = `${props.baseURL}/studios/search/closest/${longitude}/${latitude}/`

        url = url + '?'

        url = name !== '' ? url + `&name=${name}` : url
        url = class_name !== '' ? url + `&class_name=${class_name}` : url
        url = coach !== '' ? url + `&coach=${coach}` : url
        url = amentiy !== '' ? url + `&amentiy=${amentiy}` : url

        url = url + `&page=${page}`

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
        setStudios(data.data)
    }

    useEffect(() => {
        getStudios()
    }, [name, class_name, coach, amentiy, longitude, latitude, page])

    useEffect(() => {
        getStudios()
    }, [])

    useEffect(() => {
        navigator.geolocation.getCurrentPosition(function(position) {
            setLatitude(position.coords.latitude);
            setLongitude(position.coords.longitude);
        });
    })

    const MyMarker = ({ text }) => <div onClick={() => console.log('Click on marker!', text)}>
        <PlaceIcon />
        {text}
    </div>;

    const StudioMarker = ({ text }) => <div onClick={() => console.log('Click on marker!', text)}>
    <StorefrontIcon />
    {text}
    </div>;

    let nextClicked = () => {
        setPage(page + 1)
    }

    let previousClicked = () => {
        setPage(page - 1)
    }

    return (
        <div className="flex flex-col items-center p-[2%]">

            <div className="flex flex-row items-center gap-[1%]">
                <div className="flex flex-col items-center py-[2%]">
                    <label name="className">Studio Name</label>
                    <input 
                        value={name}
                        placeholder="Studio Name"
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
                <label name="classname">Class Name</label>
                <input 
                    value={class_name}
                    fname="className"
                    placeholder="Class Name"
                    class="block border border-grey-light px-5 py-6 rounded mb-4"
                    onChange={(e) => 
                        setClass(e.currentTarget.value ? e.currentTarget.value : '')}
                    />
                </div>

                <div className="flex flex-col items-center py-[2%]">
                <label name="amentiyname">Amenity</label>
                <input 
                    value={class_name}
                    fname="amentiyname"
                    placeholder="Amenity Name"
                    class="block border border-grey-light px-5 py-6 rounded mb-4"
                    onChange={(e) => 
                        setAmentiy(e.currentTarget.value ? e.currentTarget.value : '')}
                    />
                </div>
                
                <div className="flex flex-row items-center">
                    <button className="bg-orange-600 hover:bg-orange-500 text-white font-bold py-2 px-4 rounded-full" type="button" onClick={getStudios}>Search</button>
                </div>
                </div>

            <div className='map br4' style={{ height: '50vh', width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center'}} >
                <GoogleMapReact bootstrapURLKeys={{ key: "AIzaSyAgxi5BdUfi8AATGT5h3Ndhh0wpr9DNm9I"}} center={{lat: latitude, lng: longitude}} defaultZoom={12}> 
                    <MyMarker lat={latitude} lng={longitude} text="You"/>     
                    {
                        studios.map((studio) => {
                            return (
                            <StudioMarker lat={studio.latitude} lng={studio.longitude} text={studio.name}/>
                            )
                        })
                    }
                </GoogleMapReact>
            </div>
            <h2 className='p-[1%] text-xl'>Studios in order or proximity!</h2>
            <div className="flex flex-row gap-2">
                    {
                        studios.map((studio) => {
                            return (
                                <div className="flex flex-col items-center" key={studio.id}>
                                    <h3>{studio.name}</h3>
                                    <h5>{studio.address}</h5>
                                    <button className="bg-orange-600 hover:bg-orange-500 text-white font-bold py-2 px-4 rounded-full" onClick={() => {navigate('/view/studio', { state: { studioId: studio.id } }) }}>View Studio</button>
                                </div>
                            )
                        })
                    }
            </div>
            <div className="flex flex-row ml-[10%] mr-[10%] gap-[80%] mt-[10%]">
                <button className="bg-orange-600 hover:bg-orange-500 text-white font-bold py-2 px-4 rounded-full" onClick={previousClicked} disabled={!previous}>Previous</button>
                <button className="bg-orange-600 hover:bg-orange-500 text-white font-bold py-2 px-4 rounded-full" onClick={nextClicked} disabled={!next}>Next</button>
            </div>
        </div>
    )
}