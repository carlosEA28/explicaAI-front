import { Navigate, Route, Routes } from "react-router-dom"
import HomePage from "./screens/HomePage";
import History from "@/screens/History";
import HistoryDetail from "@/screens/HistoryDetail";
import LiveRecord from "@/screens/LiveRecord";
import Record from "@/screens/Record";
import Loading from "@/screens/Loading";



function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/record" element={<Record />} />
      <Route path="/record/live" element={<LiveRecord />} />
      <Route path="/history" element={<History />} />
      <Route path="/history/:externalId" element={<HistoryDetail />} />
      <Route path="/loading" element={<Loading />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default App
