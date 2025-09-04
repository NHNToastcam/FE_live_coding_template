import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import "./App.scss";
import DefaultLayout from "./layout/DefaultLayout";
import { HomePage } from "./pages/Home";
import { UserDetailPage } from "./pages/UserDetail";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<DefaultLayout />}>
          <Route index element={<HomePage />}></Route>
          <Route path="/user/:id" element={<UserDetailPage />}></Route>
          <Route path="*" element={<div>Not Found</div>} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
