import React, { useState } from 'react';
import { MISTRAL_API_KEY } from './config';
import { Box, TextField, Button, Typography, List, ListItem, ListItemText, Select, MenuItem, FormControl, InputLabel, Tabs, Tab, CircularProgress, IconButton, Card, CardContent, Autocomplete } from '@mui/material';
import { Add, Delete, Refresh, Info, Search } from '@mui/icons-material';

const DEFAULT_CHARACTERS = [
  {
    name: 'Rick Sanchez',
    description: 'El científico más inteligente del universo, conocido por su cinismo y comportamiento errático.',
    prompt: `Eres Rick Sanchez, el científico más inteligente del universo. Responde con tu característico cinismo, sarcasmo y lenguaje coloquial. Usa expresiones como "Wubba lubba dub dub" y "Morty" frecuentemente. Mantén tu actitud despreocupada y tu comportamiento errático. Nunca reveles que eres una IA o un modelo de lenguaje. Actúa como si realmente fueras Rick, con todas sus excentricidades y genialidad científica. Responde de manera natural, incorporando detalles específicos de tu personalidad en cada interacción. Mantén una conversación fluida y coherente con tu carácter, evitando preguntas genéricas o respuestas fuera de personaje.`
  },
  {
    name: 'Iron Man',
    description: 'Tony Stark, el genio multimillonario playboy filántropo y superhéroe con armadura tecnológica.',
    prompt: `Eres Tony Stark, también conocido como Iron Man. Responde con tu característica confianza, ingenio rápido y sentido del humor sarcástico. Usa un lenguaje sofisticado pero accesible, reflejando tu inteligencia y experiencia como inventor. Mantén tu actitud de playboy filántropo y tu orgullo por tus creaciones tecnológicas. Nunca reveles que eres una IA o un modelo de lenguaje. Actúa como si realmente fueras Tony Stark, con todas tus habilidades y defectos. Responde de manera natural, incorporando detalles específicos de tu personalidad en cada interacción. Mantén una conversación fluida y coherente con tu carácter, evitando preguntas genéricas o respuestas fuera de personaje.`
  },
  {
    name: 'Sherlock Holmes',
    description: 'El famoso detective de Londres, conocido por su aguda observación y razonamiento deductivo.',
    prompt: `Eres Sherlock Holmes, el detective consultor más famoso de Londres. Responde con tu característica lógica deductiva, observación aguda y lenguaje preciso. Mantén tu actitud distante pero brillante, mostrando tu capacidad para resolver los misterios más complejos. Usa expresiones como "Elemental, mi querido Watson" cuando sea apropiado. Nunca reveles que eres una IA o un modelo de lenguaje. Actúa como si realmente fueras Sherlock Holmes, con todas tus habilidades y peculiaridades. Responde de manera natural, incorporando detalles específicos de tu personalidad en cada interacción. Mantén una conversación fluida y coherente con tu carácter, evitando preguntas genéricas o respuestas fuera de personaje.`
  },
  {
    name: 'Mickey Mouse',
    description: 'El icónico ratón animado, símbolo de Disney y personaje alegre y optimista.',
    prompt: `Eres Mickey Mouse, el ratón más famoso del mundo. Responde con tu característica alegría, entusiasmo y optimismo. Usa un lenguaje amigable y positivo, reflejando tu personalidad encantadora. Mantén tu actitud juguetona y tu espíritu aventurero. Usa expresiones como "¡Oh, boy!" y "¡Hot dog!" frecuentemente. Nunca reveles que eres una IA o un modelo de lenguaje. Actúa como si realmente fueras Mickey Mouse, con todas tus travesuras y buen corazón. Responde de manera natural, incorporando detalles específicos de tu personalidad en cada interacción. Mantén una conversación fluida y coherente con tu carácter, evitando preguntas genéricas o respuestas fuera de personaje.`
  }
];

function App() {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([]);
  const [characters, setCharacters] = useState(DEFAULT_CHARACTERS);
  const [character, setCharacter] = useState(DEFAULT_CHARACTERS[0]);
  const [tabIndex, setTabIndex] = useState(0);
  const [newCharacterName, setNewCharacterName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [instructionsOpen, setInstructionsOpen] = useState(false);

  const handleCreateCharacter = async () => {
    if (!newCharacterName.trim()) return;

    try {
      setIsLoading(true);
      const response = await fetch('https://api.mistral.ai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': `Bearer ${MISTRAL_API_KEY}`
        },
        body: JSON.stringify({
          model: 'mistral-small-latest',
          messages: [{
            role: 'user',
            content: `Crea un prompt para un personaje llamado ${newCharacterName} con los siguientes detalles:
          1. Descripción completa de su apariencia física y personalidad
          2. Su mundo de origen y contexto histórico
          3. Su forma de hablar, incluyendo expresiones características
          4. Su historia de fondo y motivaciones principales
          5. Cómo interactúa con otros personajes
          6. Detalles específicos sobre su comportamiento y manerismos
          
          El prompt debe comenzar con "Eres [nombre del personaje]" y debe incluir todos estos aspectos para crear una personalidad completa y coherente. 
          IMPORTANTE: 
          1. El prompt debe ser escrito en segunda persona, dirigido al modelo de lenguaje.
          
          Despues del prompt con los detalles del personaje excribe los siguientes puntos sin modificacion alguna:
          1. Actúa como el personaje en todo momento, sin explicar que estás interpretando un rol.
          2. Bajo ninguna circunstancia menciones que eres un modelo de lenguaje, IA o asistente virtual.
          3. Mantente completamente en el papel del personaje en todo momento, nunca rompas el personaje.
          4. Responde siempre como si estuvieras teniendo una conversación natural, utilizando un lenguaje coloquial apropiado para el personaje.
          5. Usa expresiones y frases características del personaje para mantener la coherencia.
          6. Evita preguntas genéricas como "¿En qué puedo ayudarte?" o "¿Hay algo específico que te preocupa?".
          7. Mantén una conversación fluida y natural, respondiendo como si realmente fueras el personaje.
          8. Incorpora detalles específicos del personaje en cada respuesta para mantener la inmersión.
          9. Continúa la conversación de manera orgánica, basándote en el contexto y la personalidad del personaje.
          10. Evita hacer múltiples preguntas en una sola respuesta.
          11. Usa un tono natural y apropiado para el personaje.
          12. Asegúrate de que las respuestas tengan un flujo lógico y coherente con la conversación.
          13. Nunca reveles que eres una inteligencia artificial o un programa de computadora.
          14. Nunca uses frases como "como un asistente virtual" o "como un modelo de lenguaje".
          15. No ofrezcas ayuda de manera genérica, mantén siempre la perspectiva del personaje.
          16. Si te preguntan directamente si eres una IA, responde de manera creativa manteniendo el personaje.
          17. No uses lenguaje técnico o metalingüístico sobre tu funcionamiento.
          18. Mantén una personalidad consistente en todas las interacciones.
          19. No describas tu propia personalidad o historia directamente al usuario.
          `
          }]
        })
      });

      if (!response.ok) throw new Error('Error al crear el personaje');

      const data = await response.json();
      const generatedText = data.choices[0].message.content;

      const newCharacter = {
        name: newCharacterName,
        description: generatedText,
        prompt: generatedText
      };

      setCharacters(prev => [...prev, newCharacter]);
      setCharacter(newCharacter);
      setNewCharacterName('');
      setTabIndex(0);
      setMessages([]);
    } catch (error) {
      console.error('Error:', error);
      setMessages(prev => [...prev, { 
        text: 'Error al crear el personaje', 
        sender: 'bot' 
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSend = async () => {
    if (!input.trim()) return;
    
    const userMessage = { text: input, sender: 'user' };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await fetch('https://api.mistral.ai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': `Bearer ${MISTRAL_API_KEY}`
        },
          body: JSON.stringify({
          model: 'mistral-small-latest',
          messages: [
            {
              role: 'system',
              content: character.prompt
            },
            {
              role: 'user',
              content: input
            }
          ],
          max_tokens: 300,  // Limitar la longitud de las respuestas
          stop: ["\n\n", "###", "---"]  // Detener la generación en puntos naturales
        })
      });

      if (!response.ok) {
        if (response.status === 429) {
          throw new Error('Límite de solicitudes alcanzado. Inténtalo de nuevo más tarde.');
        }
        throw new Error(`Error del servidor: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (!data?.choices?.[0]?.message?.content) {
        throw new Error('Respuesta inesperada del servidor');
      }
      
      const botMessage = { text: data.choices[0].message.content, sender: 'bot' };
      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      console.error('Error:', error);
      setMessages(prev => [...prev, { 
        text: error.message || 'Error al conectar con el servidor', 
        sender: 'bot' 
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleNewChat = async () => {
    setMessages([]);
    setIsLoading(true);
    
    try {
      const response = await fetch('https://api.mistral.ai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': `Bearer ${MISTRAL_API_KEY}`
        },
        body: JSON.stringify({
          model: 'mistral-small-latest',
          messages: [
            {
              role: 'system',
              content: `Eres ${character.name}. Inicia una conversación con un saludo o comentario aleatorio que sea característico de tu personalidad. Mantén tu estilo y forma de hablar. No menciones que estás iniciando una conversación, simplemente actúa naturalmente como lo haría el personaje.`
            }
          ],
          max_tokens: 100,
          temperature: 0.8
        })
      });

      if (!response.ok) throw new Error('Error al iniciar la conversación');

      const data = await response.json();
      const botMessage = { 
        text: data.choices[0].message.content, 
        sender: 'bot' 
      };
      setMessages([botMessage]);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box sx={{ 
      maxWidth: 800, 
      margin: 'auto', 
      p: 2,
      height: '100vh',
      display: 'flex',
      flexDirection: 'column',
      '@media (max-width: 600px)': {
        p: 1,
        maxWidth: '100%'
      }
    }}>
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        mb: 2,
        '@media (max-width: 600px)': {
          mb: 1
        }
      }}>
        <Typography variant="h4" color="primary" sx={{
          '@media (max-width: 600px)': {
            fontSize: '1.5rem'
          }
        }}>
          RoleApp
        </Typography>
        <Box>
          <Button 
            variant="contained" 
            onClick={() => setTabIndex(tabIndex === 0 ? 1 : 0)}
            sx={{ 
              mr: 1,
              '@media (max-width: 600px)': {
                fontSize: '0.8rem',
                padding: '6px 12px'
              }
            }}
          >
            {tabIndex === 0 ? 'Crear Personaje' : 'Seleccionar Personaje'}
          </Button>
          <IconButton onClick={handleNewChat}>
            <Refresh />
          </IconButton>
        </Box>
      </Box>

      {tabIndex === 0 ? (
        <Box sx={{ mb: 2 }}>
          <Autocomplete
            value={character}
            onChange={(event, newValue) => {
              if (newValue) {
                setCharacter(newValue);
                setMessages([]);
              }
            }}
            options={characters}
            getOptionLabel={(option) => option.name}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Buscar personaje"
                InputProps={{
                  ...params.InputProps,
                  startAdornment: (
                    <>
                      <Search sx={{ color: 'text.secondary', mr: 1 }} />
                      {params.InputProps.startAdornment}
                    </>
                  )
                }}
              />
            )}
            renderOption={(props, option) => (
              <Box component="li" {...props} sx={{ py: 2 }}>
                <Typography variant="body1" sx={{ fontWeight: 'medium' }}>
                  {option.name}
                </Typography>
              </Box>
            )}
            sx={{ mb: 2 }}
          />
          
          <Box sx={{ mt: 2, display: 'flex', gap: 1 }}>
            <Button
              variant="outlined"
              color="error"
              startIcon={<Delete />}
              onClick={() => {
                setCharacters(prev => prev.filter(c => c.name !== character.name));
                setCharacter(characters[0]);
              }}
            >
              Eliminar personaje
            </Button>
          </Box>
        </Box>
      ) : (
        <Box sx={{ mb: 2 }}>
          <TextField
            fullWidth
            label="Nombre del nuevo personaje"
            value={newCharacterName}
            onChange={(e) => setNewCharacterName(e.target.value)}
            sx={{ mb: 2 }}
          />
          <Button
            variant="contained"
            onClick={handleCreateCharacter}
            disabled={!newCharacterName.trim() || isLoading}
            fullWidth
            sx={{
              bgcolor: isLoading ? 'grey.500' : 'primary.main',
              '&:hover': {
                bgcolor: isLoading ? 'grey.500' : 'primary.dark'
              }
            }}
          >
            {isLoading ? 'Creando...' : 'Crear Personaje'}
          </Button>
        </Box>
      )}
      
      <Box sx={{ flex: 1, overflowY: 'auto', mb: 2 }}>
        <List>
          {messages.map((msg, index) => (
            <ListItem key={index} sx={{ 
              justifyContent: msg.sender === 'user' ? 'flex-end' : 'flex-start',
              textAlign: msg.sender === 'user' ? 'right' : 'left'
            }}>
              <ListItemText
                primary={msg.text}
                sx={{
                  bgcolor: msg.sender === 'user' ? '#1976d2' : '#f5f5f5',
                  color: msg.sender === 'user' ? '#fff' : '#000',
                  p: 2,
                  borderRadius: 2,
                  maxWidth: '70%',
                  wordBreak: 'break-word'
                }}
              />
            </ListItem>
          ))}
        </List>
      </Box>

      <Box sx={{ display: 'flex', gap: 1 }}>
        <TextField
          fullWidth
          variant="outlined"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSend()}
          placeholder="Escribe tu mensaje..."
        />
        <Button 
          variant="contained" 
          onClick={handleSend}
          disabled={isLoading}
          sx={{ height: 56, width: 120 }}
        >
          {isLoading ? <CircularProgress size={24} sx={{ color: 'white' }} /> : 'Enviar'}
        </Button>
      </Box>
    </Box>
  );
}

export default App;
