import "./App.css";

function App() {
  return (
    <>
      <div className="navbar flex-column space-btw grow-1">
        <div className="logo flex-column grow-2 align-center">
          PLANT KINGDOM
        </div>

        <div className="links flex-column jend grow-1 align-center">
          <div>
            <a href="#" className="no-style">
              EXPLORE
            </a>
          </div>
          <div>
            <a href="#" className="no-style">
              LEARN
            </a>
          </div>
          <div>
            <a href="#" className="no-style">
              ARTICLES
            </a>
          </div>
          <div>
            <a href="#" className="no-style">
              DOCS
            </a>
          </div>
          <div className="flex-column search-div">
            <input
              className="input-search"
              placeholder="Search"
              onFocus={() =>
                document.querySelector(".search-div").classList.add("active")
              }
              onBlur={() =>
                document.querySelector(".search-div").classList.remove("active")
              }
            />
            <span className="material-icons md-36 search-btn">search</span>
          </div>
        </div>
      </div>
    </>
  );
}

export default App;
