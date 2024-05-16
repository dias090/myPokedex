import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import "./Card.css";
import axios from "axios";
import Loader from "../loader/Loader";
import { useNavigate } from "react-router-dom";
import ImgNotFound from "../../assets/img_not_found.png";

const Card = () => {
  const { name } = useParams();
  const [pokemonData, setPokemonData] = useState(null);
  const navigate = useNavigate();

  const getColorFromType = (types) => {
    const typeColorMapping = {
      grass: "linear-gradient(to bottom, #99e677, #77cc55, #55b333)",
      fire: "linear-gradient(to bottom, #ff5533, #ff4422, #cc3311)",
      water: "linear-gradient(to bottom, #66ccff, #3399ff, #0066cc)",
      bug: "linear-gradient(to bottom, #ccee88, #aabb22, #889900)",
      normal: "linear-gradient(to bottom, #ccccaa, #aaaa99, #888877)",
      poison: "linear-gradient(to bottom, #cc77bb, #aa5599, #883377)",
      electric: "linear-gradient(to bottom, #ffee88, #ffcc33, #ccaa00)",
      ground: "linear-gradient(to bottom, #eecc88, #ddbb55, #ccaa22)",
      fairy: "linear-gradient(to bottom, #ffbbff, #ee99ee, #dd77dd)",
      fighting: "linear-gradient(to bottom, #cc7766, #bb5544, #aa3322)",
      psychic: "linear-gradient(to bottom, #ff88cc, #ff5599, #cc3377)",
      rock: "linear-gradient(to bottom, #ccbb88, #bbaa66, #aa9944)",
      ghost: "linear-gradient(to bottom, #8888dd, #6666bb, #444499)",
      ice: "linear-gradient(to bottom, #99eeff, #66ccff, #33bbff)",
      dragon: "linear-gradient(to bottom, #9988ff, #7766ee, #5544dd)",
      dark: "linear-gradient(to bottom, #997766, #775544, #553322)",
      steel: "linear-gradient(to bottom, #ccccdd, #aaaabb, #888899)",
      flying: "linear-gradient(to bottom, #aabbff, #8899ff, #6688ff)",
    };

    for (const type of types) {
      if (typeColorMapping[type.type.name]) {
        return typeColorMapping[type.type.name];
      }
    }
    return "linear-gradient(to bottom, #fefefe, #fcfcfc, #fafafa, #f8f8f8, #f6f6f6, #f4f4f4, #f2f2f2, #f0f0f0, #eeeeee, #ececec, #eaeaea, #e8e8e8, #e6e6e6, #e4e4e4, #e2e2e2, #e0e0e0, #dedede, #dcdcdc, #dbdbdb, #d9d9d9, #d7d7d7, #d5d5d5, #d3d3d3, #d1d1d1, #cfcfcf, #cccccc)";
  };

  const getPokemonImage = (pokemonData) => {
    if (pokemonData.sprites.other.dream_world.front_default) {
      return pokemonData.sprites.other.dream_world.front_default;
    } else if (pokemonData.sprites.other["official-artwork"].front_default) {
      return pokemonData.sprites.other["official-artwork"].front_default;
    } else {
      return ImgNotFound;
    }
  };

  const back = () => {
    navigate(-1);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const pokemonResponse = await axios.get(
          `https://pokeapi.co/api/v2/pokemon/${name}`
        );
        const speciesResponse = await axios.get(
          pokemonResponse.data.species.url
        );
        setPokemonData({
          ...pokemonResponse.data,
          species: speciesResponse.data,
        });
      } catch (pokemonError) {
        console.error(`Error fetching Pokémon data for ${name}:`, pokemonError);
      }
    };

    fetchData();
  }, [name]);

  if (!pokemonData) {
    return <Loader />;
  }

  return (
    <div
      id="card_container"
      style={{ background: getColorFromType(pokemonData.types) }}
    >
      <link rel="icon" href="../../../src/tab_view_icon.png" />
      <div className="container">
        <div className="row">
          <div className="col main_card s12 m8 offset-m2 l6 offset-l3 z-depth-2">
            <div className="pokemon_img_container">
              <div className="text_container">
                <p className="pokemon_name">{pokemonData.name}</p>
                <p className="pokemon_types">
                  {pokemonData.types.map((type) => (
                    <span
                      key={type.type.name}
                      style={{
                        background: getColorFromType(pokemonData.types),
                      }}
                    >
                      {type.type.name}
                    </span>
                  ))}
                </p>
                <p className="pokemons_id"># {pokemonData.id}</p>
              </div>
              <img
                className="pokemon_img"
                src={getPokemonImage(pokemonData)}
                alt={pokemonData.name}
              />
            </div>
            <div className="card second_main">
              <div className="row">
                <div className="col s7 m5 offset-m2">
                  <p className="pokemon_title">About</p>
                  <div className="pokemon_text">
                    <div>Exp:</div>
                    <div>{pokemonData.base_experience}</div>
                  </div>
                  <div className="pokemon_text">
                    <div>Height:</div>
                    <div>{pokemonData.height}</div>
                  </div>
                  <div className="pokemon_text">
                    <div>Weight:</div>
                    <div>{pokemonData.weight}</div>
                  </div>
                  <div className="pokemon_text">
                    <div>Abilities:</div>
                    <div>
                      {pokemonData.abilities
                        .map((ability) => ability.ability.name)
                        .join(", ")}
                    </div>
                  </div>
                </div>
                <div className="col s5 m5">
                  <p className="pokemon_title">Base Stats</p>
                  <div className="pokemon_text">
                    <div>HP:</div>
                    <div>
                      {
                        pokemonData.stats.find(
                          (stat) => stat.stat.name === "hp"
                        ).base_stat
                      }
                    </div>
                  </div>
                  <div className="pokemon_text">
                    <div>Attack:</div>
                    <div>
                      {
                        pokemonData.stats.find(
                          (stat) => stat.stat.name === "attack"
                        ).base_stat
                      }
                    </div>
                  </div>
                  <div className="pokemon_text">
                    <div>Defense:</div>
                    <div>
                      {
                        pokemonData.stats.find(
                          (stat) => stat.stat.name === "defense"
                        ).base_stat
                      }
                    </div>
                  </div>
                  <div className="pokemon_text">
                    <div>Speed:</div>
                    <div>
                      {
                        pokemonData.stats.find(
                          (stat) => stat.stat.name === "speed"
                        ).base_stat
                      }
                    </div>
                  </div>
                </div>
              </div>
              <button
                onClick={back}
                className="bottom_button"
                style={{
                  background: getColorFromType(pokemonData.types),
                  color: "white",
                }}
              >
                Back
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Card;
