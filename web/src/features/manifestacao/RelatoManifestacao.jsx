import React, { useState, useEffect, useRef } from 'react';
import { 
  Container, Paper, Title, Text, Stepper, Button, Group, Textarea, 
  Select, Switch, FileInput, Alert, List, Box, Divider, Blockquote, 
  Modal, Badge, ActionIcon, Tooltip, Loader, Popover // <--- Adicionado Popover
} from '@mantine/core';
import { useNavigate } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41]
});
L.Marker.prototype.options.icon = DefaultIcon;

// --- COMPONENTE DO MAPA ---
function LocationMarker({ setPosicao, fecharModal }) {
  const [position, setPosition] = useState(null);
  
  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        setPosition([latitude, longitude]);
      }, 
      (err) => {
        console.error(err);
        setPosition([-15.7975, -47.8919]); 
      }
    );
  }, []);

  useMapEvents({
    click(e) {
      setPosicao(e.latlng);
      setPosition(e.latlng);
      setTimeout(() => fecharModal(), 500); 
    },
  });

  return position === null ? null : <Marker position={position}></Marker>;
}

export default function RelatoManifestacao() {
  const navigate = useNavigate();
  const [active, setActive] = useState(0);
  const [mapaAberto, setMapaAberto] = useState(false);
  
  // --- ESTADOS DE ÁUDIO ---
  const [ouvindoDitado, setOuvindoDitado] = useState(false);
  const [lendo, setLendo] = useState(false);
  const recognitionRef = useRef(null);

  const [gravandoAudio, setGravandoAudio] = useState(false);
  const [audioURL, setAudioURL] = useState(null);
  const [audioBlob, setAudioBlob] = useState(null);
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);

  const [preferenciaAudio, setPreferenciaAudio] = useState(false);

  const [dados, setDados] = useState({
    relato: '',
    assunto: '',
    localizacao: null,
    anonimo: false,
    arquivo: null,
    protocoloGerado: '' 
  });

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

  // --- FUNÇÃO 1: DITADO ---
  const toggleDitado = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Seu navegador não suporta ditado por voz. Tente usar o Google Chrome.");
      return;
    }

    if (ouvindoDitado) {
      recognitionRef.current.stop();
      setOuvindoDitado(false);
    } else {
      const recognition = new SpeechRecognition();
      recognition.lang = 'pt-BR';
      recognition.continuous = true;
      recognition.interimResults = true;

      recognition.onresult = (event) => {
        let transcript = '';
        for (let i = event.resultIndex; i < event.results.length; i++) {
            if(event.results[i].isFinal){
                transcript += event.results[i][0].transcript + ' ';
            }
        }
        if (transcript) {
            handleInput('relato', dados.relato + transcript);
        }
      };

      recognition.start();
      recognitionRef.current = recognition;
      setOuvindoDitado(true);
    }
  };

  // --- FUNÇÃO 2: LER O TEXTO ---
  const lerTexto = () => {
    if (lendo) {
      window.speechSynthesis.cancel();
      setLendo(false);
      return;
    }
    if (!dados.relato) {
      alert("Não há texto para ler.");
      return;
    }
    const utterance = new SpeechSynthesisUtterance(dados.relato);
    utterance.lang = 'pt-BR';
    utterance.onend = () => setLendo(false);
    window.speechSynthesis.speak(utterance);
    setLendo(true);
  };

  // --- FUNÇÃO 3: GRAVADOR ---
  const iniciarGravacao = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        const url = URL.createObjectURL(blob);
        setAudioBlob(blob);
        setAudioURL(url);
      };

      mediaRecorder.start();
      setGravandoAudio(true);
    } catch (err) {
      alert("Erro ao acessar microfone. Verifique as permissões.");
      console.error(err);
    }
  };

  const pararGravacao = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
      setGravandoAudio(false);
    }
  };

  const descartarAudio = () => {
    setAudioBlob(null);
    setAudioURL(null);
  };

  // --- NAVEGAÇÃO ---
  const nextStep = () => {
    if (active === 0) {
        if (!preferenciaAudio && dados.relato.trim().length < 10) {
            alert("Por favor, descreva o relato ou selecione a opção de gravar áudio posteriormente.");
            return;
        }
    }
    if (active === 1 && !dados.assunto) {
      alert("Por favor, selecione um assunto.");
      return;
    }
    if (active === 4) {
        if (preferenciaAudio && !audioBlob && !dados.arquivo) {
            alert("Como você optou por não escrever, é OBRIGATÓRIO gravar um áudio ou anexar um arquivo.");
            return;
        }
        const numero = `2026.${Math.floor(Math.random() * 100000)}-OV`;
        handleInput('protocoloGerado', numero);
    }
    setActive((current) => (current < 5 ? current + 1 : current));
  };

  const prevStep = () => setActive((current) => (current > 0 ? current - 1 : current));

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
            
            <Group position="apart" mb="md">
                <Alert title="Dicas" color="blue" variant="light" style={{flex: 1}}>
                   <List size="sm">
                     <List.Item>O que ocorreu e onde?</List.Item>
                     <List.Item>Quem são os envolvidos?</List.Item>
                   </List>
                </Alert>
                
                {/* BOTÕES DE DITADO E LEITURA */}
                <Box>
                    <Tooltip label="Ditar texto">
                        <ActionIcon 
                            size="xl" 
                            variant={ouvindoDitado ? "filled" : "outline"} 
                            color={ouvindoDitado ? "red" : "blue"}
                            onClick={toggleDitado}
                        >
                            {ouvindoDitado ? "👂" : "🎤"}
                        </ActionIcon>
                    </Tooltip>
                    
                    <Tooltip label="Ouvir texto">
                         <ActionIcon 
                            size="xl" 
                            variant={lendo ? "filled" : "outline"} 
                            color="green" 
                            onClick={lerTexto}
                            ml="xs"
                        >
                            {lendo ? "⏹️" : "🔊"}
                        </ActionIcon>
                    </Tooltip>
                    <Text size="xs" align="center" mt={4} color="dimmed">
                        Acessibilidade
                    </Text>
                </Box>
            </Group>

            <Textarea
              placeholder="Descreva o ocorrido ou use o microfone acima para falar..."
              label="Descrição do Ocorrido"
              minRows={8}
              value={dados.relato}
              onChange={(e) => handleInput('relato', e.target.value)}
              disabled={preferenciaAudio}
              required={!preferenciaAudio}
            />

            {/* --- NOVA ÁREA DE AVISO LEGAL (LIMPA E COM POPOVER) --- */}
            <Group position="right" mt="xs">
                <Popover width={350} position="bottom-end" withArrow shadow="md">
                    <Popover.Target>
                        <Button variant="subtle" compact size="xs" color="gray" style={{ fontWeight: 400 }}>
                            ℹ️ Informações importantes sobre Sigilo (Art. 23)
                        </Button>
                    </Popover.Target>
                    <Popover.Dropdown sx={{ backgroundColor: '#f8f9fa' }}>
                        <Text size="sm" weight={700} color="dark" mb="xs">
                            Decreto nº 36.462/2015 - Regras de Sigilo
                        </Text>
                        <List size="xs" spacing={5} type="ordered">
                            <List.Item>A identidade do denunciante é tratada com sigilo absoluto.</List.Item>
                            <List.Item>É proibido compartilhar seus dados pessoais com o órgão denunciado.</List.Item>
                            <List.Item>O sigilo é obrigatório, mesmo dentro dos órgãos públicos.</List.Item>
                            <List.Item>O descumprimento gera responsabilização administrativa, civil e penal.</List.Item>
                        </List>
                    </Popover.Dropdown>
                </Popover>
            </Group>

            <Divider my="md" label="OU" labelPosition="center" />

            {/* BOTÃO PARA PULAR TEXTO */}
            <Paper withBorder p="sm" sx={{ backgroundColor: preferenciaAudio ? '#e7f5ff' : 'transparent', borderColor: preferenciaAudio ? '#1c7ed6' : '#dee2e6' }}>
                <Group position="apart">
                    <Box>
                        <Text weight={700} size="sm">Prefere falar ao invés de escrever?</Text>
                        <Text size="xs" color="dimmed">Você poderá gravar um áudio na etapa de Anexos.</Text>
                    </Box>
                    <Button 
                        variant={preferenciaAudio ? "filled" : "outline"}
                        color={preferenciaAudio ? "blue" : "gray"}
                        onClick={() => {
                            setPreferenciaAudio(!preferenciaAudio);
                            if(!preferenciaAudio) handleInput('relato', '');
                        }}
                    >
                        {preferenciaAudio ? "Vou escrever o texto" : "Pular e gravar áudio depois"}
                    </Button>
                </Group>
            </Paper>
          </Paper>
        </Stepper.Step>

        {/* 2. ASSUNTO E MAPA */}
        <Stepper.Step label="Assunto" description="Classificação">
          <Paper withBorder shadow="sm" p="md" radius="md" mt="xl">
            <Select
              label="Assunto Principal"
              placeholder="Selecione uma opção"
              data={listaAssuntos}
              value={dados.assunto}
              onChange={(val) => handleInput('assunto', val)}
              required
            />
            <Divider my="lg" />
            <Text weight={700} size="sm" mb="xs">A identificação do local ajudaria na resolução do problema?</Text>
            {dados.localizacao ? (
               <Alert color="green" title="Local Definido" variant="filled" mb="md">
                 <Group position="apart">
                    <Text size="sm">
                      Lat: {dados.localizacao.lat.toFixed(4)}, Lng: {dados.localizacao.lng.toFixed(4)}
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

        {/* 3. RESUMO */}
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
                 <Badge color="green" size="lg">Anexada</Badge>
                 <Text size="xs" color="dimmed">Lat: {dados.localizacao.lat.toFixed(4)}</Text>
               </Box>
            )}
            <Divider my="sm" />
            <Box>
              <Text size="sm" weight={700} color="blue" mb="xs">Relato:</Text>
              {preferenciaAudio ? (
                  <Badge size="lg" color="orange">Será enviado por Áudio (Ver Anexos)</Badge>
              ) : (
                  <Blockquote cite="Texto do passo 1">
                    {dados.relato || "Sem texto."}
                  </Blockquote>
              )}
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

        {/* 5. ANEXO E GRAVAÇÃO */}
        <Stepper.Step label="Anexo" description="Arquivos/Áudio">
          <Paper withBorder shadow="sm" p="md" radius="md" mt="xl">
            
            <Text size="lg" weight={700} mb="sm">Gravar Relato em Áudio</Text>
            <Paper p="md" withBorder sx={{ backgroundColor: '#f1f3f5' }} mb="xl">
                {audioURL ? (
                    <Box>
                        <Group position="center" mb="sm">
                            <audio src={audioURL} controls style={{ width: '100%' }} />
                        </Group>
                        <Group position="center">
                             <Button color="red" variant="subtle" onClick={descartarAudio}>
                                🗑️ Descartar
                             </Button>
                             <Badge color="green" size="lg">✅ Áudio Gravado</Badge>
                        </Group>
                    </Box>
                ) : (
                    <Box textAlign="center">
                        <Text size="sm" mb="md" align="center">
                            Clique no botão abaixo para iniciar a gravação.
                        </Text>
                        <Group position="center">
                            {gravandoAudio ? (
                                <Button 
                                    color="red" 
                                    size="lg" 
                                    onClick={pararGravacao}
                                >
                                    🔴 Parar
                                </Button>
                            ) : (
                                <Button 
                                    color="blue" 
                                    size="lg" 
                                    onClick={iniciarGravacao}
                                >
                                    🎙️ Gravar Áudio
                                </Button>
                            )}
                        </Group>
                        {gravandoAudio && <Text color="red" align="center" mt="sm" weight={700}>Gravando...</Text>}
                    </Box>
                )}
            </Paper>

            <Divider my="xl" label="OU ANEXAR ARQUIVO" labelPosition="center" />

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
        title="Selecione o local"
        size="lg"
      >
        <div style={{ height: '400px', width: '100%' }}>
            {mapaAberto && (
                <MapContainer center={[-15.7975, -47.8919]} zoom={13} style={{ height: '100%', width: '100%' }}>
                    <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" attribution='&copy; OpenStreetMap' />
                    <LocationMarker setPosicao={(pos) => handleInput('localizacao', pos)} fecharModal={() => setMapaAberto(false)} />
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