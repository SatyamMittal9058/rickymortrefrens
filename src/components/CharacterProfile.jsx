import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { useParams} from 'react-router-dom'
import { CharacterAPI } from '../APILINKS';
// Character Profile page
const CharacterProfile = () => {
    const { id } = useParams();
    const [characterDetail, setCharacterDetail] = useState(null);
    const [episodesName, setEpisodesName] = useState([]);
    const [totalEpisodes, setTotalEpisodes] = useState(0);
    const [locationDetail,setLocationsDetail]=useState([]);
    
    // fetching the data of individual character

    const fetchData = async () => {
        try {
            const response = await axios.get(`${CharacterAPI}/${id}`);
            const characterData = response.data;
            const locationsURL= await characterData.location.url;
            const locationData = await axios.get(locationsURL);
            console.log(locationData.data);
            setLocationsDetail(locationData.data);
            setCharacterDetail(characterData);
            setTotalEpisodes(characterData.episode.length);

            // Fetch episodes data
            const episodesData = await Promise.all(
                characterData.episode.map(async (episodeURL) => {
                    try {
                        const episodeResponse = await axios.get(episodeURL);
                        return episodeResponse.data.name;
                    } catch (error) {
                        console.log(error);
                        return 'Episode Not Found';
                    }
                })
            );
            
            setEpisodesName(episodesData);
        } catch (error) {
            console.log(error);
        }
    };
    useEffect(() => {
        fetchData();
    }, []);
    if (!characterDetail) {
        return <div className="shimmer"></div>;
    }

    return (
        <div>
            <div className='profile-container'>
                <img alt="card-profile" src={characterDetail.image} />
                <p>Name: {characterDetail.name} </p>
                <p>Species: {characterDetail.species}</p>
                <p>Gender: {characterDetail.gender}</p>
                <p>Status: {characterDetail.status}</p>
                <p>Origin: {characterDetail.origin.name}</p>
                <p>Total Episodes: {totalEpisodes}</p>
                <div className="list-container">
                    <span className="episode-detail">
                        <p>EpisodesName : Character is Featured</p>
                        <ul>
                            {episodesName.map((episode, index) => (
                                <li key={index}><p>{episode}</p></li>
                            ))}
                        </ul>
                    </span>
                    <span className="location-detail">
                        <p>Current Locations Details</p>
                        <p>Name: {locationDetail.name}</p>
                        <p>Type: {locationDetail.type}</p>
                        <p>Dimension: {locationDetail.dimension}</p>
                        {locationDetail.residents.length>0?<p>Amount of Residents: {locationDetail.residents.length}</p>:<p>Amount of Residents: {locationDetail.residents.length}</p>}
                    </span>
                    
                </div>
            </div>
        </div>
    );
};

export default CharacterProfile;