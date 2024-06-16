import { useState } from 'react';
import { useEvents, useAddEvent, useUpdateEvent, useDeleteEvent } from '../integrations/supabase/index.js';
import { Container, VStack, HStack, Button, Input, Select, Text, Box } from '@chakra-ui/react';

const Events = () => {
  const { data: events, isLoading, isError } = useEvents();
  const addEvent = useAddEvent();
  const updateEvent = useUpdateEvent();
  const deleteEvent = useDeleteEvent();

  const [newEvent, setNewEvent] = useState({ name: '', date: '', venue: '' });
  const [editingEvent, setEditingEvent] = useState(null);

  const handleAddEvent = () => {
    addEvent.mutate(newEvent);
    setNewEvent({ name: '', date: '', venue: '' });
  };

  const handleUpdateEvent = () => {
    updateEvent.mutate(editingEvent);
    setEditingEvent(null);
  };

  const handleDeleteEvent = (id) => {
    deleteEvent.mutate(id);
  };

  if (isLoading) return <Text>Loading...</Text>;
  if (isError) return <Text>Error loading events</Text>;

  return (
    <Container>
      <VStack spacing={4}>
        <Box>
          <Text fontSize="2xl" fontWeight="bold">Add New Event</Text>
          <HStack spacing={2}>
            <Input placeholder="Name" value={newEvent.name} onChange={(e) => setNewEvent({ ...newEvent, name: e.target.value })} />
            <Input type="date" value={newEvent.date} onChange={(e) => setNewEvent({ ...newEvent, date: e.target.value })} />
            <Select placeholder="Select venue" value={newEvent.venue} onChange={(e) => setNewEvent({ ...newEvent, venue: e.target.value })}>
              {/* Options should be populated dynamically */}
              <option value="1">Venue 1</option>
              <option value="2">Venue 2</option>
            </Select>
            <Button onClick={handleAddEvent}>Add Event</Button>
          </HStack>
        </Box>

        <Box>
          <Text fontSize="2xl" fontWeight="bold">Events</Text>
          {events.map((event) => (
            <HStack key={event.id} spacing={2}>
              {editingEvent?.id === event.id ? (
                <>
                  <Input value={editingEvent.name} onChange={(e) => setEditingEvent({ ...editingEvent, name: e.target.value })} />
                  <Input type="date" value={editingEvent.date} onChange={(e) => setEditingEvent({ ...editingEvent, date: e.target.value })} />
                  <Select value={editingEvent.venue} onChange={(e) => setEditingEvent({ ...editingEvent, venue: e.target.value })}>
                    {/* Options should be populated dynamically */}
                    <option value="1">Venue 1</option>
                    <option value="2">Venue 2</option>
                  </Select>
                  <Button onClick={handleUpdateEvent}>Save</Button>
                  <Button onClick={() => setEditingEvent(null)}>Cancel</Button>
                </>
              ) : (
                <>
                  <Text>{event.name}</Text>
                  <Text>{event.date}</Text>
                  <Text>{event.venue}</Text>
                  <Button onClick={() => setEditingEvent(event)}>Edit</Button>
                  <Button onClick={() => handleDeleteEvent(event.id)}>Delete</Button>
                </>
              )}
            </HStack>
          ))}
        </Box>
      </VStack>
    </Container>
  );
};

export default Events;