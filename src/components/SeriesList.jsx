// componente que muestra una lista de series

import { Link } from 'react-router-dom';

function SeriesList({ series }) {
  if (series.length === 0) {
    return <p>No se encontraron series. Intenta con otra búsqueda.</p>;
  }

  return (
    <div className="row row-cols-1 row-cols-md-4 g-4">
      {series.map((serie) => (
        <div key={serie.id} className="col">
          <div className="card h-100">
            {serie.image?.medium ? (
              <img
                src={serie.image.medium}
                className="card-img-top"
                alt={serie.name}
              />
            ) : (
              <div className="card-img-top bg-light text-center py-5">
                No image available
              </div>
            )}
            <div className="card-body">
              <h5 className="card-title">{serie.name}</h5>
              <p className="card-text">{serie.genres.join(', ')}</p>
              <Link to={`/serie/${serie.id}`} className="btn btn-primary">
                Ver detalles
              </Link>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default SeriesList;
