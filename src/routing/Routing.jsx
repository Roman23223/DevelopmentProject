import { Routes, Route } from "react-router-dom";
import PagesWithNavigation from '@components/PagesWithNavigation';
import NotFound from "@pages/NotFound";
import Home from "@pages/Home";
import Weather from "@pages/Weather";
import Warehouse from "@pages/Warehouse";

export default function AppRoutes() {
  return (
    <Routes>
      {/* Группа страниц c навигацией */}
      <Route element={<PagesWithNavigation />}>
        <Route path="/" element={<Home />} />
        <Route path="/weather" element={<Weather />} />
        <Route path="/warehouse" element={<Warehouse />} />
      </Route>
      {/* Группа страниц c навигацией */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
