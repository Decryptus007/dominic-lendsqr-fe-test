import { describe, test, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import Users from '../../pages/Users/Users';

describe('Users Page', () => {
  test('renders user table with mock data', () => {
    render(
      <MemoryRouter initialEntries={['/users']}>
        <Routes>
          <Route path="/users" element={<Users />} />
        </Routes>
      </MemoryRouter>
    );
    // Verify a known user username appears in the table
    const usernameCell = screen.getByText('Adedeji');
    expect(usernameCell).toBeInTheDocument();
  });

  test('filter button toggles filter dropdown', () => {
    render(
      <MemoryRouter initialEntries={['/users']}>
        <Routes>
          <Route path="/users" element={<Users />} />
        </Routes>
      </MemoryRouter>
    );
    const filterButtons = screen.getAllByRole('button', { name: /filter/i });
    // Click first filter button to open dropdown
    fireEvent.click(filterButtons[0]);
    const resetBtn = screen.getByRole('button', { name: /reset/i });
    expect(resetBtn).toBeInTheDocument();
  });
});
