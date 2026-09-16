import { Routes, Route } from "react-router-dom";
import PagesWithNavigation from '@components/PagesWithNavigation';
import NotFound from "@pages/NotFound";
import Home from "@pages/Home";
import Weather from "@pages/Weather";

export default function AppRoutes() {
  return (
    <Routes>
      {/* Группа страниц c навигацией */}
      <Route element={<PagesWithNavigation />}>
        <Route path="/" element={<Home />} />
        <Route path="/weather" element={<Weather />} />
      </Route>
      {/* Группа страниц c навигацией */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
