import { describe, test, expect } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import UserDetails from '../../pages/UserDetails/UserDetails';

describe('UserDetails Page', () => {
  test('renders user details based on URL param', async () => {
    render(
      <MemoryRouter initialEntries={['/users/1']}>
        <Routes>
          <Route path="/users/:id" element={<UserDetails />} />
        </Routes>
      </MemoryRouter>
    );
    
    // Wait for the mock user details to render
    const nameElements = await screen.findAllByText('Adedeji');
    expect(nameElements.length).toBeGreaterThan(0);
    expect(nameElements[0]).toBeInTheDocument();
  });

  test('tab navigation switches content panels', async () => {
    render(
      <MemoryRouter initialEntries={['/users/1']}>
        <Routes>
          <Route path="/users/:id" element={<UserDetails />} />
        </Routes>
      </MemoryRouter>
    );

    // Wait for mock user details to load first
    await screen.findAllByText('Adedeji');

    const documentsTab = screen.getByRole('tab', { name: 'Documents' });
    fireEvent.click(documentsTab);
    const placeholder = screen.getByText(/No documents uploaded yet\./i);
    expect(placeholder).toBeInTheDocument();
  });

  test('clicking blacklist opens confirmation modal and updates user status on confirm', async () => {
    render(
      <MemoryRouter initialEntries={['/users/2']}>
        <Routes>
          <Route path="/users/:id" element={<UserDetails />} />
        </Routes>
      </MemoryRouter>
    );

    // Wait for mock user (Debby Ogo - Pending status)
    await screen.findAllByText('Debby Ogo');

    // Get the Blacklist User button
    const blacklistBtn = screen.getByRole('button', { name: /blacklist user/i });
    expect(blacklistBtn).not.toBeDisabled();

    // Click it to open modal
    fireEvent.click(blacklistBtn);

    // Verify modal is open
    const modalTitle = screen.getByRole('heading', { name: /blacklist user/i });
    expect(modalTitle).toBeInTheDocument();

    // Confirm the action
    const confirmBtn = screen.getByRole('button', { name: /blacklist$/i });
    fireEvent.click(confirmBtn);

    // Modal should close
    await waitFor(() => {
      expect(screen.queryByRole('heading', { name: /blacklist user/i })).not.toBeInTheDocument();
    });

    // Label should change to "Blacklisted" and button should be disabled
    const disabledBlacklistBtn = await screen.findByRole('button', { name: /blacklisted/i });
    expect(disabledBlacklistBtn).toBeDisabled();
    expect(disabledBlacklistBtn).toHaveClass('user-details__action-btn--current');
  });
});
