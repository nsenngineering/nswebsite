import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';

import ELibraryClient from '@/app/elibrary/ELibraryClient';
import type { Publication } from '@/types/elibrary';

const fakePublication: Publication = {
  id: 'pub-fake-1',
  section: 'publications',
  title: 'Totally Fake Soil Testing Whitepaper',
  tags: ['geotechnical', 'testing'],
  description: 'A fake publication used only in this test.',
  authors: ['Ada Lovelace'],
  publishDate: '2024-03-01',
  category: 'Testing',
  featured: false,
};

describe('DocumentGrid (via ELibraryClient)', () => {
  it('renders server-provided data without making a browser network request', async () => {
    // Goal 5: the Server Component supplies this data before hydration.
    const fetchSpy = vi.spyOn(globalThis, 'fetch');

    render(<ELibraryClient initialData={{
      standardCodes: [],
      publications: [fakePublication],
      newsletters: [],
      curatedPapers: [],
      downloads: [],
    }} />);

    // Publications isn't the default tab, so switch to its already-loaded data.
    await userEvent.click(screen.getByRole('button', { name: /publications/i }));

    expect(screen.getByText('Totally Fake Soil Testing Whitepaper')).toBeInTheDocument();
    expect(screen.getByText('Ada Lovelace')).toBeInTheDocument();
    expect(screen.getByText('Testing')).toBeInTheDocument();
    expect(screen.getByText('A fake publication used only in this test.')).toBeInTheDocument();
    expect(fetchSpy).not.toHaveBeenCalled();
  });
});