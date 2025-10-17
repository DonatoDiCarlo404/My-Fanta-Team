import React from 'react';
import { Link } from 'react-router-dom';
import { Table } from 'react-bootstrap';

const Dashboard = () => {
  const teams = [
    { id: 1, name: 'Juventus' },
    { id: 2, name: 'Milan' },
  ];

  return (
    <div>
      <h2>Dashboard — Le tue squadre</h2>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>#</th>
            <th>Nome Squadra</th>
          </tr>
        </thead>
        <tbody>
          {teams.map((team) => (
            <tr key={team.id}>
              <td>{team.id}</td>
              <td>
                <Link to={`/team/${team.id}`}>{team.name}</Link>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
};

export default Dashboard;