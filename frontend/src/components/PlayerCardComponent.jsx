import React from 'react';
import { Card, Button } from 'react-bootstrap';

const PlayerCard = ({ player, onAddPlayer }) => {
  return (
    <Card className="mb-3">
      <Card.Body className='d-grid justify-content-center'>
        <Card.Title className='text-white'>{player.nome}</Card.Title>
        <Card.Text className='text-white'>
          <strong>Ruolo:</strong> {player.ruolo}<br/>
          <strong>Squadra:</strong> {player.squadra}<br/>
          <strong>Nazionalità:</strong> {player.nazionalità}
        </Card.Text>
        <Button 
          variant="success" 
          onClick={() => onAddPlayer(player)}
        >
          <i className="bi bi-plus-circle"> Aggiungi alla Squadra</i>
        </Button>
      </Card.Body>
    </Card>
  );
};

export default PlayerCard;