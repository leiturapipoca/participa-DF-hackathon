import React, { useState } from 'react';
import { 
  TextInput, 
  PasswordInput, 
  Select, 
  Paper, 
  Title, 
  Text, 
  Container, 
  Button, 
  Group,
  Checkbox,
  Divider,
  Box
} from '@mantine/core';
import { useNavigate } from 'react-router-dom';

export default function CadastroCompleto() {
  const navigate = useNavigate();

  const opcoesPcD = [
    { value: 'nao', label: 'Não possuo deficiência' },
    { value: 'fisica', label: 'Física' },
    { value: 'auditiva', label: 'Auditiva' },
    { value: 'visual', label: 'Visual' },
    { value: 'mental', label: 'Mental' },
    { value: 'multipla', label: 'Múltipla' },
  ];

  const [formData, setFormData] = useState({
    pcd: 'nao',
    lgpd: false 
  });

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!formData.lgpd) {
      alert("É necessário aceitar os termos da LGPD.");
      return;
    }

    console.log("Dados:", formData);
    alert("Cadastro realizado!");
    navigate('/efetuar-login');
  };

  return (
    // size="sm" (aprox 400px) deixa o formulário vertical com largura de leitura ideal
    <Container size="sm" my={40}> 
      <Title
        align="center"
        size="h2"
        sx={(theme) => ({ fontFamily: `Greycliff CF, ${theme.fontFamily}`, fontWeight: 900 })}
      >
        Finalizar Cadastro
      </Title>
      
      <Text color="dimmed" size="sm" align="center" mt={5} mb={30}>
        Preencha os dados abaixo para criar sua conta
      </Text>

      <Paper withBorder shadow="md" p={30} radius="md">
        <form onSubmit={handleSubmit}>
          
          {/* AGRUPAMENTO VISUAL 1: DADOS PESSOAIS */}
          <Box mb="xl">
            
            
            <TextInput 
              label="Nome Completo" 
              placeholder="Nome civil"
              required 
              mb="md"
              onChange={(e) => handleChange('nome', e.target.value)}
            />

            <TextInput 
              label="Nome Social / Apelido" 
              placeholder="(Opcional)" 
              mb="md"
            />

            <TextInput 
              label="CPF" 
              placeholder="000.000.000-00" 
              required 
              mb="md"
            />

            <TextInput 
              type="date"
              label="Data de Nascimento" 
              required 
              mb="md"
            />

            <Select
              label="Pessoa com Deficiência (PcD)"
              data={opcoesPcD}
              value={formData.pcd}
              onChange={(val) => handleChange('pcd', val)}
              required
              mb="md"
            />

            <TextInput 
              label="Nome da Mãe" 
              required 
            />
          </Box>

          

          {/* AGRUPAMENTO VISUAL 2: CONTATO */}
          <Box mb="xl">
            

            <TextInput 
              label="Celular" 
              placeholder="(XX) 90000-0000" 
              required 
              mb="md"
            />

            <TextInput 
              label="E-mail" 
              required 
              type="email"
              mb="md"
            />

            <TextInput 
              label="Confirmar E-mail" 
              required 
              type="email"
            />
          </Box>

          

          {/* AGRUPAMENTO VISUAL 3: SEGURANÇA */}
          <Box>
            

            <PasswordInput 
              label="Senha" 
              required 
              mb="md"
            />

            <PasswordInput 
              label="Confirmar Senha" 
              required 
            />
          </Box>

          {/* CHECKBOX LGPD */}
          <Checkbox
            mt="xl"
            label={
              <Text size="sm">
                Li e aceito o tratamento dos dados conforme a <strong>LGPD</strong>.
              </Text>
            }
            checked={formData.lgpd}
            onChange={(e) => handleChange('lgpd', e.currentTarget.checked)}
            required 
          />

          {/* BOTÕES */}
          <Group position="apart" mt="xl">
            <Button variant="default" onClick={() => navigate(-1)}>
              Voltar
            </Button>
            <Button 
              type="submit" 
              style={{ backgroundColor: '#0056b3' }}
            >
              Concluir Cadastro
            </Button>
          </Group>

        </form>
      </Paper>
    </Container>
  );
}