import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { FilterIcon } from '../../components/icons';
import { userService } from '../../services/userService';
import type { User } from '../../services/userService';
import ConfirmModal from '../../components/ConfirmModal/ConfirmModal';
import type { ConfirmModalType } from '../../components/ConfirmModal/ConfirmModal';
import './Users.scss';

interface ModalConfig {
  isOpen: boolean;
  title: string;
  message: string;
  confirmText: string;
  type: ConfirmModalType;
  onConfirm: () => void;
}

const MODAL_CLOSED: ModalConfig = {
  isOpen: false,
  title: '',
  message: '',
  confirmText: '',
  type: 'danger',
  onConfirm: () => {},
};

const Users: React.FC = () => {
  const navigate = useNavigate();
  const [allUsers, setAllUsers] = useState<User[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [modal, setModal] = useState<ModalConfig>(MODAL_CLOSED);

  const [activeActionsId, setActiveActionsId] = useState<string | null>(null);
  const [expandedUserId, setExpandedUserId] = useState<string | null>(null);
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

  // Load users from service on mount
  useEffect(() => {
    const loadUsers = async () => {
      try {
        setIsLoading(true);
        const [fetched] = await Promise.all([
          userService.fetchUsers(),
          new Promise((resolve) => setTimeout(resolve, 600)),
        ]);
        setAllUsers(fetched);
        setUsers(fetched);
      } catch (err) {
        console.error('Failed to fetch users:', err);
      } finally {
        setIsLoading(false);
      }
    };
    loadUsers();
  }, []);

  // Close dropdowns on clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (actionsRef.current && !actionsRef.current.contains(event.target as Node)) {
        setActiveActionsId(null);
      }
      if (filterRef.current && !filterRef.current.contains(event.target as Node)) {
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

  const handleToggleExpandUser = (userId: string) => {
    setExpandedUserId((prev) => (prev === userId ? null : userId));
  };

  const handleToggleFilter = () => {
    setIsFilterOpen((prev) => !prev);
  };

  const handleFilterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    let filtered = allUsers;
    if (filterOrg) filtered = filtered.filter((u) => u.organization.toLowerCase() === filterOrg.toLowerCase());
    if (filterUser) filtered = filtered.filter((u) => u.username.toLowerCase().includes(filterUser.toLowerCase()));
    if (filterEmail) filtered = filtered.filter((u) => u.email.toLowerCase().includes(filterEmail.toLowerCase()));
    if (filterPhone) filtered = filtered.filter((u) => u.phoneNumber.includes(filterPhone));
    if (filterStatus) filtered = filtered.filter((u) => u.status === filterStatus);
    if (filterDate) filtered = filtered.filter((u) => u.dateJoined.toLowerCase().includes(filterDate.toLowerCase()));
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
    setUsers(allUsers);
    setCurrentPage(1);
    setIsFilterOpen(false);
  };

  /** Commit the status change — called after modal confirmation */
  const commitStatusChange = async (userId: string, newStatus: User['status']) => {
    try {
      await userService.updateUserStatus(userId, newStatus);
      setAllUsers((prev) => prev.map((u) => (u.id === userId ? { ...u, status: newStatus } : u)));
      setUsers((prev) => prev.map((u) => (u.id === userId ? { ...u, status: newStatus } : u)));
    } catch (err) {
      console.error('Failed to update status:', err);
    }
    setActiveActionsId(null);
  };

  /** Opens the confirmation modal for Blacklist / Activate actions */
  const requestStatusChange = (user: User, newStatus: 'Blacklisted' | 'Active') => {
    setActiveActionsId(null); // close dropdown immediately

    if (newStatus === 'Blacklisted') {
      setModal({
        isOpen: true,
        title: 'Blacklist User',
        message: `Are you sure you want to blacklist ${user.username}? They will lose access to the platform.`,
        confirmText: 'Yes, Blacklist',
        type: 'danger',
        onConfirm: () => commitStatusChange(user.id, 'Blacklisted'),
      });
    } else {
      setModal({
        isOpen: true,
        title: 'Activate User',
        message: `Are you sure you want to activate ${user.username}? They will regain full access to the platform.`,
        confirmText: 'Yes, Activate',
        type: 'success',
        onConfirm: () => commitStatusChange(user.id, 'Active'),
      });
    }
  };

  const getStatusClass = (status: string) => {
    switch (status) {
      case 'Active': return 'status-badge--active';
      case 'Inactive': return 'status-badge--inactive';
      case 'Pending': return 'status-badge--pending';
      case 'Blacklisted': return 'status-badge--blacklisted';
      default: return '';
    }
  };

  // Pagination range with ellipsis
  const getPaginationRange = (current: number, total: number) => {
    const range: (number | string)[] = [];
    const delta = 1;
    for (let i = 1; i <= total; i++) {
      if (i === 1 || i === total || (i >= current - delta && i <= current + delta)) {
        range.push(i);
      } else if ((i === 2 && current - delta > 2) || (i === total - 1 && current + delta < total - 1)) {
        range.push('...');
      }
    }
    const result: (number | string)[] = [];
    for (let j = 0; j < range.length; j++) {
      if (range[j] === '...' && result[result.length - 1] === '...') continue;
      result.push(range[j]);
    }
    return result;
  };

  const totalRecords = users.length;
  const totalPages = Math.ceil(totalRecords / pageSize) || 1;
  const startIndex = (currentPage - 1) * pageSize;
  const paginatedUsers = users.slice(startIndex, startIndex + pageSize);

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) setCurrentPage(page);
  };

  const totalUsersCount = allUsers.length;
  const activeUsersCount = allUsers.filter((u) => u.status === 'Active').length;
  const loanUsersCount = allUsers.filter(
    (u) => parseFloat(u.loanRepayment.replace(/[^\d.]/g, '')) >= 40000
  ).length;
  const savingsUsersCount = allUsers.filter(
    (u) => parseFloat(u.accountBalance.replace(/[^\d.]/g, '')) >= 100000
  ).length;

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
          <span className="users-stats__value">{isLoading ? '...' : totalUsersCount.toLocaleString()}</span>
        </div>
        <div className="users-stats__card">
          <div className="users-stats__icon-wrap users-stats__icon-wrap--active">
            <i className="fa-solid fa-users"></i>
          </div>
          <span className="users-stats__label">ACTIVE USERS</span>
          <span className="users-stats__value">{isLoading ? '...' : activeUsersCount.toLocaleString()}</span>
        </div>
        <div className="users-stats__card">
          <div className="users-stats__icon-wrap users-stats__icon-wrap--loans">
            <i className="fa-solid fa-file-invoice-dollar"></i>
          </div>
          <span className="users-stats__label">USERS WITH LOANS</span>
          <span className="users-stats__value">{isLoading ? '...' : loanUsersCount.toLocaleString()}</span>
        </div>
        <div className="users-stats__card">
          <div className="users-stats__icon-wrap users-stats__icon-wrap--savings">
            <i className="fa-solid fa-coins"></i>
          </div>
          <span className="users-stats__label">USERS WITH SAVINGS</span>
          <span className="users-stats__value">{isLoading ? '...' : savingsUsersCount.toLocaleString()}</span>
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
              {isLoading ? (
                Array.from({ length: pageSize }).map((_, idx) => (
                  <tr key={`skeleton-${idx}`}>
                    <td><div className="users-table__skeleton users-table__skeleton--org"></div></td>
                    <td><div className="users-table__skeleton users-table__skeleton--user"></div></td>
                    <td><div className="users-table__skeleton users-table__skeleton--email"></div></td>
                    <td><div className="users-table__skeleton users-table__skeleton--phone"></div></td>
                    <td><div className="users-table__skeleton users-table__skeleton--date"></div></td>
                    <td><div className="users-table__skeleton users-table__skeleton--status"></div></td>
                    <td></td>
                  </tr>
                ))
              ) : paginatedUsers.length > 0 ? (
                paginatedUsers.map((user) => {
                  const isBlacklisted = user.status === 'Blacklisted';
                  const isActive = user.status === 'Active';

                  return (
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
                                className={`actions-dropdown__item actions-dropdown__item--danger${isBlacklisted ? ' actions-dropdown__item--disabled' : ''}`}
                                onClick={() => !isBlacklisted && requestStatusChange(user, 'Blacklisted')}
                                disabled={isBlacklisted}
                                title={isBlacklisted ? 'User is already blacklisted' : undefined}
                              >
                                <i className="fa-solid fa-user-slash"></i>
                                <span>Blacklist User</span>
                              </button>

                              <button
                                className={`actions-dropdown__item actions-dropdown__item--success${isActive ? ' actions-dropdown__item--disabled' : ''}`}
                                onClick={() => !isActive && requestStatusChange(user, 'Active')}
                                disabled={isActive}
                                title={isActive ? 'User is already active' : undefined}
                              >
                                <i className="fa-solid fa-user-check"></i>
                                <span>Activate User</span>
                              </button>
                            </div>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
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

        {/* ── Mobile Accordion Card View ── */}
        <div className="users-mobile-list">
          {isLoading ? (
            Array.from({ length: 5 }).map((_, idx) => (
              <div key={`mobile-skeleton-${idx}`} className="user-mobile-card user-mobile-card--skeleton">
                <div className="user-mobile-card__header">
                  <div className="user-mobile-card__skeleton-title"></div>
                  <div className="user-mobile-card__skeleton-badge"></div>
                </div>
              </div>
            ))
          ) : paginatedUsers.length > 0 ? (
            paginatedUsers.map((user) => {
              const isExpanded = expandedUserId === user.id;
              const isBlacklisted = user.status === 'Blacklisted';
              const isActive = user.status === 'Active';
              return (
                <div key={`mobile-${user.id}`} className={`user-mobile-card ${isExpanded ? 'user-mobile-card--expanded' : ''}`}>
                  <div className="user-mobile-card__header" onClick={() => handleToggleExpandUser(user.id)}>
                    <div className="user-mobile-card__header-left">
                      <span className="user-mobile-card__username">{user.username}</span>
                      <span className="user-mobile-card__org">{user.organization}</span>
                    </div>
                    <div className="user-mobile-card__header-right">
                      <span className={`status-badge ${getStatusClass(user.status)}`}>
                        {user.status}
                      </span>
                      <i className={`fa-solid fa-chevron-${isExpanded ? 'up' : 'down'} user-mobile-card__toggle-icon`}></i>
                    </div>
                  </div>
                  {isExpanded && (
                    <div className="user-mobile-card__content">
                      <div className="user-mobile-card__row">
                        <span className="user-mobile-card__label">EMAIL</span>
                        <span className="user-mobile-card__value">{user.email}</span>
                      </div>
                      <div className="user-mobile-card__row">
                        <span className="user-mobile-card__label">PHONE NUMBER</span>
                        <span className="user-mobile-card__value">{user.phoneNumber}</span>
                      </div>
                      <div className="user-mobile-card__row">
                        <span className="user-mobile-card__label">DATE JOINED</span>
                        <span className="user-mobile-card__value">{user.dateJoined}</span>
                      </div>
                      <div className="user-mobile-card__actions">
                        <button
                          className="user-mobile-card__btn user-mobile-card__btn--view"
                          onClick={() => navigate(`/users/${user.id}`)}
                        >
                          <i className="fa-regular fa-eye"></i>
                          <span>View Details</span>
                        </button>
                        <button
                          className="user-mobile-card__btn user-mobile-card__btn--blacklist"
                          onClick={() => !isBlacklisted && requestStatusChange(user, 'Blacklisted')}
                          disabled={isBlacklisted}
                        >
                          <i className="fa-solid fa-user-slash"></i>
                          <span>Blacklist</span>
                        </button>
                        <button
                          className="user-mobile-card__btn user-mobile-card__btn--activate"
                          onClick={() => !isActive && requestStatusChange(user, 'Active')}
                          disabled={isActive}
                        >
                          <i className="fa-solid fa-user-check"></i>
                          <span>Activate</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              );
            })
          ) : (
            <div className="user-mobile-card__empty">
              No users found matching the search criteria.
            </div>
          )}
        </div>

        {/* ── Filter Form Dropdown Popover ── */}
        {isFilterOpen && (
          <div className="filter-dropdown" ref={filterRef}>
            <form onSubmit={handleFilterSubmit}>
              <div className="filter-dropdown__field">
                <label className="filter-dropdown__label" htmlFor="filterOrg">Organization</label>
                <select id="filterOrg" className="filter-dropdown__input" value={filterOrg} onChange={(e) => setFilterOrg(e.target.value)}>
                  <option value="">Select Organization</option>
                  <option value="Lendsqr">Lendsqr</option>
                  <option value="Irapay">Irapay</option>
                  <option value="Lendstar">Lendstar</option>
                  <option value="Renmoney">Renmoney</option>
                  <option value="Carbon">Carbon</option>
                  <option value="MoniFlex">MoniFlex</option>
                </select>
              </div>
              <div className="filter-dropdown__field">
                <label className="filter-dropdown__label" htmlFor="filterUser">Username</label>
                <input id="filterUser" type="text" className="filter-dropdown__input" placeholder="User" value={filterUser} onChange={(e) => setFilterUser(e.target.value)} />
              </div>
              <div className="filter-dropdown__field">
                <label className="filter-dropdown__label" htmlFor="filterEmail">Email</label>
                <input id="filterEmail" type="email" className="filter-dropdown__input" placeholder="Email" value={filterEmail} onChange={(e) => setFilterEmail(e.target.value)} />
              </div>
              <div className="filter-dropdown__field">
                <label className="filter-dropdown__label" htmlFor="filterDate">Date</label>
                <input id="filterDate" type="text" className="filter-dropdown__input" placeholder="e.g. 2024 or May" value={filterDate} onChange={(e) => setFilterDate(e.target.value)} />
              </div>
              <div className="filter-dropdown__field">
                <label className="filter-dropdown__label" htmlFor="filterPhone">Phone Number</label>
                <input id="filterPhone" type="text" className="filter-dropdown__input" placeholder="Phone Number" value={filterPhone} onChange={(e) => setFilterPhone(e.target.value)} />
              </div>
              <div className="filter-dropdown__field">
                <label className="filter-dropdown__label" htmlFor="filterStatus">Status</label>
                <select id="filterStatus" className="filter-dropdown__input" value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
                  <option value="">Select Status</option>
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                  <option value="Pending">Pending</option>
                  <option value="Blacklisted">Blacklisted</option>
                </select>
              </div>
              <div className="filter-dropdown__buttons">
                <button type="button" className="filter-dropdown__btn filter-dropdown__btn--reset" onClick={handleFilterReset}>
                  Reset
                </button>
                <button type="submit" className="filter-dropdown__btn filter-dropdown__btn--submit">
                  Filter
                </button>
              </div>
            </form>
          </div>
        )}
      </div>

      {/* ── Pagination Section ── */}
      {!isLoading && (
        <div className="users-pagination">
          <div className="users-pagination__left">
            <span>Showing</span>
            <select
              className="users-pagination__select"
              value={pageSize}
              onChange={(e) => { setPageSize(Number(e.target.value)); setCurrentPage(1); }}
            >
              <option value={5}>5</option>
              <option value={10}>10</option>
              <option value={20}>20</option>
              <option value={50}>50</option>
              <option value={100}>100</option>
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

            {getPaginationRange(currentPage, totalPages).map((page, index) => {
              if (page === '...') {
                return (
                  <span key={`ellipsis-${index}`} style={{ padding: '0 8px', color: '#545f7d', opacity: 0.6 }}>
                    ...
                  </span>
                );
              }
              return (
                <button
                  key={page}
                  className={`users-pagination__page-btn ${currentPage === page ? 'users-pagination__page-btn--active' : ''}`}
                  onClick={() => handlePageChange(Number(page))}
                >
                  {page}
                </button>
              );
            })}

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
      )}

      {/* ── Confirmation Modal ── */}
      <ConfirmModal
        isOpen={modal.isOpen}
        title={modal.title}
        message={modal.message}
        confirmText={modal.confirmText}
        cancelText="Cancel"
        type={modal.type}
        onConfirm={modal.onConfirm}
        onClose={() => setModal(MODAL_CLOSED)}
      />
    </div>
  );
};

export default Users;
