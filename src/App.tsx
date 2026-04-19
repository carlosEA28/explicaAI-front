import { Navigate, Route, Routes } from "react-router-dom"
import HomePage from "./screens/HomePage";
import Record from "@/screens/Record";



function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/record" element={<Record />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default App
