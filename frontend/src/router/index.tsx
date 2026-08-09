import { createBrowserRouter } from 'react-router-dom';
import { Layout } from '@/components/layout/Layout';
import AdminLayout from '@/components/layout/AdminLayout';
import Home from '@/pages/Home';
import Explore from '@/pages/Explore';
import PlaceDetail from '@/pages/PlaceDetail';
import Login from '@/pages/Login';
import Register from '@/pages/Register';
import Favorites from '@/pages/Favorites';
import Profile from '@/pages/Profile';
import Garoua from '@/pages/Garoua';
import Excursions from '@/pages/Excursions';
import Transport from '@/pages/Transport';
import Events from '@/pages/Events';
import AdminDashboard from '@/pages/admin/AdminDashboard';
import AdminPlaces from '@/pages/admin/AdminPlaces';
import AdminCategories from '@/pages/admin/AdminCategories';
import AdminCityInfo from '@/pages/admin/AdminCityInfo';
import AdminTransport from '@/pages/admin/AdminTransport';
import AdminEvents from '@/pages/admin/AdminEvents';
import ComingSoon from '@/pages/ComingSoon';

export const router = createBrowserRouter([
  {
    element: <Layout />,
    children: [
      { path: '/', element: <Home /> },
      { path: '/lieux', element: <Explore /> },
      { path: '/lieux/:id', element: <PlaceDetail /> },
      { path: '/garoua', element: <Garoua /> },
      { path: '/excursions', element: <Excursions /> },
      { path: '/transport', element: <Transport /> },
      { path: '/evenements', element: <Events /> },
      { path: '/connexion', element: <Login /> },
      { path: '/inscription', element: <Register /> },
      { path: '/favoris', element: <Favorites /> },
      { path: '/profil', element: <Profile /> },
      {
        path: '/admin',
        element: <AdminLayout />,
        children: [
          { index: true, element: <AdminDashboard /> },
          { path: 'lieux', element: <AdminPlaces /> },
          { path: 'categories', element: <AdminCategories /> },
          { path: 'garoua', element: <AdminCityInfo /> },
          { path: 'transport', element: <AdminTransport /> },
          { path: 'evenements', element: <AdminEvents /> },
        ],
      },
      { path: '*', element: <ComingSoon title="Page introuvable" /> },
    ],
  },
]);