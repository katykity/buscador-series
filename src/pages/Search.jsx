import { useState, useEffect } from 'react';
import axios from 'axios';
import SearchForm from '../components/SearchForm';
import SeriesList from '../components/SeriesList';

function Search() {
  const [series, setSeries] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searched, setSearched] = useState(false);

  // ejemplos precargados
  const preloadedSeries = [
    { name: 'Breaking Bad', id: 169 },
    { name: 'Game of Thrones', id: 2 },
    { name: 'Stranger Things', id: 2993 },
  ];

  useEffect(() => {
    const seriesPrecargadas = async () => {
      try {
        const seriesData = await Promise.all(
          preloadedSeries.map(async (serie) => {
            const response = await axios.get(
              `https://api.tvmaze.com/shows/${serie.id}`,
            );
            return response.data;
          }),
        );
        setSeries(seriesData);
      } catch (err) {
        console.error('Error cargando series:', err);
      }
    };

    seriesPrecargadas();
  }, []);

  const handleSearch = async (query) => {
    setLoading(true);
    setError(null);
    setSearched(true);

    try {
      const response = await axios.get(
        `https://api.tvmaze.com/search/shows?q=${query}`,
      );
      setSeries(response.data.map((item) => item.show));
    } catch (err) {
      setError('Error al buscar series. Por favor, intenta de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container my-4">
      <h1 className="mb-4">Buscador de Series</h1>

      <SearchForm onSearch={handleSearch} />

      {loading && (
        <div className="text-center">
          <div className="spinner-border" role="status">
            <span className="visually-hidden">Cargando...</span>
          </div>
        </div>
      )}

      {error && <div className="alert alert-danger">{error}</div>}

      {!loading && !error && (
        <>
          <h2>
            {searched ? 'Resultados de la búsqueda' : 'Series recomendadas'}
          </h2>
          <SeriesList series={series} />
        </>
      )}
    </div>
  );
}

export default Search;
