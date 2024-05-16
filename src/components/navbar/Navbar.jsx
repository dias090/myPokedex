import React from "react";
import Logo from "../../assets/pokemongo-text-logo.png";
import "./Navbar.css";

const Navbar = ({ onSearch }) => {
  const handleKeyPress = (event) => {
    if (event.key === "Enter") {
      onSearch(event);
    }
  };

  return (
    <div>
      <div className="navbar z-depth-5">
        <a href="/" className="logo">
          <img src={Logo} alt="" />
        </a>
        <nav className="z-depth-1">
          <div className="nav-wrapper">
            <form>
              <div className="input-field">
                <input
                  id="search"
                  type="search"
                  required
                  onKeyPress={handleKeyPress}
                />
                <label className="label-icon" htmlFor="search">
                  <i className="material-icons">search</i>
                </label>
                <i className="material-icons">close</i>
              </div>
            </form>
          </div>
        </nav>
      </div>
    </div>
  );
};

export default Navbar;
