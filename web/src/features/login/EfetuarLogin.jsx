import { 
  TextInput, 
  PasswordInput, 
  Checkbox, 
  Anchor, 
  Paper, 
  Title, 
  Text, 
  Container, 
  Group, 
  Button 
} from '@mantine/core';

import { useNavigate } from 'react-router-dom';
export default function EfetuarLogin() {
  const navigate = useNavigate();

  return (
    <Container size={420} my={40}>
      {/* Título da Página: H1 para hierarquia correta de acessibilidade */}
      <Title
        align="center"
        c = '#0056b3'
        sx={(theme) => ({ fontFamily: `Greycliff CF, ${theme.fontFamily}`, fontWeight: 900, })}
      >
        Bem-vindo!
      </Title>
      
      <Text color="dimmed" size="sm" align="center" mt={5}>
        Acesse sua conta do Participa DF ou{' '}
        <Anchor size="sm" component="button" color="blue">
          crie uma conta
        </Anchor>
      </Text>

      {/* Paper cria o efeito de cartão elevado */}
      <Paper withBorder shadow="md" p={30} mt={30} radius="md">
        <form onSubmit={(e) => e.preventDefault()}>
          
          <TextInput 
            label="CPF ou CNPJ" 
            required 
          />
          
          <PasswordInput 
            label="Senha" 
            required 
            mt="md" 
          />

          <Group position="apart" mt="md">
            <Checkbox label="Lembrar-me" />
            <Anchor component="button" size="sm" color="blue"
            onClick={() => navigate('/esqueci-senha')}
            >
              Esqueceu a senha?
            </Anchor>
          </Group>

          <Button 
            fullWidth 
            mt="xl" 
            type="submit"
            style={{ backgroundColor: '#0056b3' }} // Mesmo azul do teu Header
          >
            Entrar
          </Button>
          
        </form>
      </Paper>
    </Container>
  );
}