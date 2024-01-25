import AdvertisementCreate from "@/pages/AdvertisementCreate";
import AdvertisementDetail from "@/pages/AdvertisementDetail";
import AdvertisementEdit from "@/pages/AdvertisementEdit";
import Dashboard from "@/pages/Dashboard";
import Home from "@/pages/Home";
import { Routes, Route } from "react-router-dom";

const MainLayout = () => {
  return (
    <div>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route exact path="/dashboard" element={<Dashboard />} />
        <Route exact path="/create" component={<AdvertisementCreate />} />
        <Route exact path="/edit/:id" component={<AdvertisementEdit />} />
        <Route exact path="/detail/:id" component={<AdvertisementDetail />} />
      </Routes>
    </div>
  );
};

export default MainLayout;
