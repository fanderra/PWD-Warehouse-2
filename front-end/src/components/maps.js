import React, { useState } from 'react'
import { GoogleMap, useLoadScript, Marker } from '@react-google-maps/api';
import axios from 'axios'
import { Button,FormControl,InputGroup } from "react-bootstrap";
const containerStyle = {
    width: '300px',
    height: '400px', 
    borderRadius:'4px'
};
const center = {
    lat: -6.175110,
    lng: 106.865036
};
// const bandung = {
//     lat: -6.9344694,
//     lng: 107.6049539
// }

function Maps({setUserCordinates=()=>{}}) {
    const [address, setAddress] = useState('')
    const [currentAddress, setCurrentAddress] = useState('')
    const [marker, setMarker] = useState(center)
    const [mapCenter, setMapCenter] = useState(center)
    const { isLoaded, loadError } = useLoadScript({
        // googleMapsApiKey: 'AIzaSyA0DmOm2jH0bvOLSS8orMgqd6brqTMDlOg',
    })
    const handleChange = i => setAddress(i.target.value)
    const handleSearch = async () => {
        if(!address||isNaN(address))return 
        try {
            const { data } = await axios.get(`https://app.zipcodebase.com/api/v1/search?apikey=5a7b8f30-86de-11eb-b29c-a16ee1852846&codes=${address}&country=ID`)
            const results=data.results[address][0]
            const lng = +results.longitude
            const lat = +results.latitude
            const postal_code=results.postal_code
            const city=results.city
            setMarker({ lat, lng})
            setMapCenter({ lat, lng})
            setCurrentAddress(city + ',' + postal_code)
            setAddress('')
            setUserCordinates({ lat, lng,city,postal_code})
        } catch (error) {
            console.log(error.response.data)
        }
    }
    if (loadError) return 'Error loading Maps'
    if (!isLoaded) return 'Loading Maps...'
    return (
        <div style={{padding:'20px',maxWidth:'340px'}}>
            <InputGroup style={{width:'300px'}} className="mb-3">
                <FormControl
                    placeholder="Enter postal code"
                    aria-describedby="basic-addon2"
                    value={address}
                    onChange={handleChange}
                    type='number'
                />
                <InputGroup.Append>
                    <Button onClick={handleSearch} variant="outline-secondary">Search</Button>
                </InputGroup.Append>
            </InputGroup>
                <p>{currentAddress}</p>
            <GoogleMap
                mapContainerStyle={containerStyle}
                center={mapCenter}
                zoom={13}
            >
                <Marker position={marker}/>
            </GoogleMap>
        </div>
    )
}
export default React.memo(Maps)

//# googleapi AIzaSyA0DmOm2jH0bvOLSS8orMgqd6brqTMDlOg
//# poisonapiplace 9c563dc12d8c62d674d480428de2c4ae
//# zipcode 5a7b8f30-86de-11eb-b29c-a16ee1852846
/*
administrative_area: null
confidence: 1
continent: "Asia"
country: "Indonesia"
country_code: "IDN"
county: "Trenggalek"
label: "Depok, Indonesia"
latitude: -8.1878
locality: "Depok"
longitude: 111.4425
name: "Depok"
neighbourhood: null
number: null
postal_code: null
region: "East Java"
region_code: "JI"
street: null
type: "locality"
*/