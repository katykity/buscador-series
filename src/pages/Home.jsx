import { Link } from 'react-router-dom';

function Home() {
  return (
    <div className="container text-center my-5">
      <h1>Buscador de Series de TV</h1>
      <p className="lead">
        Encuentra información sobre tus series favoritas y descubre nuevas
        series para ver.
      </p>
      <Link to="/search" className="btn btn-primary btn-lg">
        Comenzar a buscar
      </Link>
    </div>
  );
}

export default Home;
