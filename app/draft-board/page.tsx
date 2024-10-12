'use client';

import { useEffect, useState } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import Sidebar from '@/components/Sidebar';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import * as Dialog from '@radix-ui/react-dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DialogTrigger } from "@radix-ui/react-dialog";
import TeamManagement from '@/components/TeamManagement';

export interface Player {
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

export default function DraftBoard() {
  const [players, setPlayers] = useState<Player[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [positionFilter, setPositionFilter] = useState('');
  const [sortBy, setSortBy] = useState('Rank');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [checkedPlayers, setCheckedPlayers] = useState<Set<number>>(new Set());
  const [selectedPlayer, setSelectedPlayer] = useState<Player | null>(null);
  const supabase = createClientComponentClient();

  useEffect(() => {
    fetchPlayers();
    loadCheckedPlayers();
  }, [searchTerm, positionFilter, sortBy, sortOrder]);

  async function fetchPlayers() {
    let query = supabase.from('fantasy_players').select('*');
    
    if (searchTerm) {
      query = query.ilike('Player', `%${searchTerm}%`);
    }
    
    if (positionFilter && positionFilter !== 'all') {
      query = query.eq('Position', positionFilter);
    }

    query = query.order(sortBy, { ascending: sortOrder === 'asc' });

    const { data, error } = await query;
    if (error) console.error('Error fetching players:', error);
    else setPlayers(data as Player[]);
  }

  const handleSort = (column: string) => {
    if (column === sortBy) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(column);
      setSortOrder('asc');
    }
  };

  const handleCheckPlayer = (playerId: number) => {
    const newCheckedPlayers = new Set(checkedPlayers);
    if (newCheckedPlayers.has(playerId)) {
      newCheckedPlayers.delete(playerId);
    } else {
      newCheckedPlayers.add(playerId);
    }
    setCheckedPlayers(newCheckedPlayers);
    localStorage.setItem('checkedPlayers', JSON.stringify(Array.from(newCheckedPlayers)));
  };

  const loadCheckedPlayers = () => {
    const storedCheckedPlayers = localStorage.getItem('checkedPlayers');
    if (storedCheckedPlayers) {
      setCheckedPlayers(new Set(JSON.parse(storedCheckedPlayers)));
    }
  };

  const resetCheckedPlayers = () => {
    setCheckedPlayers(new Set());
    localStorage.removeItem('checkedPlayers');
  };

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex-1 ml-64 p-8">
        <h1 className="text-3xl font-bold mb-8">Draft Board</h1>
        <div className="flex flex-col gap-4 mb-8">
          <Input
            type="text"
            placeholder="Search players..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <Select value={positionFilter} onValueChange={setPositionFilter}>
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="All Positions" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Positions</SelectItem>
              <SelectItem value="PG">PG</SelectItem>
              <SelectItem value="SG">SG</SelectItem>
              <SelectItem value="SF">SF</SelectItem>
              <SelectItem value="PF">PF</SelectItem>
              <SelectItem value="C">C</SelectItem>
            </SelectContent>
          </Select>
          <Button onClick={fetchPlayers}>Apply Filters</Button>
          <Button onClick={resetCheckedPlayers}>Reset Checked Players</Button>
        </div>
        <Table>
          <TableHeader>
            <TableRow>
              {['Rank', 'Player', 'Team', 'Position', 'MIN', 'PTS', 'REB', 'AST', 'STL', 'BLK', 'TO', 'FG%', 'FT%', '3PM', 'Selected'].map((header) => (
                <TableHead key={header} onClick={() => handleSort(header)} className="cursor-pointer">
                  {header} {sortBy === header && (sortOrder === 'asc' ? '↑' : '↓')}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {players.map((player) => (
              <TableRow key={player.id} className={checkedPlayers.has(player.id!) ? 'opacity-50' : ''}>
                <TableCell>{player.Rank}</TableCell>
                <TableCell>
                  <Dialog.Root>
                    <DialogTrigger asChild>
                      <Button variant="link">{player.Player}</Button>
                    </DialogTrigger>
                    <Dialog.Content>
                      <Dialog.Title>{player.Player}</Dialog.Title>
                      <div>
                        <p>Team: {player.Team}</p>
                        <p>Position: {player.Position}</p>
                        <p>MIN: {player.MIN}</p>
                        <p>PTS: {player.PTS}</p>
                        <p>REB: {player.REB}</p>
                        <p>AST: {player.AST}</p>
                        <p>STL: {player.STL}</p>
                        <p>BLK: {player.BLK}</p>
                        <p>TO: {player.TO}</p>
                        <p>FG%: {player.FGM && player.FGA ? ((player.FGM / player.FGA) * 100).toFixed(1) + '%' : '-'}</p>
                        <p>FT%: {player.FTM && player.FTA ? ((player.FTM / player.FTA) * 100).toFixed(1) + '%' : '-'}</p>
                        <p>3PM: {player['3PM']}</p>
                      </div>
                    </Dialog.Content>
                  </Dialog.Root>
                </TableCell>
                <TableCell>{player.Team}</TableCell>
                <TableCell>{player.Position}</TableCell>
                <TableCell>{player.MIN}</TableCell>
                <TableCell>{player.PTS}</TableCell>
                <TableCell>{player.REB}</TableCell>
                <TableCell>{player.AST}</TableCell>
                <TableCell>{player.STL}</TableCell>
                <TableCell>{player.BLK}</TableCell>
                <TableCell>{player.TO}</TableCell>
                <TableCell>{player.FGM && player.FGA ? ((player.FGM / player.FGA) * 100).toFixed(1) + '%' : '-'}</TableCell>
                <TableCell>{player.FTM && player.FTA ? ((player.FTM / player.FTA) * 100).toFixed(1) + '%' : '-'}</TableCell>
                <TableCell>{player['3PM']}</TableCell>
                <TableCell>
                  <Checkbox
                    checked={checkedPlayers.has(player.id!)}
                    onCheckedChange={() => handleCheckPlayer(player.id!)}
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <TeamManagement players={players} checkedPlayers={checkedPlayers} />
      </div>
    </div>
  );
}