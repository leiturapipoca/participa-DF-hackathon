//NOTA IMPORTANTE: Por enquanto a lógica do mapa está no mesmo arquivo da criação de relato,
// mas cpa o ideal seria separar, apesar de que só é usado aqui
// oh duvida cruel


import React, { useState, useEffect } from 'react';
import { 
  Container, Paper, Title, Text, Stepper, Button, Group, Textarea, 
  Select, Switch, FileInput, Alert, List, Box, Divider, Blockquote, 
  Modal, LoadingOverlay, Badge 
} from '@mantine/core';
import { useNavigate } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css'; //importante
import L from 'leaflet';//corrige alguns pequenos bugs
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41]
});
L.Marker.prototype.options.icon = DefaultIcon;

//Captura o clique no mapa
function LocationMarker({ setPosicao, fecharModal }) {
  const [position, setPosition] = useState(null);
  
  // Tenta pegar a localização do usuário ao abrir o mapa
  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        setPosition([latitude, longitude]);
      }, 
      (err) => {
        console.error(err);
        //foca em Brasília por padrão
        setPosition([-15.7975, -47.8919]); 
      }
    );
  }, []);

  // Evento de clique no mapa
  useMapEvents({
    click(e) {
      setPosicao(e.latlng); // Salva no estado principal
      setPosition(e.latlng); // Atualiza o marcador visual
      // Pequeno delay para o usuário ver onde clicou antes de fechar
      setTimeout(() => fecharModal(), 500); 
    },
  });

  return position === null ? null : (
    <Marker position={position}></Marker>
  );
}


export default function RelatoManifestacao() {
  const navigate = useNavigate();
  const [active, setActive] = useState(0);
  const [mapaAberto, setMapaAberto] = useState(false);
  const [dados, setDados] = useState({
    relato: '',
    assunto: '',
    localizacao: null, // indica latitude e longitude
    anonimo: false,
    arquivo: null,
    protocoloGerado: '' 
  });
  //valores placeholder, no site são bem mais coisas
  const listaAssuntos = [ 
    { value: 'saude', label: 'Saúde / Hospitais' },
    { value: 'educacao', label: 'Educação / Escolas' },
    { value: 'transporte', label: 'Transporte Público' },
    { value: 'seguranca', label: 'Segurança Pública' },
    { value: 'infraestrutura', label: 'Obras e Infraestrutura' },
    { value: 'servidor', label: 'Conduta de Servidor' },
    { value: 'outros', label: 'Outros Assuntos' },
  ];

  const getNomeAssunto = (valor) => {
    const item = listaAssuntos.find(i => i.value === valor);
    return item ? item.label : 'Não informado';
  };

  const handleInput = (campo, valor) => {
    setDados(prev => ({ ...prev, [campo]: valor }));
  };

  const nextStep = () => {
    if (active === 0 && dados.relato.trim().length < 10) {
      alert("Por favor, descreva o relato com mais detalhes.");
      return;
    }
    if (active === 1 && !dados.assunto) {
      alert("Por favor, selecione um assunto.");
      return;
    }
    
    if (active === 4) {
      gerarProtocolo();
    }
    setActive((current) => (current < 5 ? current + 1 : current));
  };

  const prevStep = () => setActive((current) => (current > 0 ? current - 1 : current));

  const gerarProtocolo = () => { //CLARAMENTE UM PLACEHOLDER 
    const numero = `2026.${Math.floor(Math.random() * 100000)}-OV`;
    handleInput('protocoloGerado', numero);
  };

  return (
    <Container size="xl" my={40}>
      <Title 
        align="center" 
        mb="xl" 
        sx={(theme) => ({ fontFamily: `Greycliff CF, ${theme.fontFamily}`, fontWeight: 900 })}
        color="#0056b3"
      >
        Nova Manifestação
      </Title>

      <Stepper active={active} onStepClick={setActive} breakpoint="sm" color="blue" allowNextStepsSelect={false} size="sm">
        
        {/* 1. RELATO */}
        <Stepper.Step label="Relato" description="Detalhes">
          <Paper withBorder shadow="sm" p="md" radius="md" mt="xl">
            <Alert title="Dicas de preenchimento" color="blue" variant="light" mb="md">
              <List size="sm" spacing="xs">
                <List.Item>O que ocorreu?</List.Item>
                <List.Item>Quem são os envolvidos?</List.Item>
                <List.Item>Onde e quando aconteceu?</List.Item>
              </List>
            </Alert>
            <Textarea
              placeholder="Escreva aqui seu relato completo..."
              label="Descrição do Ocorrido"
              minRows={8}
              value={dados.relato}
              onChange={(e) => handleInput('relato', e.target.value)}
              required
            />
            <Alert title="As denúncias registradas no Participa DF são tratadas com sigilo absoluto da identidade do denunciante, 
            conforme determina o art. 23 do Decreto nº 36.462/2015" color="blue" variant="light" mb="md">
              <List size="sm" spacing="xs">
                <List.Item>Nenhuma informação pessoal do denunciante pode ser compartilhada;</List.Item>
                <List.Item>O sigilo é obrigatório, mesmo dentro dos órgãos públicos;</List.Item>
                <List.Item>O descumprimento dessas regras pode gerar responsabilização administrativa, civil e penal</List.Item>
              </List>
            </Alert>
          </Paper>
        </Stepper.Step>

        {/* 2. ASSUNTO E LOCALIZAÇÃO */}
        <Stepper.Step label="Assunto" description="Classificação">
          <Paper withBorder shadow="sm" p="md" radius="md" mt="xl">
            <Text mb="xs" weight={500}>Qual área melhor descreve o seu problema?</Text>
            <Select
              placeholder="Selecione uma opção"
              data={listaAssuntos}
              value={dados.assunto}
              onChange={(val) => handleInput('assunto', val)}
              required
              mb="xl"
            />

            <Divider my="lg" />
            
            {/* SEÇÃO DE GEOLOCALIZAÇÃO */}
            <Text weight={700} size="sm" mb="xs">A identificação do local ajudaria na resolução do problema?</Text>
            
            {dados.localizacao ? (
               <Alert color="green" title="Local Definido" variant="filled" mb="md">
                 <Group position="apart">
                    <Text size="sm">
                      Latitude: {dados.localizacao.lat.toFixed(4)}, Longitude: {dados.localizacao.lng.toFixed(4)}
                    </Text>
                    <Button color="white" variant="outline" size="xs" onClick={() => handleInput('localizacao', null)}>
                      Remover
                    </Button>
                 </Group>
               </Alert>
            ) : (
              <Group mt="md">
                <Button variant="outline" onClick={() => setMapaAberto(true)}>
                  Sim, quero selecionar no mapa
                </Button>
                
              </Group>
            )}

          </Paper>
        </Stepper.Step>

        {/* 3. RESUMO (REVISÃO) */}
        <Stepper.Step label="Resumo" description="Revisão">
          <Paper withBorder shadow="sm" p="md" radius="md" mt="xl">
            <Title order={4} mb="md" color="dimmed">Confira os dados:</Title>
            
            <Box mb="md">
              <Text size="sm" weight={700} color="blue">Assunto:</Text>
              <Text>{getNomeAssunto(dados.assunto)}</Text>
            </Box>

            {dados.localizacao && (
               <Box mb="md">
                 <Text size="sm" weight={700} color="blue">Localização:</Text>
                 <Badge color="green" size="lg">Localização Geográfica Anexada</Badge>
                 <Text size="xs" color="dimmed">Lat: {dados.localizacao.lat} / Lng: {dados.localizacao.lng}</Text>
               </Box>
            )}

            <Divider my="sm" />
            <Box>
              <Text size="sm" weight={700} color="blue" mb="xs">Relato:</Text>
              <Blockquote cite="Texto inserido no passo 1">
                {dados.relato}
              </Blockquote>
            </Box>
          </Paper>
        </Stepper.Step>

        {/* 4. IDENTIFICAÇÃO */}
        <Stepper.Step label="Identificação" description="Seus Dados">
          <Paper withBorder shadow="sm" p="md" radius="md" mt="xl">
            <Text size="lg" weight={700} mb="sm">Dados do Manifestante</Text>
            <Box mb="xl" p="xs" sx={{ backgroundColor: '#f8f9fa', borderRadius: '8px' }}>
              <Text size="sm"><strong>Nome:</strong> João da Silva</Text>
              <Text size="sm"><strong>CPF:</strong> 000.***.***-00</Text>
            </Box>
            <Switch
              label="Desejo realizar esta manifestação de forma ANÔNIMA"
              checked={dados.anonimo}
              onChange={(e) => handleInput('anonimo', e.currentTarget.checked)}
              color="red"
            />
          </Paper>
        </Stepper.Step>

        {/* 5. ANEXO */}
        <Stepper.Step label="Anexo" description="Arquivos">
          <Paper withBorder shadow="sm" p="md" radius="md" mt="xl">
            <FileInput
              label="Anexar Arquivo (Opcional)"
              placeholder="Clique para selecionar"
              value={dados.arquivo}
              onChange={(file) => handleInput('arquivo', file)}
            />
          </Paper>
        </Stepper.Step>

        {/* 6. PROTOCOLO */}
        <Stepper.Completed>
          <Paper withBorder shadow="md" p="xl" radius="md" mt="xl" sx={{ textAlign: 'center', borderColor: '#40c057' }}>
            <Title order={2} style={{ color: '#2b8a3e' }} mb="md">Manifestação Registrada!</Title>
            <Box p="lg" mb="xl" sx={{ backgroundColor: '#e9fac8', borderRadius: '8px', display: 'inline-block' }}>
              <Text size="sm" weight={700} color="dimmed">Número do Protocolo</Text>
              <Title order={1} style={{ letterSpacing: 2 }}>{dados.protocoloGerado}</Title>
            </Box>
            <Group position="center">
              <Button onClick={() => navigate('/')} style={{ backgroundColor: '#0056b3' }}>Voltar ao Início</Button>
            </Group>
          </Paper>
        </Stepper.Completed>
      </Stepper>

      {/* MODAL DO MAPA */}
      <Modal 
        opened={mapaAberto} 
        onClose={() => setMapaAberto(false)}
        title="Selecione o local do ocorrido"
        size="lg"
      >
        <Text size="sm" mb="md" color="dimmed">
          Clique no mapa para marcar o ponto exato. O mapa tentará iniciar na sua localização atual.
        </Text>
        
        {/* Container do Mapa */}
        <div style={{ height: '400px', width: '100%' }}>
            {mapaAberto && (
                <MapContainer center={[-15.7975, -47.8919]} zoom={13} style={{ height: '100%', width: '100%' }}>
                    <TileLayer
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    />
                    <LocationMarker 
                        setPosicao={(pos) => handleInput('localizacao', pos)} 
                        fecharModal={() => setMapaAberto(false)}
                    />
                </MapContainer>
            )}
        </div>
      </Modal>

      {/* BOTÕES DE NAVEGAÇÃO */}
      {active < 5 && (
        <Group position="center" mt="xl">
          <Button variant="default" onClick={prevStep} disabled={active === 0}>Voltar</Button>
          <Button onClick={nextStep} style={{ backgroundColor: '#0056b3' }} size="md" px={40}>
            {active === 4 ? 'Finalizar e Enviar' : 'Próximo Passo'}
          </Button>
        </Group>
      )}

    </Container>
  );
}