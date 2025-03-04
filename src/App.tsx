import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Provider } from "react-redux";
import { store } from "./store/store";
import { NavProvider } from "./context/NavContext";
import "./App.css";

import Header from "./components/ui/Header";
import Nav from "./components/ui/Nav";
import Footer from "./components/ui/Footer";
import Main from "./components/ui/Main";

function App() {
  return (
    <Provider store={store}>
      <NavProvider>
        <Router>
          <div className="flex flex-col min-h-screen">
            <Header />
            <div className="flex flex-1">
              <Nav />
              <Main />
            </div>
            <Footer />
          </div>
        </Router>
      </NavProvider>
    </Provider>
  );
}
export default App;
