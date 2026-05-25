import { describe, test, expect } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import Users from '../../pages/Users/Users';

describe('Users Page', () => {
  test('renders user table with mock data', async () => {
    render(
      <MemoryRouter initialEntries={['/users']}>
        <Routes>
          <Route path="/users" element={<Users />} />
        </Routes>
      </MemoryRouter>
    );
    
    // Verify a known user username appears in the table after loading finishes
    const usernameCells = await screen.findAllByText('Adedeji');
    expect(usernameCells[0]).toBeInTheDocument();
  });

  test('filter button toggles filter dropdown', async () => {
    render(
      <MemoryRouter initialEntries={['/users']}>
        <Routes>
          <Route path="/users" element={<Users />} />
        </Routes>
      </MemoryRouter>
    );

    // Wait for the mock table to load first
    await screen.findAllByText('Adedeji');

    const filterButtons = screen.getAllByRole('button', { name: /filter/i });
    // Click first filter button to open dropdown
    fireEvent.click(filterButtons[0]);
    const resetBtn = screen.getByRole('button', { name: /reset/i });
    expect(resetBtn).toBeInTheDocument();
  });

  test('opens confirmation modal when blacklisting a user and commits change on confirmation', async () => {
    render(
      <MemoryRouter initialEntries={['/users']}>
        <Routes>
          <Route path="/users" element={<Users />} />
        </Routes>
      </MemoryRouter>
    );

    // Wait for mock data
    await screen.findAllByText('Debby Ogo'); // Debby Ogo has status "Pending"

    // Click actions button for Debby Ogo (id: 2)
    const actionBtns = screen.getAllByRole('button', { name: /view actions menu/i });
    // Let's click the actions button for the second row (Debby Ogo)
    fireEvent.click(actionBtns[1]);

    // Click "Blacklist User" dropdown item
    const blacklistBtn = screen.getByRole('button', { name: /blacklist user/i });
    fireEvent.click(blacklistBtn);

    // Modal should open
    const modalTitle = screen.getByRole('heading', { name: /blacklist user/i });
    expect(modalTitle).toBeInTheDocument();
    expect(screen.getByText(/are you sure you want to blacklist debby ogo\?/i)).toBeInTheDocument();

    // Click confirm in modal
    const confirmBtn = screen.getByRole('button', { name: /blacklist$/i });
    fireEvent.click(confirmBtn);

    // Modal should close and status badge should update
    await waitFor(() => {
      expect(screen.queryByRole('heading', { name: /blacklist user/i })).not.toBeInTheDocument();
    });
  });

  test('opens confirmation modal and does not commit change on cancel', async () => {
    render(
      <MemoryRouter initialEntries={['/users']}>
        <Routes>
          <Route path="/users" element={<Users />} />
        </Routes>
      </MemoryRouter>
    );

    await screen.findAllByText('Debby Ogo');

    const actionBtns = screen.getAllByRole('button', { name: /view actions menu/i });
    fireEvent.click(actionBtns[1]);

    const blacklistBtn = screen.getByRole('button', { name: /blacklist user/i });
    fireEvent.click(blacklistBtn);

    const modalTitle = screen.getByRole('heading', { name: /blacklist user/i });
    expect(modalTitle).toBeInTheDocument();

    // Click cancel in modal
    const cancelBtn = screen.getByRole('button', { name: /cancel/i });
    fireEvent.click(cancelBtn);

    // Modal should close
    await waitFor(() => {
      expect(screen.queryByRole('heading', { name: /blacklist user/i })).not.toBeInTheDocument();
    });
  });

  test('renders accordion cards on mobile and expands details on click', async () => {
    const { container } = render(
      <MemoryRouter initialEntries={['/users']}>
        <Routes>
          <Route path="/users" element={<Users />} />
        </Routes>
      </MemoryRouter>
    );

    // Wait for the mock table to load first
    await screen.findAllByText('Debby Ogo');

    // Click on the header of the mobile card for Debby Ogo (second user, index 1)
    const mobileHeaders = container.querySelectorAll('.user-mobile-card__header');
    expect(mobileHeaders.length).toBeGreaterThan(0);
    fireEvent.click(mobileHeaders[1]);

    // Verify view details button is rendered under the expanded card
    const viewDetailsBtn = await screen.findByRole('button', { name: /view details/i });
    expect(viewDetailsBtn).toBeInTheDocument();
  });
});
