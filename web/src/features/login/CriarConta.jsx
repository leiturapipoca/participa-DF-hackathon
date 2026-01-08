import React, { useState } from 'react';
import { 
  TextInput, 
  Paper, 
  Title, 
  Text, 
  Container, 
  Button, 
  Group, 
  LoadingOverlay
} from '@mantine/core';
import { useNavigate } from 'react-router-dom';

export default function CriarConta() {
  const navigate = useNavigate();
  
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    cpf: '',
    nome: '',
    nomeMae: '',
    nascimento: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleValidacao = async (e) => {
    e.preventDefault(); // Impede o recarregamento da página
    setLoading(true); // Ativa o spinner

    console.log("Enviando dados para validação:", formData);

    // Simulação do tempo de resposta da API
    setTimeout(() => {
      setLoading(false); // Desativa o spinner
      
      // AQUI é o lugar certo de navegar. Só depois que "carregou".
      navigate('/cadastro-completo'); 
      
    }, 1500); // Espera 1.5 segundos
  };

  return (
    <Container size={460} my={40}>
      <Title
        align="center"
        c='#0056b3'
        sx={(theme) => ({ fontFamily: `Greycliff CF, ${theme.fontFamily}`, fontWeight: 900 })}
      >
        Validação Cadastral
      </Title>
      
      <Text color="dimmed" size="sm" align="center" mt={5}>
        Preencha os dados conforme constam no seu documento.
      </Text>

      <Paper withBorder shadow="md" p={30} mt={30} radius="md" style={{ position: 'relative' }}>
        <LoadingOverlay visible={loading} overlayBlur={2} />

        <form onSubmit={handleValidacao}>
          
          <TextInput 
            label="CPF" 
            placeholder="000.000.000-00" 
            name="cpf"
            required 
            mb="md"
            value={formData.cpf}
            onChange={handleChange}
          />

          <Group grow mb="md">
            <TextInput 
              label="Primeiro Nome" 
              name="nome"
              required 
              value={formData.nome}
              onChange={handleChange}
            />
            <TextInput 
              type="date"
              label="Data de Nascimento" 
              name="nascimento"
              required 
              value={formData.nascimento}
              onChange={handleChange}
            />
          </Group>
          
          <TextInput 
            label="Primeiro Nome da Mãe" 
            name="nomeMae"
            required 
            mb="xl" 
            value={formData.nomeMae}
            onChange={handleChange}
          />

          <Group position="apart" mt="md">
             <Button variant="default" onClick={() => navigate(-1)}>
               Voltar
             </Button>
             
             {/* REMOVI O ONCLICK DAQUI. QUEM CHAMA A NAVEGAÇÃO É O FORMULÁRIO ACIMA */}
             <Button 
                type="submit" 
                style={{ backgroundColor: '#0056b3', flex: 1 }}
             >
                Validar Identidade
             </Button>
          </Group>
          
        </form>
      </Paper>
      <Text align="center" size="xs" color="dimmed" mt="xl">
        Seus dados estão protegidos conforme a Lei Geral de Proteção de Dados (LGPD).
      </Text>
    </Container>
  );
}