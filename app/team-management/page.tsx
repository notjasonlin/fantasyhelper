'use client';

import { useEffect, useState } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import Sidebar from '@/components/Sidebar';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface Player {
  id: number | null;
  Rank: number | null;
  Player: string | null;
  Team: string | null;
  Position: string | null;
  MIN: number | null;
  PTS: number | null;
  REB: number | null;
  AST: number | null;
  STL: number | null;
  BLK: number | null;
  TO: number | null;
  FGM: number | null;
  FGA: number | null;
  FTM: number | null;
  FTA: number | null;
  "3PM": number | null;
}

interface TeamSlot {
  position: string;
  player: Player | null;
}

export default function TeamManagement() {
  const [allPlayers, setAllPlayers] = useState<Player[]>([]);
  const [teamSlots, setTeamSlots] = useState<TeamSlot[]>([
    { position: 'PG', player: null },
    { position: 'SG', player: null },
    { position: 'SF', player: null },
    { position: 'PF', player: null },
    { position: 'C', player: null },
    { position: 'G', player: null },
    { position: 'F', player: null },
    { position: 'UTIL', player: null },
    { position: 'UTIL', player: null },
    { position: 'UTIL', player: null },
    { position: 'BN', player: null },
    { position: 'BN', player: null },
    { position: 'BN', player: null },
  ]);
  const [searchTerm, setSearchTerm] = useState('');
  const [positionFilter, setPositionFilter] = useState('ALL');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const supabase = createClientComponentClient();

  useEffect(() => {
    fetchAllPlayers();
  }, []);

  async function fetchAllPlayers() {
    setIsLoading(true);
    setError(null);
    const { data, error } = await supabase.from('fantasy_players').select('*');
    if (error) {
      console.error('Error fetching players:', error);
      setError('Failed to fetch players. Please try again later.');
    } else {
      setAllPlayers(data as Player[]);
    }
    setIsLoading(false);
  }

  const addPlayerToTeam = (player: Player, slotIndex: number) => {
    const newTeamSlots = [...teamSlots];
    newTeamSlots[slotIndex].player = player;
    setTeamSlots(newTeamSlots);
  };

  const removePlayerFromTeam = (slotIndex: number) => {
    if (window.confirm('Are you sure you want to remove this player from your team?')) {
      const newTeamSlots = [...teamSlots];
      newTeamSlots[slotIndex].player = null;
      setTeamSlots(newTeamSlots);
    }
  };

  const filteredPlayers = allPlayers.filter(player =>
    player.Player?.toLowerCase().includes(searchTerm.toLowerCase()) &&
    (positionFilter === '' || player.Position === positionFilter)
  );

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex-1 ml-64 p-8">
        <h1 className="text-3xl font-bold mb-8">Team Management</h1>
        {isLoading ? (
          <p>Loading...</p>
        ) : error ? (
          <p className="text-red-500">{error}</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Card>
              <CardHeader>
                <CardTitle>My Team</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Position</TableHead>
                      <TableHead>Player</TableHead>
                      <TableHead>Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {teamSlots.map((slot, index) => (
                      <TableRow key={index}>
                        <TableCell>{slot.position}</TableCell>
                        <TableCell>{slot.player?.Player || '-'}</TableCell>
                        <TableCell>
                          {slot.player && (
                            <Button onClick={() => removePlayerFromTeam(index)}>Remove</Button>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Available Players</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col gap-4 mb-4">
                  <Input
                    type="text"
                    placeholder="Search players..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                  <Select value={positionFilter} onValueChange={setPositionFilter}>
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Filter by Position" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ALL">All Positions</SelectItem>
                      <SelectItem value="PG">PG</SelectItem>
                      <SelectItem value="SG">SG</SelectItem>
                      <SelectItem value="SF">SF</SelectItem>
                      <SelectItem value="PF">PF</SelectItem>
                      <SelectItem value="C">C</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Player</TableHead>
                      <TableHead>Position</TableHead>
                      <TableHead>Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredPlayers.map((player) => (
                      <TableRow key={player.id}>
                        <TableCell>{player.Player}</TableCell>
                        <TableCell>{player.Position}</TableCell>
                        <TableCell>
                          <Select onValueChange={(value: string) => addPlayerToTeam(player, parseInt(value))}>
                            <SelectTrigger className="w-[180px]">
                              <SelectValue placeholder="Add to..." />
                            </SelectTrigger>
                            <SelectContent>
                              {teamSlots.map((slot, index) => (
                                <SelectItem key={index} value={index.toString()}>
                                  {slot.position} {slot.player ? '(Replace)' : ''}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}
