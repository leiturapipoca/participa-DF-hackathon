// src/features/home/pages/Home.jsx
import { Button, Container, Stack, Text, Title } from '@mantine/core';
import { useNavigate } from 'react-router-dom'; // Importante para navegação

export function HomeScreen() {
  const navigate = useNavigate();

  return (
    <Container style={{ textAlign: 'center', marginTop: '50px' }}>
      <Title order={1} style={{ color: '#0056b3' }}>Participa DF</Title>
      <Text size="lg" mt="md">Sistema de Ouvidoria Integrada</Text>
      <Stack mt="xl" gap="md" align="center">
      <Button 
        mt="xl" 
        size="lg" 
        color="blue" 
        onClick={() => navigate('/nova-manifestacao')}
      >
        Nova Manifestação
      </Button>
      <Button
      mt = "xl"
      size = "lg"
      color = "blue"
      onClick = {() => navigate('/consultar-relato')}
      >
        Consultar meus relatos
      </Button>
      </Stack>
    </Container>
  );
}