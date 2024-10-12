'use client';

import { useEffect, useState } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import Sidebar from '@/components/Sidebar';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

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
  "%ROST": number | null;
  "#ERROR!": number | null;
  tot: number | null;
  avg: number | null;
}

export default function PlayerRankings() {
  const [players, setPlayers] = useState<Player[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [positionFilter, setPositionFilter] = useState('');
  const [sortBy, setSortBy] = useState('Rank');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const supabase = createClientComponentClient();

  useEffect(() => {
    fetchPlayers();
  }, []);

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
    fetchPlayers();
  };

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex-1 ml-64 p-8">
        <h1 className="text-3xl font-bold mb-8">Player Rankings</h1>
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
        </div>
        <Table>
          <TableHeader>
            <TableRow>
              {['Rank', 'Player', 'Team', 'Position', 'MIN', 'PTS', 'REB', 'AST', 'STL', 'BLK', 'TO', 'FGM', 'FGA', 'FG%', 'FTM', 'FTA', 'FT%', '3PM', '%ROST', '#ERROR!', 'TOT', 'AVG'].map((header) => (
                <TableHead key={header} onClick={() => handleSort(header)} className="cursor-pointer">
                  {header} {sortBy === header && (sortOrder === 'asc' ? '↑' : '↓')}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {players.map((player) => (
              <TableRow key={player.id}>
                <TableCell>{player.Rank}</TableCell>
                <TableCell>{player.Player}</TableCell>
                <TableCell>{player.Team}</TableCell>
                <TableCell>{player.Position}</TableCell>
                <TableCell>{player.MIN}</TableCell>
                <TableCell>{player.PTS}</TableCell>
                <TableCell>{player.REB}</TableCell>
                <TableCell>{player.AST}</TableCell>
                <TableCell>{player.STL}</TableCell>
                <TableCell>{player.BLK}</TableCell>
                <TableCell>{player.TO}</TableCell>
                <TableCell>{player.FGM}</TableCell>
                <TableCell>{player.FGA}</TableCell>
                <TableCell>{player.FGM && player.FGA ? ((player.FGM / player.FGA) * 100).toFixed(1) + '%' : '-'}</TableCell>
                <TableCell>{player.FTM}</TableCell>
                <TableCell>{player.FTA}</TableCell>
                <TableCell>{player.FTM && player.FTA ? ((player.FTM / player.FTA) * 100).toFixed(1) + '%' : '-'}</TableCell>
                <TableCell>{player['3PM']}</TableCell>
                <TableCell>{player['%ROST']}</TableCell>
                <TableCell>{player['#ERROR!']}</TableCell>
                <TableCell>{player.tot}</TableCell>
                <TableCell>{player.avg}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
