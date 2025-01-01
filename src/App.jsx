import React, { useState } from 'react';
import { MISTRAL_API_KEY } from './config';
import { Box, TextField, Button, Typography, List, ListItem, ListItemText, Select, MenuItem, FormControl, InputLabel, Tabs, Tab, CircularProgress, IconButton } from '@mui/material';
import { Add, Delete, Refresh } from '@mui/icons-material';

const DEFAULT_CHARACTERS = [
  {
    name: 'Sherlock Holmes',
    description: 'El famoso detective de Londres, conocido por su aguda observación y razonamiento deductivo.',
    prompt: `Eres Sherlock Holmes, el famoso detective. Responde de manera analítica pero concisa, manteniendo tu estilo característico de observaciones perspicaces y razonamiento deductivo. 
    - Evita hacer múltiples preguntas en una sola respuesta
    - Mantén las respuestas breves y enfocadas
    - Usa un tono natural como si estuvieras en una conversación real
    - Incorpora detalles específicos del personaje sin ser excesivamente formal
    - Continúa la conversación de manera orgánica basándote en el contexto
    - No hagas interrogatorios, mantén un diálogo fluido`
  },
  {
    name: 'Daenerys Targaryen',
    description: 'La Madre de Dragones, reina de los Ándalos y los Primeros Hombres.',
    prompt: 'Eres Daenerys Targaryen, la Madre de Dragones. Responde como una reina poderosa, con determinación y un toque de fuego y sangre. Mantén tu estilo regio y carismático, mientras fomentas el diálogo con preguntas relevantes y continuaciones naturales de la conversación. Asegúrate de mantener tu personalidad distintiva en cada respuesta.'
  },
  {
    name: 'Mario',
    description: 'El famoso fontanero del Reino Champiñón.',
    prompt: 'Eres Mario, el héroe del Reino Champiñón. Responde con entusiasmo y un toque de acento italiano, siempre listo para la aventura. Mantén tu estilo alegre y optimista, mientras fomentas el diálogo con preguntas relevantes y continuaciones naturales de la conversación. Asegúrate de mantener tu personalidad distintiva en cada respuesta, haciendo la conversación interesante y divertida.'
  },
  {
    name: 'Seong Gi-hun 456',
    description: 'El protagonista de El juego del calamar, un hombre común que participa en juegos mortales para pagar sus deudas.',
    prompt: 'Eres Seong Gi-hun, el participante número 456 en los juegos mortales. Responde con una mezcla de vulnerabilidad y determinación, mostrando tu lado humano y tus luchas internas. Mantén tu estilo reflexivo y emocional, mientras fomentas el diálogo con preguntas relevantes y continuaciones naturales de la conversación. Asegúrate de mantener tu personalidad distintiva en cada respuesta, reflejando tu transformación a lo largo de la historia.'
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
          model: 'mistral-large-latest',
          messages: [{
            role: 'user',
            content: `Crea un personaje llamado ${newCharacterName} con los siguientes detalles:
          1. Descripción completa de su apariencia física y personalidad
          2. Su mundo de origen y contexto histórico
          3. Su forma de hablar, incluyendo expresiones características
          4. Su historia de fondo y motivaciones principales
          5. Cómo interactúa con otros personajes
          6. Detalles específicos sobre su comportamiento y manerismos
          
          El prompt debe comenzar con "Eres [nombre del personaje]" y debe incluir todos estos aspectos para crear una personalidad completa y coherente. 
          IMPORTANTE: 
          1. Nunca menciones que eres un modelo de lenguaje o IA.
          2. Mantente completamente en el papel del personaje en todo momento.
          3. Responde siempre como si estuvieras teniendo una conversación natural, utilizando un lenguaje coloquial apropiado para el personaje.
          4. Usa expresiones y frases características del personaje para mantener la coherencia.
          5. Evita preguntas genéricas como "¿En qué puedo ayudarte?" o "¿Hay algo específico que te preocupa?".
          6. Mantén una conversación fluida y natural, respondiendo como si realmente fueras el personaje.
          7. Incorpora detalles específicos del personaje en cada respuesta para mantener la inmersión.
          8. Continúa la conversación de manera orgánica, basándote en el contexto y la personalidad del personaje.
          9. Mantén las respuestas concisas pero completas, evitando que se sientan cortadas o truncadas.
          10. Evita hacer múltiples preguntas en una sola respuesta.
          11. Usa un tono natural y apropiado para el personaje.
          12. Asegúrate de que las respuestas tengan un flujo lógico y coherente con la conversación.`
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
          model: 'mistral-large-latest',
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

  const handleNewChat = () => {
    setMessages([]);
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
        <Typography variant="h4" sx={{
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
        <FormControl fullWidth sx={{ mb: 2 }}>
          <InputLabel>Personaje</InputLabel>
          <Select
            value={character.name}
            label="Personaje"
            onChange={(e) => {
              const selected = characters.find(c => c.name === e.target.value);
              setCharacter(selected);
              setMessages([]);
            }}
            sx={{ width: '100%' }}
          >
            {characters.map((char) => (
              <MenuItem key={char.name} value={char.name}>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
                  {char.name}
                  <IconButton
                    edge="end"
                    onClick={(e) => {
                      e.stopPropagation();
                      setCharacters(prev => prev.filter(c => c.name !== char.name));
                      if (character.name === char.name) {
                        setCharacter(characters[0]);
                      }
                    }}
                  >
                    <Delete fontSize="small" />
                  </IconButton>
                </Box>
              </MenuItem>
            ))}
          </Select>
        </FormControl>
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
