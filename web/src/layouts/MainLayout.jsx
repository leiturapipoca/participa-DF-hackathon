import { AppShell, Group, Text, Button, Container } from '@mantine/core';
import { Outlet, useNavigate } from 'react-router-dom';

export default function MainLayout() {
  const navigate = useNavigate();

  return (
   <AppShell header={{ height: 70 }} padding="md">
  <AppShell.Header bg="#0056b3">
    <Container
      size="xl"
      h="100%"
      style={{
        display: 'flex',
        alignItems: 'center',
      }}
    >
      <Text
        size="xl"
        fw={700}
        c="white"
        style={{ cursor: 'pointer' }}
        onClick={() => navigate('/')}
      >
        Participa DF
      </Text>

    
      <div style={{ flex: 1 }} />

      <Group h="100%" gap={0}>
        <Button
          variant="subtle"
          c="white"
          h="100%"
          styles={{
            root: {
              borderRadius: 0,
              paddingLeft: 20,
              paddingRight: 20,
            },
            rootHovered: {
              backgroundColor: 'rgba(255,255,255,0.15)',
            },
          }}
          onClick={() => navigate('/')}
        >
          Início
        </Button>

        <Button
          variant="subtle"
          c="white"
          h="100%"
          styles={{
            root: {
              borderRadius: 0,
              paddingLeft: 20,
              paddingRight: 20,
            },
            rootHovered: {
              backgroundColor: 'rgba(255,255,255,0.15)',
            },
          }}
          onClick={() => navigate('/nova-manifestacao')}
        >
          Nova Manifestação
        </Button>
        
      </Group>
    </Container>
  </AppShell.Header>

  <AppShell.Main>
    <Container size="xl">
      <Outlet />
    </Container>
  </AppShell.Main>
</AppShell>
  );
}