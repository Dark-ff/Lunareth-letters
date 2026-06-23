import { BrowserRouter, Routes, Route } from "react-router-dom"

import Home from "./pages/Home"
import CreateLetter from "./pages/CreateLetter"
import ReadLetter from "./pages/ReadLetter"
import ViewLetter from "./pages/ViewLetter"

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/create" element={<CreateLetter />} />
        <Route path="/letter" element={<ReadLetter />} />

        <Route
          path="/letter/:id"
          element={<ViewLetter />}
        />
      </Routes>
    </BrowserRouter>
  )
}