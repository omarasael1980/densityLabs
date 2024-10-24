import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import AuthLayout from "./layouts/AuthLayout";
import Dashboard from "./pages/Dashboard";
import More from "./pages/More";

function App() {
  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<AuthLayout />}>
            <Route index element={<Dashboard />} />

            <Route path="/more" element={<More />} />
          </Route>
        </Routes>
      </Router>
    </>
  );
}

export default App;
