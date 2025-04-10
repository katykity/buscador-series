import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';

function Details() {
  const { id } = useParams();
  const [serie, setSerie] = useState(null);
  const [episodes, setEpisodes] = useState([]);
  const [cast, setCast] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSerieDetails = async () => {
      setLoading(true);
      try {
        // Obtener información de la serie
        const serieResponse = await axios.get(
          `https://api.tvmaze.com/shows/${id}`,
        );
        setSerie(serieResponse.data);

        // Obtener episodios
        const episodesResponse = await axios.get(
          `https://api.tvmaze.com/shows/${id}/episodes`,
        );
        setEpisodes(episodesResponse.data);

        // Obtener reparto
        const castResponse = await axios.get(
          `https://api.tvmaze.com/shows/${id}/cast`,
        );
        setCast(castResponse.data);
      } catch (err) {
        setError('Error al cargar los detalles de la serie');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchSerieDetails();
  }, [id]);

  // Agrupar episodios por temporada
  const episodesBySeason = episodes.reduce((seasons, episode) => {
    const season = episode.season;
    if (!seasons[season]) {
      seasons[season] = [];
    }
    seasons[season].push(episode);
    return seasons;
  }, {});

  if (loading) {
    return (
      <div className="text-center my-5">
        <div className="spinner-border" role="status">
          <span className="visually-hidden">Cargando...</span>
        </div>
      </div>
    );
  }

  if (error || !serie) {
    return (
      <div className="alert alert-danger my-5">
        {error || 'No se encontró la serie'}
        <Link to="/search" className="d-block mt-3">
          Volver a buscar
        </Link>
      </div>
    );
  }

  return (
    <div className="container my-4">
      <Link to="/search" className="btn btn-secondary mb-4">
        &laquo; Volver a resultados
      </Link>

      <div className="row">
        <div className="col-md-4">
          {serie.image?.original ? (
            <img
              src={serie.image.original}
              className="img-fluid rounded mb-3"
              alt={serie.name}
            />
          ) : (
            <div className="bg-light text-center p-5 rounded mb-3">
              Imagen no disponible
            </div>
          )}

          <div className="card mb-4">
            <div className="card-header">
              <h3>Información</h3>
            </div>
            <ul className="list-group list-group-flush">
              <li className="list-group-item">
                <strong>Género:</strong> {serie.genres.join(', ')}
              </li>
              <li className="list-group-item">
                <strong>Estreno:</strong> {serie.premiered}
              </li>
              <li className="list-group-item">
                <strong>Estado:</strong> {serie.status}
              </li>
              <li className="list-group-item">
                <strong>Calificación:</strong> {serie.rating?.average || 'N/A'}
              </li>
            </ul>
          </div>
        </div>

        <div className="col-md-8">
          <h1 className="mb-3">{serie.name}</h1>

          <div
            dangerouslySetInnerHTML={{ __html: serie.summary }}
            className="mb-4"
          />

          <h2 className="mb-3">Episodios</h2>
          <div className="accordion mb-4" id="seasonAccordion">
            {Object.keys(episodesBySeason).map((season) => (
              <div className="accordion-item" key={season}>
                <h2 className="accordion-header">
                  <button
                    className="accordion-button collapsed"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target={`#season${season}`}
                  >
                    Temporada {season} ({episodesBySeason[season].length}{' '}
                    episodios)
                  </button>
                </h2>
                <div
                  id={`season${season}`}
                  className="accordion-collapse collapse"
                  data-bs-parent="#seasonAccordion"
                >
                  <div className="accordion-body">
                    <table className="table">
                      <thead>
                        <tr>
                          <th>#</th>
                          <th>Título</th>
                          <th>Fecha</th>
                        </tr>
                      </thead>
                      <tbody>
                        {episodesBySeason[season].map((episode) => (
                          <tr key={episode.id}>
                            <td>{episode.number}</td>
                            <td>{episode.name}</td>
                            <td>{episode.airdate}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <h2 className="mb-3">Reparto</h2>
          <div className="row row-cols-2 row-cols-md-4 g-3">
            {cast.slice(0, 8).map((member) => (
              <div className="col" key={member.person.id}>
                <div className="card h-100">
                  {member.person.image?.medium ? (
                    <img
                      src={member.person.image.medium}
                      className="card-img-top"
                      alt={member.person.name}
                    />
                  ) : (
                    <div className="card-img-top bg-light text-center py-5">
                      No image
                    </div>
                  )}
                  <div className="card-body">
                    <h5 className="card-title">{member.person.name}</h5>
                    <p className="card-text small">
                      <em>Como: {member.character.name}</em>
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Details;
