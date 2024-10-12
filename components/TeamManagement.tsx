import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Player } from '@/app/draft-board/page';

interface TeamManagementProps {
  players: Player[];
  checkedPlayers: Set<number>;
}

const TeamManagement: React.FC<TeamManagementProps> = ({ players, checkedPlayers }) => {
  const [teamName, setTeamName] = useState('');
  const [teams, setTeams] = useState<{ name: string; players: Player[] }[]>([]);

  useEffect(() => {
    const storedTeams = localStorage.getItem('teams');
    if (storedTeams) {
      setTeams(JSON.parse(storedTeams));
    }
  }, []);

  const createTeam = () => {
    if (teamName) {
      const selectedPlayers = players.filter(player => checkedPlayers.has(player.id!));
      const newTeam = { name: teamName, players: selectedPlayers };
      const updatedTeams = [...teams, newTeam];
      setTeams(updatedTeams);
      localStorage.setItem('teams', JSON.stringify(updatedTeams));
      setTeamName('');
    }
  };

  return (
    <div className="mt-8">
      <h2 className="text-2xl font-bold mb-4">Team Management</h2>
      <div className="flex gap-4 mb-4">
        <Input
          type="text"
          placeholder="Enter team name"
          value={teamName}
          onChange={(e) => setTeamName(e.target.value)}
        />
        <Button onClick={createTeam}>Create Team</Button>
      </div>
      <div>
        {teams.map((team, index) => (
          <div key={index} className="mb-4">
            <h3 className="text-xl font-semibold">{team.name}</h3>
            <ul>
              {team.players.map(player => (
                <li key={player.id}>{player.Player}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TeamManagement;

