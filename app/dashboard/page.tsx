'use client';

import { useEffect, useState } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { useRouter } from 'next/navigation';
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
}

export default function Dashboard() {
  const [players, setPlayers] = useState<Player[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [positionFilter, setPositionFilter] = useState('');
  const [loading, setLoading] = useState(true);
  const [sessionChecked, setSessionChecked] = useState(false);
  const [checkedPlayers, setCheckedPlayers] = useState<Set<number>>(new Set());
  const supabase = createClientComponentClient();
  const router = useRouter();

  useEffect(() => {
    const checkSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) {
          router.push('/sign-in');
        } else {
          setSessionChecked(true);
          setLoading(false);
          fetchPlayers();
        }
      } catch (error) {
        console.error('Error checking session:', error);
        setLoading(false);
      }
    };

    checkSession();
    loadCheckedPlayers();
  }, [supabase, router]);

  async function fetchPlayers() {
    let query = supabase.from('fantasy_players').select('*');
    
    if (searchTerm) {
      query = query.ilike('Player', `%${searchTerm}%`);
    }
    
    if (positionFilter) {
      query = query.eq('Position', positionFilter);
    }

    const { data, error } = await query;
    if (error) console.error('Error fetching players:', error);
    else setPlayers(data as Player[]);
  }

  const handlePositionFilter = (position: string) => {
    setPositionFilter(position === positionFilter ? '' : position);
    fetchPlayers();
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

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!sessionChecked) {
    return <div>Checking session...</div>;
  }

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex-1 ml-64 p-8">
        <h1 className="text-3xl font-bold mb-8">NBA Fantasy Draft Dashboard</h1>
        <div className="flex flex-col gap-4 mb-8">
          <Input
            type="text"
            placeholder="Search players..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <div className="flex gap-2">
            <Button 
              onClick={() => handlePositionFilter('')}
              variant={positionFilter === '' ? 'default' : 'outline'}
            >
              All Positions
            </Button>
            <Button 
              onClick={() => handlePositionFilter('PG')}
              variant={positionFilter === 'PG' ? 'default' : 'outline'}
            >
              PG
            </Button>
            <Button 
              onClick={() => handlePositionFilter('SG')}
              variant={positionFilter === 'SG' ? 'default' : 'outline'}
            >
              SG
            </Button>
            <Button 
              onClick={() => handlePositionFilter('SF')}
              variant={positionFilter === 'SF' ? 'default' : 'outline'}
            >
              SF
            </Button>
            <Button 
              onClick={() => handlePositionFilter('PF')}
              variant={positionFilter === 'PF' ? 'default' : 'outline'}
            >
              PF
            </Button>
            <Button 
              onClick={() => handlePositionFilter('C')}
              variant={positionFilter === 'C' ? 'default' : 'outline'}
            >
              C
            </Button>
          </div>
          <Button onClick={fetchPlayers}>Search</Button>
          <Button onClick={resetCheckedPlayers}>Reset Checked Players</Button>
        </div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Rank</TableHead>
              <TableHead>Player</TableHead>
              <TableHead>Team</TableHead>
              <TableHead>Position</TableHead>
              <TableHead>MIN</TableHead>
              <TableHead>PTS</TableHead>
              <TableHead>REB</TableHead>
              <TableHead>AST</TableHead>
              <TableHead>STL</TableHead>
              <TableHead>BLK</TableHead>
              <TableHead>TO</TableHead>
              <TableHead>Selected</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {players.map((player) => (
              <TableRow key={player.id} className={checkedPlayers.has(player.id!) ? 'opacity-50' : ''}>
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
      </div>
    </div>
  );
}
