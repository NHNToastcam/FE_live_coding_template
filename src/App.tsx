import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import "./App.scss";
import DefaultLayout from "./layout/DefaultLayout";
import { HomePage } from "./pages/Home";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<DefaultLayout />}>
          <Route index element={<HomePage />}></Route>
          <Route path="*" element={<div>Not Found</div>} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
