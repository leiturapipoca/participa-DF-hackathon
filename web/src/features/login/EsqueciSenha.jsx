import React, { useState } from 'react';
import { 
  Paper, 
  Title, 
  Text, 
  Container, 
  Button, 
  SegmentedControl, 
  TextInput, 
  Alert, 
  Anchor,
  Box
} from '@mantine/core';


export default function EsqueciSenha() {
  const [tipoDocumento, setTipoDocumento] = useState('cpf');

  return (
    <Container size={460} my={40}>
      <Title
        align="center"
        c = '#0056b3'
        sx={(theme) => ({ fontFamily: `Greycliff CF, ${theme.fontFamily}`, fontWeight: 900 })}
      >
        Recuperação de Senha
      </Title>
      
      

      <Paper withBorder shadow="md" p={30} radius="md">
        
        <Box mb="md">
          <Text size="sm" weight={500} mb={5}>Selecione uma opção:</Text>
          <SegmentedControl
            fullWidth
            value={tipoDocumento}
            onChange={setTipoDocumento}
            color="blue"
            data={[
              { label: 'Pessoa Física (CPF)', value: 'cpf' },
              { label: 'Pessoa Jurídica (CNPJ)', value: 'cnpj' },
            ]}
          />
        </Box>

        <form onSubmit={(e) => e.preventDefault()}>
          {tipoDocumento === 'cpf' ? (
            <TextInput 
              label="CPF" 
              placeholder="000.000.000-00" 
              required 
              description="Digite apenas os números"
            />
          ) : (
            <TextInput 
              label="CNPJ" 
              placeholder="00.000.000/0000-00" 
              required 
             
            />
          )}

          <Button 
            fullWidth 
            mt="xl" 
            type="submit"
            style={{ backgroundColor: '#0056b3' }}
          >
            Enviar Instruções
          </Button>
        </form>

        
        <Alert 
          title="Importante" 
          color="blue" 
          variant="light"
          mt="xl"
          styles={{
            root: { backgroundColor: '#e7f5ff' },
            message: { color: '#000000' }
          }}
        >
          <Text size="sm" style={{ lineHeight: 1.5 }}>
            Caso precise fazer qualquer correção ou mudança em seus dados pessoais ou esteja tendo problemas 
            para receber/recuperar a senha para acessar o Participa-DF, favor entrar em contato pelo telefone 
            <strong> 162</strong> ou comparecer pessoalmente em qualquer Ouvidoria do GDF.{' '}
            <Anchor
  href="https://ouvidoria.df.gov.br/texto-endereco-das-ouvidorias/"
  target="_blank"
  rel="noopener noreferrer"
  fw={700}
  c="blue.7"
  styles={{
    root: {
      textDecoration: 'underline',
      textUnderlineOffset: 3,
      '&:hover': {
        textDecorationThickness: 2,
      },
    },
  }}
>
  Confira aqui
</Anchor>
{' '}
            os endereços. A medida é necessária para dar segurança às informações. Agradecemos a compreensão.
          </Text>
        </Alert>

      </Paper>
    </Container>
  );
}