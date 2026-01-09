// src/features/home/pages/Home.jsx
import { Button, Container, Stack, Text, Title, VisuallyHidden } from '@mantine/core';
import { useNavigate } from 'react-router-dom'; // Importante para navegação


export function HomeScreen() {
  const navigate = useNavigate();

  return (
    <Container component={"main"} aria-describedby={"descricao-home"} style={{ textAlign: 'center', marginTop: '50px' }}>

    {/* Audiodescrição da página (somente para leitores de tela) */}
      <VisuallyHidden id="descricao-home">
        Página inicial do sistema Participa DF, um sistema de ouvidoria integrada.
        A página apresenta o título Participa DF, um subtítulo informando que se
        trata de um sistema de ouvidoria integrada, e dois botões centrais. O
        primeiro botão permite registrar uma nova manifestação. O segundo botão
        permite consultar relatos já enviados pelo usuário.
      </VisuallyHidden>

      <Title order={1} style={{ color: '#0056b3' }}>Participa DF</Title>
      <Text size="lg" mt="md">Sistema de Ouvidoria Integrada</Text>
      <Stack mt="xl" gap="md" align="center">
      <Button 
        mt="xl" 
        size="lg" 
        color="blue" 
        onClick={() => navigate('/relato')}
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