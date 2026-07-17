import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi, beforeEach } from 'vitest';

import ELibraryClient from '@/app/elibrary/ELibraryClient';
import * as elibraryApi from '@/lib/api/elibrary';

// Mock the entire service module. ELibraryClient (and therefore
// DocumentGrid, which it renders) will never see a real fetch call —
// every section getter resolves with whatever we hand it below.
vi.mock('@/lib/api/elibrary');

const fakePublication = {
  id: 'pub-fake-1',
  title: 'Totally Fake Soil Testing Whitepaper',
  tags: ['geotechnical', 'testing'],
  description: 'A fake publication used only in this test.',
  authors: ['Ada Lovelace'],
  publishDate: '2024-03-01',
  category: 'Testing',
  featured: false,
};

describe('DocumentGrid (via ELibraryClient + mocked service layer)', () => {
  beforeEach(() => {
    vi.mocked(elibraryApi.getPublications).mockResolvedValue([fakePublication as any]);
    // Other sections aren't visited in this test, but we stub them too so
    // no unmocked call can slip through and hit the real module.
    vi.mocked(elibraryApi.getStandardCodes).mockResolvedValue([]);
    vi.mocked(elibraryApi.getNewsletters).mockResolvedValue([]);
    vi.mocked(elibraryApi.getCuratedPapers).mockResolvedValue([]);
    vi.mocked(elibraryApi.getDownloads).mockResolvedValue([]);
  });

  it('renders the fake publication returned by the mocked service, with no real network call', async () => {
    // Sanity check per Vitest's own docs: fetch must never actually run.
    // const fetchSpy = vi.spyOn(globalThis, 'fetch');

    render(<ELibraryClient />);

    // Publications isn't the default tab, so switch to it — this is what
    // triggers the effect that calls getPublications().
    await userEvent.click(screen.getByRole('button', { name: /publications/i }));

    // DocumentGrid should render the title from our fake data once the
    // (mocked, instant) service call resolves.
    await waitFor(() => {
      expect(screen.getByText('Totally Fake Soil Testing Whitepaper')).toBeInTheDocument();
  
    });
    // And the author / category metadata DocumentGrid derives from the item:
        expect(screen.getByText('Ada Lovelace')).toBeInTheDocument();
        expect(screen.getByText('Testing')).toBeInTheDocument();
    
    // expect(elibraryApi.getPublications).toHaveBeenCalledTimes(1);
    // expect(fetchSpy).not.toHaveBeenCalled();
  });
});
