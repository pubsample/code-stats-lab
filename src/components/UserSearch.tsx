import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search } from 'lucide-react';

interface UserSearchProps {
  onSearch: (handle: string, platform: 'codeforces' | 'leetcode') => void;
  loading: boolean;
}

export const UserSearch: React.FC<UserSearchProps> = ({ onSearch, loading }) => {
  const [handle, setHandle] = useState('');
  const [platform, setPlatform] = useState<'codeforces' | 'leetcode'>('codeforces');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (handle.trim()) {
      onSearch(handle.trim(), platform);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex w-full max-w-md gap-2">
      <Select value={platform} onValueChange={(value: 'codeforces' | 'leetcode') => setPlatform(value)}>
        <SelectTrigger className="w-[140px]">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="codeforces">Codeforces</SelectItem>
          <SelectItem value="leetcode">LeetCode</SelectItem>
        </SelectContent>
      </Select>
      <Input
        type="text"
        placeholder={`Enter ${platform === 'codeforces' ? 'handle' : 'username'}...`}
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