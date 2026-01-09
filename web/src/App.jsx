
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { MantineProvider } from '@mantine/core';
import MainLayout from './layouts/MainLayout';
import { HomeScreen } from './features/home/HomeScreen';
// import NovaManifestacao from './features/home/NovaManifestacao'; 
import ConsultarManifestacao from './features/home/ConsultarManifestacao';
import EfetuarLogin from './features/login/EfetuarLogin';
import EsqueciSenha from './features/login/EsqueciSenha';
import CriarConta from './features/login/CriarConta';
import CadastroCompleto from './features/login/CadastroCompleto';
import RelatoManifestacao from './features/manifestacao/RelatoManifestacao';

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
            {/*<Route path="nova-manifestacao" element={<NovaManifestacao />} />*/}
            <Route path="consultar-relato" element={<ConsultarManifestacao />} />
            <Route path="efetuar-login" element={<EfetuarLogin />} />
            <Route path="esqueci-senha" element={<EsqueciSenha />} />
            <Route path="criar-conta" element={<CriarConta />} />
            <Route path="cadastro-completo" element={<CadastroCompleto />} />
            <Route path="relato" element={<RelatoManifestacao />} />
            
          </Route>
        </Routes>
      </BrowserRouter>
    </MantineProvider>
  );
}

export default App;