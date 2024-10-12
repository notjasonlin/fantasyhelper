'use client';

import { useEffect, useState } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { Select } from "@/components/ui/select";
import Sidebar from '@/components/Sidebar';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { BarChart } from "@/components/ui/bar-chart";
import { SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import * as Dialog from '@radix-ui/react-dialog';
import { Cross2Icon } from '@radix-ui/react-icons';
import { Input } from "@/components/ui/input";

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

export default function PlayerComparison() {
  const [allPlayers, setAllPlayers] = useState<Player[]>([]);
  const [selectedPlayers, setSelectedPlayers] = useState<string[]>([]);
  const supabase = createClientComponentClient();
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const playersPerPage = 20;

  useEffect(() => {
    fetchAllPlayers();
  }, []);

  async function fetchAllPlayers() {
    const { data, error } = await supabase.from('fantasy_players').select('*');
    if (error) console.error('Error fetching players:', error);
    else setAllPlayers(data as Player[]);
  }

  const handlePlayerSelect = (playerIds: string[]) => {
    setSelectedPlayers(playerIds.slice(0, 4));
  };

  const resetSelection = () => {
    setSelectedPlayers([]);
  };

  const getPlayerById = (id: string) => allPlayers.find(player => player.id === parseInt(id));

  const getChartData = (stat: keyof Player) => {
    return selectedPlayers.map(player => ({
      name: getPlayerById(player)?.Player || '',
      value: getPlayerById(player)?.[stat] as number || 0
    }));
  };

  const filteredPlayers = allPlayers.filter(player =>
    player.Player?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    player.Team?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    player.Position?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const paginatedPlayers = filteredPlayers.slice(
    (currentPage - 1) * playersPerPage,
    currentPage * playersPerPage
  );

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex-1 ml-64 p-8">
        <h1 className="text-3xl font-bold mb-8">Player Comparison</h1>
        <div className="mb-8 flex gap-4">
          <Select
            isMulti
            options={allPlayers.map(player => ({ value: player.id!.toString(), label: player.Player }))}
            value={selectedPlayers.map(id => ({ value: id, label: getPlayerById(id)?.Player || '' }))}
            onChange={(selected: any) => handlePlayerSelect(selected.map((s: any) => s.value))}
            placeholder="Select up to 4 players"
            className="w-[400px]"
          />
          <Dialog.Root>
            <Dialog.Trigger asChild>
              <Button>Find Players</Button>
            </Dialog.Trigger>
            <Dialog.Portal>
              <Dialog.Overlay className="bg-black/50 fixed inset-0" />
              <Dialog.Content className="fixed top-[50%] left-[50%] max-h-[85vh] w-[90vw] max-w-[450px] translate-x-[-50%] translate-y-[-50%] rounded-[6px] bg-white p-[25px] shadow-[hsl(206_22%_7%_/_35%)_0px_10px_38px_-10px,_hsl(206_22%_7%_/_20%)_0px_10px_20px_-15px] focus:outline-none overflow-y-auto">
                <Dialog.Title className="text-mauve12 m-0 text-[17px] font-medium">
                  Find Players
                </Dialog.Title>
                <Dialog.Description className="text-mauve11 mt-[10px] mb-5 text-[15px] leading-normal">
                  Search and add players to compare.
                </Dialog.Description>
                <Input
                  placeholder="Search players..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="mb-4"
                />
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Player</TableHead>
                      <TableHead>Team</TableHead>
                      <TableHead>Position</TableHead>
                      <TableHead>Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {paginatedPlayers.map((player) => (
                      <TableRow key={player.id}>
                        <TableCell>{player.Player}</TableCell>
                        <TableCell>{player.Team}</TableCell>
                        <TableCell>{player.Position}</TableCell>
                        <TableCell>
                          <Button
                            onClick={() => {
                              handlePlayerSelect([...selectedPlayers, player.id!.toString()]);
                            }}
                            disabled={selectedPlayers.includes(player.id!.toString())}
                          >
                            Add
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
                <div className="mt-4 flex justify-between">
                  <Button
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                  >
                    Previous
                  </Button>
                  <span>Page {currentPage} of {Math.ceil(filteredPlayers.length / playersPerPage)}</span>
                  <Button
                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, Math.ceil(filteredPlayers.length / playersPerPage)))}
                    disabled={currentPage === Math.ceil(filteredPlayers.length / playersPerPage)}
                  >
                    Next
                  </Button>
                </div>
                <Dialog.Close asChild>
                  <button
                    className="text-violet11 hover:bg-violet4 focus:shadow-violet7 absolute top-[10px] right-[10px] inline-flex h-[25px] w-[25px] appearance-none items-center justify-center rounded-full focus:shadow-[0_0_0_2px] focus:outline-none"
                    aria-label="Close"
                  >
                    <Cross2Icon />
                  </button>
                </Dialog.Close>
              </Dialog.Content>
            </Dialog.Portal>
          </Dialog.Root>
          <Button onClick={resetSelection}>Reset</Button>
        </div>
        {selectedPlayers.length > 0 && (
          <>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Stat</TableHead>
                  {selectedPlayers.map(player => (
                    <TableHead key={player}>{getPlayerById(player)?.Player}</TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {['MIN', 'PTS', 'REB', 'AST', 'STL', 'BLK', 'TO', '3PM', 'FG%', 'FT%'].map(stat => (
                  <TableRow key={stat}>
                    <TableCell>{stat}</TableCell>
                    {selectedPlayers.map(player => (
                      <TableCell key={player}>
                        {stat === 'FG%' ? 
                          ((getPlayerById(player)?.FGM ?? 0) / (getPlayerById(player)?.FGA ?? 1) * 100).toFixed(1) + '%' :
                         stat === 'FT%' ?
                          ((getPlayerById(player)?.FTM ?? 0) / (getPlayerById(player)?.FTA ?? 1) * 100).toFixed(1) + '%' :
                          getPlayerById(player)?.[stat as keyof Player] || 0}
                      </TableCell>
                    ))}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            <div className="mt-8 grid grid-cols-2 gap-8">
              <div>
                <h2 className="text-2xl font-bold mb-4">Points Comparison</h2>
                <BarChart data={getChartData('PTS')} />
              </div>
              <div>
                <h2 className="text-2xl font-bold mb-4">Rebounds Comparison</h2>
                <BarChart data={getChartData('REB')} />
              </div>
              <div>
                <h2 className="text-2xl font-bold mb-4">Assists Comparison</h2>
                <BarChart data={getChartData('AST')} />
              </div>
              <div>
                <h2 className="text-2xl font-bold mb-4">Blocks Comparison</h2>
                <BarChart data={getChartData('BLK')} />
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
