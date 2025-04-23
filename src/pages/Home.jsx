import { useState, useEffect } from "react"
import MovieCard from "../components/MovieCard"
import '../css/Home.css'
import { searchMovies, getPopularMovies } from "../services/api"

const Home = () => {

    const [searchQuery, setsearchQuery] = useState("");
    const [movies, setMovies] = useState([]);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => { //avoid re-fecthing the API call
        const loadPopularMovies = async () => {
            try {
                const popularMovies = await getPopularMovies()
                setMovies(popularMovies)
            } catch (err) {
                console.log(err);
                setError("Failed to load the data...")
            }
            finally {
                setLoading(false)
            }
        }

        loadPopularMovies()
    }, [])

    // Manejo de busqueda de peliculas (form)
    const handleSearch = async (e) => {
        e.preventDefault()
        if(!searchQuery.trim()) return
        if (loading) return

        setLoading(true)
        try{
            const searcResults = await searchMovies(searchQuery)
            setMovies(searcResults)
            setError(null)
        } catch(err){
            setError("Failed to search movies :(")
        }   finally{
            setLoading(false)
        }
    };

    return (
        <div className="Home">
            <form onSubmit={handleSearch} className="search-form" action="">
                <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setsearchQuery(e.target.value)}
                    className="search-input" placeholder="Search for a movie!!! " />

                <button type="submit" className="search_button"> Search</button>
            </form>

            {error && (<div className="error-message">{error}... </div>)}

            {loading ? (<div className="loading">Loading... </div>)
                : (<div className="movies-grid">
                    {movies.map((movie) => (
                        <MovieCard movie={movie} key={movie.id} />
                    ))}
                </div>)}

        </div>
    )
}

export default Home