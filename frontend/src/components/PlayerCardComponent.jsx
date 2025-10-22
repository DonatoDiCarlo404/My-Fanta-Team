import React from 'react';
import { Card, Button } from 'react-bootstrap';

const PlayerCard = ({ player, onAddPlayer }) => {
  return (
    <Card className="mb-3">
      <Card.Body className='d-grid justify-content-center'>
        <Card.Title>{player.nome}</Card.Title>
        <Card.Text>
          <strong>Ruolo:</strong> {player.ruolo}<br/>
          <strong>Squadra:</strong> {player.squadra}<br/>
          <strong>Nazionalità:</strong> {player.nazionalità}
        </Card.Text>
        <Button 
          variant="success" 
          onClick={() => onAddPlayer(player)}
        >
          Aggiungi alla squadra
        </Button>
      </Card.Body>
    </Card>
  );
};

export default PlayerCard;