import { AppShell, Group, Text, Button, Container } from '@mantine/core';
import { Outlet, useNavigate } from 'react-router-dom';

export default function MainLayout() {
  const navigate = useNavigate();

  return (
    <AppShell
      header={{ height: 70 }}
      padding="md"
    >
      {/* Na versão 7, o Header fica dentro do AppShell assim: */}
      <AppShell.Header>
        <Container size="xl" h="100%" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          
          
          <Text 
            size="xl" 
            fw={700} 
            style={{ cursor: 'pointer', color: '#0056b3' }}
            onClick={() => navigate('/')}
          >
            Participa DF
          </Text>

          {/* Botões */}
          <Group>
            <Button variant="subtle" onClick={() => navigate('/')}>Início</Button>
            <Button variant="light" onClick={() => navigate('/nova-manifestacao')}>Nova Manifestação</Button>
          </Group>

        </Container>
      </AppShell.Header>

      {/* O conteúdo da página (Outlet) TEM que ficar dentro do AppShell.Main */}
      <AppShell.Main>
        <Container size="xl">
           <Outlet />
        </Container>
      </AppShell.Main>
      
    </AppShell>
  );
}