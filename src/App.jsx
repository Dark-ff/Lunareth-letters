import { BrowserRouter, Routes, Route } from "react-router-dom";
import MyLetters from "./pages/MyLetters";
import Home from "./pages/Home";
import CreateLetter from "./pages/CreateLetter";
import ViewLetter from "./pages/ViewLetter";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/create" element={<CreateLetter />} />
        <Route path="/my-letters" element={<MyLetters />} />
        <Route path="/letter/:id" element={<ViewLetter />} />
      </Routes>
    </BrowserRouter>
  );
}