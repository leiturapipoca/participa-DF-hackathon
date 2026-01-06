
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { MantineProvider } from '@mantine/core';
import MainLayout from './layouts/MainLayout';
import { HomeScreen } from './features/home/HomeScreen';
import NovaManifestacao from './features/manifestacao/pages/NovaManifestacao'; 

function App() {
  return (
    <MantineProvider withGlobalStyles withNormalizeCSS>
      <BrowserRouter>
        <Routes>
          {/* ROTA PAI: Define que tudo vai usar o MainLayout */}
          <Route path="/" element={<MainLayout />}>
            
            {/* ROTA FILHA 1: "index" significa a página inicial (/) */}
            <Route index element={<HomeScreen />} />

            {/* ROTA FILHA 2: A página de cadastro (/nova-manifestacao) */}
            <Route path="nova-manifestacao" element={<NovaManifestacao />} />

          </Route>
        </Routes>
      </BrowserRouter>
    </MantineProvider>
  );
}

export default App;