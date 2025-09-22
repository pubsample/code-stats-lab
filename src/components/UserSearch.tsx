import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search } from 'lucide-react';

interface UserSearchProps {
  onSearch: (handle: string) => void;
  loading: boolean;
}

export const UserSearch: React.FC<UserSearchProps> = ({ onSearch, loading }) => {
  const [handle, setHandle] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (handle.trim()) {
      onSearch(handle.trim());
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex w-full max-w-md gap-2">
      <Input
        type="text"
        placeholder="Enter Codeforces handle..."
        value={handle}
        onChange={(e) => setHandle(e.target.value)}
        className="flex-1"
        disabled={loading}
      />
      <Button type="submit" disabled={loading || !handle.trim()}>
        <Search className="h-4 w-4" />
      </Button>
    </form>
  );
};