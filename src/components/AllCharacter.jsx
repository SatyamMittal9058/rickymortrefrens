import React, { useEffect, useState } from 'react'
import axios from 'axios';
import { CharacterAPI} from '../APILINKS';
import { Link} from 'react-router-dom';

const AllCharacter = () => {
  // these all the are usestate hook that handle the state of valriable
  
  const [originalCharData, setOriginalCharData] = useState([]);
  const [characters, setCharacters] = useState([]);
  const [totalPage, setTotalPage] = useState(0);
  const [currPage, setCurrPage] = useState(1);
  const [searchText, setSearchText] = useState('');
  const [filter, setFilter] = useState({
    status: '',
    location: '',
    episode: '',
    gender: '',
    species: '',
    type: '',
  })

  // it collect all the character data after concatinating
  let allCharacter = [];
  const fetchCharacters = async () => {
    const response = await axios.get(`${CharacterAPI}`);
    const pages = response.data.info.pages;
    setTotalPage(pages);
    let page = 1;
    while (page <= totalPage) {
      const pageData = await axios.get(`${CharacterAPI}?page=${page}`);
      const pageResult = pageData.data.results;
      allCharacter = allCharacter.concat(pageResult);
      page++;
    }

    setCharacters(allCharacter);
    setOriginalCharData(allCharacter);
  }
  // it handle the pagination page on which I click
  const handleClick = (selectedPage) => {
    if (selectedPage >= 0 && selectedPage <= Math.ceil(characters.length / 35) && selectedPage !== currPage) {
      setCurrPage(selectedPage);
    }
  }

  // it handle fetching of episode URL
  const fetchEpisodeName = async (episodeUrl) => {
    try {
      const response = await axios.get(episodeUrl);
      return response.data.name;
    } catch (error) {
      console.error('Error fetching episode:', error);
      return null;
    }
  };

  // it handle the handle filter it filter on given parameter
  const handleFilter = async () => {
    try{
    const filtered = await Promise.all(
      originalCharData.map(async (character) => {
        const results =  await Promise.all(
          Object.entries(filter).map(async ([key, value]) => {
            if (key === 'episode') {
              const episodeNames =  await Promise.all(character.episode.map((episodeUrl) => fetchEpisodeName(episodeUrl)));
              return value === '' || episodeNames.some((episodeName) => episodeName.toLowerCase() === value.toLowerCase());
            } else if (key === 'location') {
              return (
                value === '' ||
                (character[key] && character[key].name.toLowerCase().includes(value.toLowerCase()))
              );
            } else {
              return value === '' || character[key].toLowerCase() === value.toLowerCase();
            }
          })
        );
          // it check all promise have true value
        return results.every(Boolean);
      })
    );
  
    const result = originalCharData.filter((character, index) => filtered[index]);
    setCharacters(result);
    }catch(error){
      console.log(error.message);
    }
  };
  
  // it handle the search operation return new filter array
  const handleSearch = () => {
    const filterData = originalCharData.filter((character) => character.name.toLowerCase().includes(searchText.toLowerCase()));
    setCharacters(filterData);
  }


  // useEFfect initially render and render when totalPage value changes
  useEffect(() => {
    fetchCharacters();
  }, [totalPage])


  return characters.length===0?<h1>Please wait while Loading</h1>:(
    <div>
      <div className="search-bar">
        <input type="text" placeholder="Search by Name" value={searchText} onChange={(e) => setSearchText(e.target.value)} />
        <button onClick={handleSearch}>Search</button>
      </div>
      <div className="filter-form" onSubmit={handleFilter}>
        <label>
          Status:
          <input
            type="text"
            placeholder="status"
            value={filter.status}
            onChange={(e) => setFilter({ ...filter, status: e.target.value })}
          />
        </label>
        <label>
          Location:
          <input
            type="text"
            placeholder="location"
            value={filter.location}
            onChange={(e) => setFilter({ ...filter, location: e.target.value })}
          />
        </label>
        <label>
          Episode:
          <input
            type="text"
            placeholder="episode"
            value={filter.episode}
            onChange={(e) => setFilter({ ...filter, episode: e.target.value })}
          />
        </label>
        <label>
          Gender:
          <input
            type="text"
            placeholder="gender"
            value={filter.gender}
            onChange={(e) => setFilter({ ...filter, gender: e.target.value })}
          />
        </label>
        <label>
          Species:
          <input
            type="text"
            placeholder="species"
            value={filter.species}
            onChange={(e) => setFilter({ ...filter, species: e.target.value })}
          />
        </label>
        <label>
          Type:
          <input
            type="text"
            placeholder="type"
            value={filter.type}
            onChange={(e) => setFilter({ ...filter, type: e.target.value })}
          />
        </label>

      </div>
      <div className="filter-button"><button type="submit" onClick={handleFilter}>Apply Filters</button></div>
      <div className="container">
        <div className="cards-container">
          {characters.slice(currPage * 35 - 35, currPage * 35).map((character) => (
            <div key={character.id} className="cards" >
              <img alt="logo" src={character.image} />
              <Link to={'/characterProfile/' + character.id}> {character.name} </Link>
            </div>
          ))}
        </div>
        <div className="pagination-container">
          <div className="d1">
            <span onClick={() => handleClick(currPage - 1)}>Prev</span>
            {[...Array(Math.ceil(characters.length / 35))].map((character, i) => (
              <span key={i} className="pagination-array" onClick={() => handleClick(i + 1)}>{i + 1}</span>
            ))}
            <span onClick={() => handleClick(currPage + 1)}>Next</span>
          </div>
          <div className="d2">Page {currPage} of {Math.ceil(characters.length / 35)}</div>
        </div>
      </div>
    </div>

  )
}

export default AllCharacter