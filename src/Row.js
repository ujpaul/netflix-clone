import React, { useState,useEffect } from 'react'
import axios from './axios'
import Youtube from 'react-youtube'
import movieTrailer from 'movie-trailer'
import './Row.css';
const base_url = "https://image.tmdb.org/t/p/original/"
const Row = ({ title,fetchUrl,isLargeRow }) => {
    const [movies, setMovies] = useState([])
    const [trailerUrl, setTrailerUrl] = useState("")
    useEffect(()=>{
      /* the empty [] passed as second parameter of useEffect()
      basically means run once when the row(this component) loads,
      and don't run again(simply run once and stop)
      */
     const fetchData = async () => {
      const request = await axios.get(fetchUrl);
      setMovies(request.data.results);
      return request
     }
     fetchData();
    },[fetchUrl])
    
    const opts = {
      height: "390",
      with: "100%",
      playerVars: {
        autoplay: 1,
      }
    }

    const handleClick = (movie) =>{
      if(trailerUrl){
        setTrailerUrl('');
      }else{
        movieTrailer(movie?.name || "")
        .then(url => {
          const urlParams = new URLSearchParams(new URL(url).search)
          setTrailerUrl(urlParams.get('v'))
        }).catch(error => console.log(error))
      }
    }

  return (
    <div className='row'>
        <h2>{title}</h2>
        <div className="row__posters">
          {movies.map(movie => (
            <img className={`row__poster ${isLargeRow && "row__posterLarge"}`}
             src={`${base_url}${isLargeRow ? movie.backdrop_path : movie.poster_path}`} 
             alt={movie.name} key={movie.id}
             onClick={()=> handleClick(movie)}
             />
          ))}
        </div>
        {trailerUrl && <Youtube videoId={trailerUrl} opts={opts}/>}
    </div>
  )
}

export default Row