import { Button, Container, Text, Title } from '@mantine/core';

function App() {
  return (
    <Container style={{ textAlign: 'center', marginTop: '50px' }}>
      <Title order={1} style={{ color: '#0056b3' }}>Participa DF</Title>
      <Text size="lg" mt="md">Sistema de Ouvidoria Integrada</Text>
      <Button mt="xl" size="lg" color="blue">
        Nova Manifestação
      </Button>
    </Container>
  );
}

export default App;