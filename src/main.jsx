import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import '@ant-design/v5-patch-for-react-19';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Enter from './components/Enter.jsx';
import Akkaunt_me from './components/Akkaunt_me.jsx';
import Xodimlar from './components/Xodimlar.jsx';
import Navbar from './components/Navbar.jsx';
import Mijozlar from './components/Mijozlar.jsx';
import Bulimlar from './components/Bulimlar.jsx';
import Smenalar from './components/Smenalar.jsx';
import { Provider } from 'react-redux';
import store from './app/store.js';
import Xodim_qushish from './components/Xodim_qushish.jsx';
import AddShift from './components/AddShift.jsx';
import AddClientForm from './components/Add_client.jsx';

// Layout-компонент с Navbar
const Layout = ({ children }) => (
  <>
    <Navbar />
    {children}
  </>
);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Provider store={store}>
      <BrowserRouter>
        <Routes>
          
          <Route path='/' element={<Enter />} />

          <Route path='/akkaunt_me' element={<Layout><Akkaunt_me /></Layout>} />
          <Route path='/xodimlar' element={<Layout><Xodimlar /></Layout>} />
          <Route path='/xodim_qushish' element={<Layout><Xodim_qushish /></Layout>} />
          <Route path='/mijozlar' element={<Layout><Mijozlar /></Layout>} />
          <Route path='/mijoz_qushish' element={<Layout><AddClientForm  /></Layout>} />

          <Route path='/bulimlar' element={<Layout><Bulimlar /></Layout>} />
          <Route path='/smenalar' element={<Layout><Smenalar /></Layout>} />
          <Route path='/smena_qushish' element={<Layout><AddShift /></Layout>} />

        </Routes>
      </BrowserRouter>
    </Provider>
  </StrictMode>
);

