import React, { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import Loader from "../loader/Loader";
import "./ShowCards.css";
import Navbar from "../navbar/Navbar";
import Pokeball from "../../assets/pokeball.svg";
import ImgNotFound from "../../assets/img_not_found.png";

const getColorFromType = (types) => {
  const typeColorMapping = {
    grass: "#77cc55",
    fire: "#ff4422",
    water: "#3399ff",
    bug: "#aabb22",
    normal: "#aaaa99",
    poison: "#aa5599",
    electric: "#ffcc33",
    ground: "#ddbb55",
    fairy: "#ee99ee",
    fighting: "#bb5544",
    psychic: "#ff5599",
    rock: "#bbaa66",
    ghost: "#6666bb",
    ice: "#66ccff",
    dragon: "#7766ee",
    dark: "#775544",
    steel: "#aaaabb",
    flying: "#8899ff",
  };

  for (const type of types) {
    if (typeColorMapping[type.type.name]) {
      return typeColorMapping[type.type.name];
    }
  }
  return "white";
};

function ShowCards() {
  const [pokemonList, setPokemonList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filteredPokemon, setFilteredPokemon] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchApi = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await axios.get(
        `https://pokeapi.co/api/v2/pokemon?limit=50&offset=${
          (currentPage - 1) * 50
        }`
      );
      const results = response.data.results;
      const totalResults = response.data.count;
      setTotalPages(Math.ceil(totalResults / 50));

      const pokemonDetails = await Promise.all(
        results.map(async (pokemon) => {
          const detailsResponse = await axios.get(pokemon.url);
          return detailsResponse.data;
        })
      );

      setPokemonList(pokemonDetails);
      setFilteredPokemon(pokemonDetails);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  }, [currentPage]);

  useEffect(() => {
    fetchApi();
  }, [fetchApi, currentPage]);

  const handleSearch = async (event) => {
    if (event.target.value === "") {
      setFilteredPokemon(pokemonList);
    } else {
      setLoading(true);
      setError(null);
      try {
        const response = await axios.get(
          `https://pokeapi.co/api/v2/pokemon?limit=1000`
        );
        const results = response.data.results;

        const pokemonDetails = await Promise.all(
          results.map(async (pokemon) => {
            const detailsResponse = await axios.get(pokemon.url);
            return detailsResponse.data;
          })
        );

        const filtered = pokemonDetails.filter((pokemon) => {
          const idMatch = String(pokemon.id).includes(event.target.value);
          const nameMatch = pokemon.name
            .toLowerCase()
            .includes(event.target.value.toLowerCase());
          return idMatch || nameMatch;
        });
        setFilteredPokemon(filtered);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    }
  };

  const getPokemonImage = (pokemon) => {
    if (pokemon.sprites.other.dream_world.front_default) {
      return pokemon.sprites.other.dream_world.front_default;
    } else if (pokemon.sprites.other["official-artwork"].front_default) {
      return pokemon.sprites.other["official-artwork"].front_default;
    } else {
      return ImgNotFound;
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  if (loading) {
    return <Loader />;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  return (
    <div
      style={{
        backgroundImage: `url(https://w.wallha.com/ws/14/yATVkauL.png)`,
        backgroundSize: "100%",
        minHeight: "100vh",
      }}
    >
      <Navbar onSearch={handleSearch} />
      <div className="cards_container">
        {filteredPokemon.map((pokemon) => (
          <div
            className="card"
            key={pokemon.id}
            style={{ backgroundColor: getColorFromType(pokemon.types) }}
          >
            <p className="pokemon_id">#{pokemon.id}</p>
            <Link to={`/Card/${pokemon.name}`}>
              <img src={Pokeball} alt="logo" className="pt2_bg_img" />
              <div className="pokemon_card white-text">
                <div className="card_pt1">
                  <p className="pokemon_name">{pokemon.name}</p>
                  <p className="pokemon_types">
                    {pokemon.types.map((type) => (
                      <span key={type.type.name}>{type.type.name} </span>
                    ))}
                  </p>
                </div>

                <div className="card_pt2">
                  {pokemon.sprites && pokemon.sprites.front_default && (
                    <img
                      src={getPokemonImage(pokemon)}
                      alt={pokemon.name}
                      className="pokemon_image"
                    />
                  )}
                </div>
              </div>
            </Link>
          </div>
        ))}
      </div>
      <div
        className="center "
        style={{ padding: "20px", width: "fit-content", margin: "0px auto" }}
      >
        <button
          className="btn"
          onClick={handlePrevPage}
          disabled={currentPage === 1}
        >
          Previous
        </button>
        <span
          className="btn white black-text"
          style={{ margin: "1px 10px" }}
          disabled
        >
          {currentPage}/{totalPages}
        </span>
        <button
          className="btn"
          onClick={handleNextPage}
          disabled={currentPage === totalPages}
        >
          Next
        </button>
      </div>
    </div>
  );
}

export default ShowCards;
