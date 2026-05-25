import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { FilterIcon } from '../../components/icons';
import './Users.scss';

export interface User {
  id: string;
  organization: string;
  username: string;
  email: string;
  phoneNumber: string;
  dateJoined: string;
  status: 'Active' | 'Inactive' | 'Pending' | 'Blacklisted';
}

export const mockUsers: User[] = [
  { id: '1', organization: 'Lendsqr', username: 'Adedeji', email: 'adedeji@lendsqr.com', phoneNumber: '08078905621', dateJoined: 'May 24, 2024 10:00 AM', status: 'Active' },
  { id: '2', organization: 'Irapay', username: 'Debby Ogo', email: 'debby@irapay.com', phoneNumber: '08160794503', dateJoined: 'Jan 12, 2025 8:30 AM', status: 'Pending' },
  { id: '3', organization: 'Lendsqr', username: 'Grace Effiom', email: 'grace@lendsqr.com', phoneNumber: '07033489110', dateJoined: 'Apr 30, 2024 4:15 PM', status: 'Blacklisted' },
  { id: '4', organization: 'Lendstar', username: 'Tunde Ade', email: 'tunde@lendstar.com', phoneNumber: '09055610022', dateJoined: 'Feb 18, 2025 2:40 PM', status: 'Inactive' },
  { id: '5', organization: 'Lendsqr', username: 'Dominic Ogo', email: 'dominic@lendsqr.com', phoneNumber: '08099887766', dateJoined: 'Mar 15, 2024 11:00 AM', status: 'Active' },
  { id: '6', organization: 'Irapay', username: 'Samuel Jonah', email: 'samuel@irapay.com', phoneNumber: '08123456789', dateJoined: 'Dec 05, 2024 9:15 AM', status: 'Active' },
  { id: '7', organization: 'Lendsqr', username: 'Joy Nkechi', email: 'joy@lendsqr.com', phoneNumber: '07099887711', dateJoined: 'Jul 22, 2024 3:20 PM', status: 'Pending' },
  { id: '8', organization: 'Lendstar', username: 'Kelechi Ugo', email: 'kelechi@lendstar.com', phoneNumber: '08055667788', dateJoined: 'Oct 14, 2024 12:00 PM', status: 'Inactive' },
  { id: '9', organization: 'Irapay', username: 'Mary Slessor', email: 'mary@irapay.com', phoneNumber: '09011223344', dateJoined: 'Sep 09, 2024 10:45 AM', status: 'Blacklisted' },
  { id: '10', organization: 'Lendsqr', username: 'Bimbo Thomas', email: 'bimbo@lendsqr.com', phoneNumber: '08022334455', dateJoined: 'Nov 01, 2024 6:00 PM', status: 'Active' },
  { id: '11', organization: 'Lendstar', username: 'Victor Moses', email: 'victor@lendstar.com', phoneNumber: '07011223344', dateJoined: 'Jan 28, 2025 1:30 PM', status: 'Active' },
  { id: '12', organization: 'Irapay', username: 'Esther Paul', email: 'esther@irapay.com', phoneNumber: '08133445566', dateJoined: 'Aug 17, 2024 2:15 PM', status: 'Pending' },
];

const Users: React.FC = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState<User[]>(mockUsers);
  const [activeActionsId, setActiveActionsId] = useState<string | null>(null);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [pageSize, setPageSize] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);

  // Filter form state
  const [filterOrg, setFilterOrg] = useState('');
  const [filterUser, setFilterUser] = useState('');
  const [filterEmail, setFilterEmail] = useState('');
  const [filterDate, setFilterDate] = useState('');
  const [filterPhone, setFilterPhone] = useState('');
  const [filterStatus, setFilterStatus] = useState('');

  const actionsRef = useRef<HTMLDivElement>(null);
  const filterRef = useRef<HTMLDivElement>(null);

  // Close dropdowns on clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (actionsRef.current && !actionsRef.current.contains(event.target as Node)) {
        setActiveActionsId(null);
      }
      if (filterRef.current && !filterRef.current.contains(event.target as Node)) {
        // Find if user clicked on filter button header
        const isFilterBtn = (event.target as HTMLElement).closest('.users-table__filter-btn');
        if (!isFilterBtn) {
          setIsFilterOpen(false);
        }
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleToggleActions = (userId: string) => {
    setActiveActionsId((prev) => (prev === userId ? null : userId));
  };

  const handleToggleFilter = () => {
    setIsFilterOpen((prev) => !prev);
  };

  const handleFilterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    let filtered = mockUsers;

    if (filterOrg) {
      filtered = filtered.filter(u => u.organization.toLowerCase().includes(filterOrg.toLowerCase()));
    }
    if (filterUser) {
      filtered = filtered.filter(u => u.username.toLowerCase().includes(filterUser.toLowerCase()));
    }
    if (filterEmail) {
      filtered = filtered.filter(u => u.email.toLowerCase().includes(filterEmail.toLowerCase()));
    }
    if (filterPhone) {
      filtered = filtered.filter(u => u.phoneNumber.includes(filterPhone));
    }
    if (filterStatus) {
      filtered = filtered.filter(u => u.status === filterStatus);
    }
    // Simple date filter check if filled
    if (filterDate) {
      filtered = filtered.filter(u => u.dateJoined.includes(filterDate));
    }

    setUsers(filtered);
    setCurrentPage(1);
    setIsFilterOpen(false);
  };

  const handleFilterReset = () => {
    setFilterOrg('');
    setFilterUser('');
    setFilterEmail('');
    setFilterDate('');
    setFilterPhone('');
    setFilterStatus('');
    setUsers(mockUsers);
    setCurrentPage(1);
    setIsFilterOpen(false);
  };

  const handleStatusChange = (userId: string, newStatus: 'Active' | 'Inactive' | 'Pending' | 'Blacklisted') => {
    setUsers((prevUsers) =>
      prevUsers.map((u) => (u.id === userId ? { ...u, status: newStatus } : u))
    );
    setActiveActionsId(null);
  };

  const getStatusClass = (status: string) => {
    switch (status) {
      case 'Active':
        return 'status-badge--active';
      case 'Inactive':
        return 'status-badge--inactive';
      case 'Pending':
        return 'status-badge--pending';
      case 'Blacklisted':
        return 'status-badge--blacklisted';
      default:
        return '';
    }
  };

  // Pagination calculation
  const totalRecords = users.length;
  const totalPages = Math.ceil(totalRecords / pageSize) || 1;
  const startIndex = (currentPage - 1) * pageSize;
  const paginatedUsers = users.slice(startIndex, startIndex + pageSize);

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  return (
    <div className="users-page">
      <h1 className="users-page__title">Users</h1>

      {/* ── Stats Container ── */}
      <div className="users-stats">
        <div className="users-stats__card">
          <div className="users-stats__icon-wrap users-stats__icon-wrap--users">
            <i className="fa-solid fa-user-group"></i>
          </div>
          <span className="users-stats__label">USERS</span>
          <span className="users-stats__value">2,453</span>
        </div>

        <div className="users-stats__card">
          <div className="users-stats__icon-wrap users-stats__icon-wrap--active">
            <i className="fa-solid fa-users"></i>
          </div>
          <span className="users-stats__label">ACTIVE USERS</span>
          <span className="users-stats__value">2,453</span>
        </div>

        <div className="users-stats__card">
          <div className="users-stats__icon-wrap users-stats__icon-wrap--loans">
            <i className="fa-solid fa-file-invoice-dollar"></i>
          </div>
          <span className="users-stats__label">USERS WITH LOANS</span>
          <span className="users-stats__value">12,453</span>
        </div>

        <div className="users-stats__card">
          <div className="users-stats__icon-wrap users-stats__icon-wrap--savings">
            <i className="fa-solid fa-coins"></i>
          </div>
          <span className="users-stats__label">USERS WITH SAVINGS</span>
          <span className="users-stats__value">102,453</span>
        </div>
      </div>

      {/* ── Users Table Wrapper ── */}
      <div className="users-table-container">
        <div className="users-table-scroll">
          <table className="users-table">
            <thead>
              <tr>
                <th>
                  <div className="users-table__header-cell">
                    <span>ORGANIZATION</span>
                    <button className="users-table__filter-btn" onClick={handleToggleFilter} aria-label="Filter organization">
                      <FilterIcon />
                    </button>
                  </div>
                </th>
                <th>
                  <div className="users-table__header-cell">
                    <span>USERNAME</span>
                    <button className="users-table__filter-btn" onClick={handleToggleFilter} aria-label="Filter username">
                      <FilterIcon />
                    </button>
                  </div>
                </th>
                <th>
                  <div className="users-table__header-cell">
                    <span>EMAIL</span>
                    <button className="users-table__filter-btn" onClick={handleToggleFilter} aria-label="Filter email">
                      <FilterIcon />
                    </button>
                  </div>
                </th>
                <th>
                  <div className="users-table__header-cell">
                    <span>PHONE NUMBER</span>
                    <button className="users-table__filter-btn" onClick={handleToggleFilter} aria-label="Filter phone number">
                      <FilterIcon />
                    </button>
                  </div>
                </th>
                <th>
                  <div className="users-table__header-cell">
                    <span>DATE JOINED</span>
                    <button className="users-table__filter-btn" onClick={handleToggleFilter} aria-label="Filter date joined">
                      <FilterIcon />
                    </button>
                  </div>
                </th>
                <th>
                  <div className="users-table__header-cell">
                    <span>STATUS</span>
                    <button className="users-table__filter-btn" onClick={handleToggleFilter} aria-label="Filter status">
                      <FilterIcon />
                    </button>
                  </div>
                </th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {paginatedUsers.length > 0 ? (
                paginatedUsers.map((user) => (
                  <tr key={user.id}>
                    <td>{user.organization}</td>
                    <td>{user.username}</td>
                    <td>{user.email}</td>
                    <td>{user.phoneNumber}</td>
                    <td>{user.dateJoined}</td>
                    <td>
                      <span className={`status-badge ${getStatusClass(user.status)}`}>
                        {user.status}
                      </span>
                    </td>
                    <td>
                      <div className="users-table__actions">
                        <button
                          className="users-table__actions-btn"
                          onClick={() => handleToggleActions(user.id)}
                          aria-label="View actions menu"
                        >
                          <i className="fa-solid fa-ellipsis-vertical"></i>
                        </button>

                        {/* Actions Dropdown Popover */}
                        {activeActionsId === user.id && (
                          <div className="actions-dropdown" ref={actionsRef}>
                            <button
                              className="actions-dropdown__item"
                              onClick={() => navigate(`/users/${user.id}`)}
                            >
                              <i className="fa-regular fa-eye"></i>
                              <span>View Details</span>
                            </button>
                            <button
                              className="actions-dropdown__item"
                              onClick={() => handleStatusChange(user.id, 'Blacklisted')}
                            >
                              <i className="fa-solid fa-user-slash"></i>
                              <span>Blacklist User</span>
                            </button>
                            <button
                              className="actions-dropdown__item"
                              onClick={() => handleStatusChange(user.id, 'Active')}
                            >
                              <i className="fa-solid fa-user-check"></i>
                              <span>Activate User</span>
                            </button>
                          </div>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="users-table__empty">
                    No users found matching the search criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* ── Filter Form Dropdown Popover ── */}
        {isFilterOpen && (
          <div className="filter-dropdown" ref={filterRef}>
            <form onSubmit={handleFilterSubmit}>
              <div className="filter-dropdown__field">
                <label className="filter-dropdown__label" htmlFor="filterOrg">Organization</label>
                <select
                  id="filterOrg"
                  className="filter-dropdown__input"
                  value={filterOrg}
                  onChange={(e) => setFilterOrg(e.target.value)}
                >
                  <option value="">Select Organization</option>
                  <option value="Lendsqr">Lendsqr</option>
                  <option value="Irapay">Irapay</option>
                  <option value="Lendstar">Lendstar</option>
                </select>
              </div>

              <div className="filter-dropdown__field">
                <label className="filter-dropdown__label" htmlFor="filterUser">Username</label>
                <input
                  id="filterUser"
                  type="text"
                  className="filter-dropdown__input"
                  placeholder="User"
                  value={filterUser}
                  onChange={(e) => setFilterUser(e.target.value)}
                />
              </div>

              <div className="filter-dropdown__field">
                <label className="filter-dropdown__label" htmlFor="filterEmail">Email</label>
                <input
                  id="filterEmail"
                  type="email"
                  className="filter-dropdown__input"
                  placeholder="Email"
                  value={filterEmail}
                  onChange={(e) => setFilterEmail(e.target.value)}
                />
              </div>

              <div className="filter-dropdown__field">
                <label className="filter-dropdown__label" htmlFor="filterDate">Date</label>
                <input
                  id="filterDate"
                  type="text"
                  className="filter-dropdown__input"
                  placeholder="e.g. 2024 or May"
                  value={filterDate}
                  onChange={(e) => setFilterDate(e.target.value)}
                />
              </div>

              <div className="filter-dropdown__field">
                <label className="filter-dropdown__label" htmlFor="filterPhone">Phone Number</label>
                <input
                  id="filterPhone"
                  type="text"
                  className="filter-dropdown__input"
                  placeholder="Phone Number"
                  value={filterPhone}
                  onChange={(e) => setFilterPhone(e.target.value)}
                />
              </div>

              <div className="filter-dropdown__field">
                <label className="filter-dropdown__label" htmlFor="filterStatus">Status</label>
                <select
                  id="filterStatus"
                  className="filter-dropdown__input"
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                >
                  <option value="">Select Status</option>
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                  <option value="Pending">Pending</option>
                  <option value="Blacklisted">Blacklisted</option>
                </select>
              </div>

              <div className="filter-dropdown__buttons">
                <button
                  type="button"
                  className="filter-dropdown__btn filter-dropdown__btn--reset"
                  onClick={handleFilterReset}
                >
                  Reset
                </button>
                <button
                  type="submit"
                  className="filter-dropdown__btn filter-dropdown__btn--submit"
                >
                  Filter
                </button>
              </div>
            </form>
          </div>
        )}
      </div>

      {/* ── Pagination Section ── */}
      <div className="users-pagination">
        <div className="users-pagination__left">
          <span>Showing</span>
          <select
            className="users-pagination__select"
            value={pageSize}
            onChange={(e) => {
              setPageSize(Number(e.target.value));
              setCurrentPage(1);
            }}
          >
            <option value={5}>5</option>
            <option value={10}>10</option>
            <option value={20}>20</option>
          </select>
          <span>out of {totalRecords}</span>
        </div>

        <div className="users-pagination__right">
          <button
            className="users-pagination__nav-btn"
            disabled={currentPage === 1}
            onClick={() => handlePageChange(currentPage - 1)}
            aria-label="Previous page"
          >
            <i className="fa-solid fa-chevron-left"></i>
          </button>

          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <button
              key={page}
              className={`users-pagination__page-btn ${currentPage === page ? 'users-pagination__page-btn--active' : ''}`}
              onClick={() => handlePageChange(page)}
            >
              {page}
            </button>
          ))}

          <button
            className="users-pagination__nav-btn"
            disabled={currentPage === totalPages}
            onClick={() => handlePageChange(currentPage + 1)}
            aria-label="Next page"
          >
            <i className="fa-solid fa-chevron-right"></i>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Users;
