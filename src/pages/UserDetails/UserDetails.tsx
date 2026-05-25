import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { userService } from '../../services/userService';
import type { User } from '../../services/userService';
import ConfirmModal from '../../components/ConfirmModal/ConfirmModal';
import type { ConfirmModalType } from '../../components/ConfirmModal/ConfirmModal';
import './UserDetails.scss';

type Tab = 'General Details' | 'Documents' | 'Bank Details' | 'Loans' | 'Savings' | 'App and System';

const TABS: Tab[] = ['General Details', 'Documents', 'Bank Details', 'Loans', 'Savings', 'App and System'];

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

const UserDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [user, setUser] = useState<User | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<Tab>('General Details');
  const [modal, setModal] = useState<ModalConfig>(MODAL_CLOSED);

  useEffect(() => {
    const fetchUserDetail = async () => {
      if (!id) return;
      try {
        setIsLoading(true);
        const [fetched] = await Promise.all([
          userService.getUserById(id),
          new Promise((resolve) => setTimeout(resolve, 500)),
        ]);
        setUser(fetched);
      } catch (err) {
        console.error('Failed to load user details:', err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchUserDetail();
  }, [id]);

  /** Commit the status change — called after modal confirmation */
  const commitStatusChange = async (newStatus: 'Active' | 'Blacklisted') => {
    if (!id) return;
    try {
      const updated = await userService.updateUserStatus(id, newStatus);
      if (updated) setUser(updated);
    } catch (err) {
      console.error('Failed to update user status:', err);
    }
  };

  /** Opens confirmation modal for Blacklist */
  const handleBlacklistClick = () => {
    if (!user) return;
    setModal({
      isOpen: true,
      title: 'Blacklist User',
      message: `Are you sure you want to blacklist ${user.username}? They will lose access to the platform.`,
      confirmText: 'Yes, Blacklist',
      type: 'danger',
      onConfirm: () => commitStatusChange('Blacklisted'),
    });
  };

  /** Opens confirmation modal for Activate */
  const handleActivateClick = () => {
    if (!user) return;
    setModal({
      isOpen: true,
      title: 'Activate User',
      message: `Are you sure you want to activate ${user.username}? They will regain full access to the platform.`,
      confirmText: 'Yes, Activate',
      type: 'success',
      onConfirm: () => commitStatusChange('Active'),
    });
  };

  const renderStars = () => {
    const tier = id ? (Number(id) % 3) + 1 : 1;
    return (
      <div className="user-details__stars" aria-label={`${tier} out of 3 stars`}>
        {Array.from({ length: 3 }).map((_, index) => (
          <i key={index} className={index < tier ? 'fa-solid fa-star' : 'fa-regular fa-star'}></i>
        ))}
      </div>
    );
  };

  if (isLoading) {
    return (
      <div className="user-details user-details--loading">
        <button className="user-details__back" onClick={() => navigate('/users')}>
          <i className="fa-solid fa-arrow-left-long"></i>
          <span>Back to Users</span>
        </button>
        <div className="user-details__spinner-container">
          <div className="user-details__spinner"></div>
          <p>Loading user details...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="user-details user-details--error">
        <button className="user-details__back" onClick={() => navigate('/users')}>
          <i className="fa-solid fa-arrow-left-long"></i>
          <span>Back to Users</span>
        </button>
        <div className="user-details__error-card">
          <i className="fa-solid fa-circle-exclamation user-details__error-icon"></i>
          <h2>User Not Found</h2>
          <p>The user with ID "{id}" could not be found.</p>
          <button className="user-details__error-btn" onClick={() => navigate('/users')}>
            Return to Users Directory
          </button>
        </div>
      </div>
    );
  }

  const isBlacklisted = user.status === 'Blacklisted';
  const isActive = user.status === 'Active';

  return (
    <div className="user-details">
      {/* Back Link */}
      <button className="user-details__back" onClick={() => navigate('/users')}>
        <i className="fa-solid fa-arrow-left-long"></i>
        <span>Back to Users</span>
      </button>

      {/* Page Header */}
      <div className="user-details__page-header">
        <h1 className="user-details__page-title">User Details</h1>
        <div className="user-details__page-actions">
          <button
            className={`user-details__action-btn user-details__action-btn--blacklist${isBlacklisted ? ' user-details__action-btn--current' : ''}`}
            onClick={handleBlacklistClick}
            disabled={isBlacklisted}
            title={isBlacklisted ? 'User is already blacklisted' : 'Blacklist this user'}
          >
            {isBlacklisted ? 'Blacklisted' : 'Blacklist User'}
          </button>
          <button
            className={`user-details__action-btn user-details__action-btn--activate${isActive ? ' user-details__action-btn--current' : ''}`}
            onClick={handleActivateClick}
            disabled={isActive}
            title={isActive ? 'User is already active' : 'Activate this user'}
          >
            {isActive ? 'Active' : 'Activate User'}
          </button>
        </div>
      </div>

      {/* Profile Summary Card */}
      <div className="user-details__profile-card">
        <div className="user-details__profile-top">
          {/* Avatar + Name */}
          <div className="user-details__profile-identity">
            <div className="user-details__avatar">
              <img src={`https://i.pravatar.cc/150?u=${id}`} alt={user.username} />
            </div>
            <div className="user-details__identity-info">
              <h2 className="user-details__full-name">{user.username}</h2>
              <span className="user-details__account-id">LSQ{user.bvn.substring(0, 8)}</span>
            </div>
          </div>

          <div className="user-details__profile-divider" />

          {/* Tier */}
          <div className="user-details__tier">
            <span className="user-details__tier-label">User's Tier</span>
            {renderStars()}
          </div>

          <div className="user-details__profile-divider" />

          {/* Balance */}
          <div className="user-details__balance">
            <span className="user-details__balance-amount">
              ₦{parseFloat(user.accountBalance).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </span>
            <span className="user-details__balance-bank">{user.accountNumber}/{user.bankName}</span>
          </div>
        </div>

        {/* Tabs */}
        <nav className="user-details__tabs" role="tablist">
          {TABS.map((tab) => (
            <button
              key={tab}
              role="tab"
              aria-selected={activeTab === tab}
              className={`user-details__tab ${activeTab === tab ? 'user-details__tab--active' : ''}`}
              onClick={() => setActiveTab(tab)}
            >
              {tab}
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content Card */}
      <div className="user-details__content-card">
        {activeTab === 'General Details' && (
          <>
            <section className="user-details__section">
              <h3 className="user-details__section-title">Personal Information</h3>
              <div className="user-details__info-grid">
                <InfoItem label="Full Name" value={user.username} />
                <InfoItem label="Phone Number" value={user.phoneNumber} />
                <InfoItem label="Email Address" value={user.email} />
                <InfoItem label="BVN" value={user.bvn} />
                <InfoItem label="Gender" value={user.gender} />
                <InfoItem label="Marital Status" value={user.maritalStatus} />
                <InfoItem label="Children" value={user.children} />
                <InfoItem label="Type of Residence" value={user.residenceType} />
              </div>
            </section>

            <hr className="user-details__section-divider" />

            <section className="user-details__section">
              <h3 className="user-details__section-title">Education and Employment</h3>
              <div className="user-details__info-grid">
                <InfoItem label="Level of Education" value={user.educationLevel} />
                <InfoItem label="Employment Status" value={user.employmentStatus} />
                <InfoItem label="Sector of Employment" value={user.sector} />
                <InfoItem label="Duration of Employment" value={user.duration} />
                <InfoItem label="Office Email" value={user.officeEmail} />
                <InfoItem label="Monthly Income" value={user.monthlyIncome} />
                <InfoItem label="Loan Repayment" value={user.loanRepayment} />
              </div>
            </section>

            <hr className="user-details__section-divider" />

            <section className="user-details__section">
              <h3 className="user-details__section-title">Socials</h3>
              <div className="user-details__info-grid">
                <InfoItem label="Twitter" value={user.twitter} />
                <InfoItem label="Facebook" value={user.facebook} />
                <InfoItem label="Instagram" value={user.instagram} />
              </div>
            </section>

            <hr className="user-details__section-divider" />

            <section className="user-details__section">
              <h3 className="user-details__section-title">Guarantor</h3>
              <div className="user-details__info-grid">
                <InfoItem label="Full Name" value={user.guarantorName} />
                <InfoItem label="Phone Number" value={user.guarantorPhone} />
                <InfoItem label="Email Address" value={user.guarantorEmail} />
                <InfoItem label="Relationship" value={user.guarantorRelationship} />
              </div>
            </section>
          </>
        )}

        {activeTab === 'Documents' && (
          <section className="user-details__section">
            <h3 className="user-details__section-title">Documents</h3>
            <div className="user-details__placeholder">
              <i className="fa-regular fa-folder-open"></i>
              <p>No documents uploaded yet.</p>
            </div>
          </section>
        )}

        {activeTab === 'Bank Details' && (
          <section className="user-details__section">
            <h3 className="user-details__section-title">Bank Details</h3>
            <div className="user-details__info-grid">
              <InfoItem label="Bank Name" value={user.bankName} />
              <InfoItem label="Account Number" value={user.accountNumber} />
              <InfoItem label="Account Name" value={user.accountName} />
            </div>
          </section>
        )}

        {activeTab === 'Loans' && (
          <section className="user-details__section">
            <h3 className="user-details__section-title">Loans</h3>
            <div className="user-details__placeholder">
              <i className="fa-solid fa-hand-holding-dollar"></i>
              <p>No loan records available.</p>
            </div>
          </section>
        )}

        {activeTab === 'Savings' && (
          <section className="user-details__section">
            <h3 className="user-details__section-title">Savings</h3>
            <div className="user-details__placeholder">
              <i className="fa-solid fa-piggy-bank"></i>
              <p>No savings records available.</p>
            </div>
          </section>
        )}

        {activeTab === 'App and System' && (
          <section className="user-details__section">
            <h3 className="user-details__section-title">App and System</h3>
            <div className="user-details__info-grid">
              <InfoItem label="Device Model" value="iPhone 11 Pro" />
              <InfoItem label="Operating System" value="iOS 14" />
              <InfoItem label="App Version" value="1.0.0" />
              <InfoItem label="Last Active Login" value={user.dateJoined} />
              <InfoItem label="Date Joined" value={user.dateJoined} />
            </div>
          </section>
        )}
      </div>

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

/** Reusable label / value display atom */
const InfoItem: React.FC<{ label: string; value: string }> = ({ label, value }) => (
  <div className="info-item">
    <span className="info-item__label">{label}</span>
    <span className="info-item__value">{value}</span>
  </div>
);

export default UserDetails;
