import { describe, test, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import UserDetails from '../../pages/UserDetails/UserDetails';

describe('UserDetails Page', () => {
  test('renders user details based on URL param', () => {
    render(
      <MemoryRouter initialEntries={['/users/1']}>
        <Routes>
          <Route path="/users/:id" element={<UserDetails />} />
        </Routes>
      </MemoryRouter>
    );
    const nameElements = screen.getAllByText('Adedeji');
    expect(nameElements.length).toBeGreaterThan(0);
    expect(nameElements[0]).toBeInTheDocument();
  });

  test('tab navigation switches content panels', () => {
    render(
      <MemoryRouter initialEntries={['/users/1']}>
        <Routes>
          <Route path="/users/:id" element={<UserDetails />} />
        </Routes>
      </MemoryRouter>
    );
    const documentsTab = screen.getByRole('tab', { name: 'Documents' });
    fireEvent.click(documentsTab);
    const placeholder = screen.getByText(/No documents uploaded yet\./i);
    expect(placeholder).toBeInTheDocument();
  });
});
