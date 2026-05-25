import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './UserDetails.scss';
import { mockUsers } from '../Users/Users';

type Tab =
  | 'General Details'
  | 'Documents'
  | 'Bank Details'
  | 'Loans'
  | 'Savings'
  | 'App and System';

const TABS: Tab[] = [
  'General Details',
  'Documents',
  'Bank Details',
  'Loans',
  'Savings',
  'App and System',
];

const UserDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<Tab>('General Details');

  // Retrieve user from mock data; fall back to defaults for demo
  const user = mockUsers.find((u) => u.id === id);

  const handleStatusChange = (newStatus: 'Active' | 'Blacklisted') => {
    alert(`User status changed to: ${newStatus}`);
  };

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
            className="user-details__action-btn user-details__action-btn--blacklist"
            onClick={() => handleStatusChange('Blacklisted')}
          >
            Blacklist User
          </button>
          <button
            className="user-details__action-btn user-details__action-btn--activate"
            onClick={() => handleStatusChange('Active')}
          >
            Activate User
          </button>
        </div>
      </div>

      {/* Profile Summary Card */}
      <div className="user-details__profile-card">
        <div className="user-details__profile-top">
          {/* Avatar + Name */}
          <div className="user-details__profile-identity">
            <div className="user-details__avatar">
              <img
                src={`https://i.pravatar.cc/150?u=${id}`}
                alt={user?.username ?? 'User avatar'}
              />
            </div>
            <div className="user-details__identity-info">
              <h2 className="user-details__full-name">{user?.username ?? 'Adedeji Grace'}</h2>
              <span className="user-details__account-id">LSQFf587g90</span>
            </div>
          </div>

          <div className="user-details__profile-divider" />

          {/* Tier */}
          <div className="user-details__tier">
            <span className="user-details__tier-label">User's Tier</span>
            <div className="user-details__stars" aria-label="1 out of 3 stars">
              <i className="fa-solid fa-star"></i>
              <i className="fa-regular fa-star"></i>
              <i className="fa-regular fa-star"></i>
            </div>
          </div>

          <div className="user-details__profile-divider" />

          {/* Balance */}
          <div className="user-details__balance">
            <span className="user-details__balance-amount">₦200,000.00</span>
            <span className="user-details__balance-bank">9912345678/Providus Bank</span>
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
            {/* Personal Information */}
            <section className="user-details__section">
              <h3 className="user-details__section-title">Personal Information</h3>
              <div className="user-details__info-grid">
                <InfoItem label="Full Name" value={user?.username ?? 'Grace Effiom'} />
                <InfoItem label="Phone Number" value={user?.phoneNumber ?? '07060780922'} />
                <InfoItem label="Email Address" value={user?.email ?? 'grace@gmail.com'} />
                <InfoItem label="BVN" value="07060780922" />
                <InfoItem label="Gender" value="Female" />
                <InfoItem label="Marital Status" value="Single" />
                <InfoItem label="Children" value="None" />
                <InfoItem label="Type of Residence" value="Parent's Apartment" />
              </div>
            </section>

            <hr className="user-details__section-divider" />

            {/* Education & Employment */}
            <section className="user-details__section">
              <h3 className="user-details__section-title">Education and Employment</h3>
              <div className="user-details__info-grid">
                <InfoItem label="Level of Education" value="B.Sc" />
                <InfoItem label="Employment Status" value="Employed" />
                <InfoItem label="Sector of Employment" value="FinTech" />
                <InfoItem label="Duration of Employment" value="2 Years" />
                <InfoItem label="Office Email" value="grace@lendsqr.com" />
                <InfoItem label="Monthly Income" value="₦200,000.00 – ₦400,000.00" />
                <InfoItem label="Loan Repayment" value="₦40,000" />
              </div>
            </section>

            <hr className="user-details__section-divider" />

            {/* Socials */}
            <section className="user-details__section">
              <h3 className="user-details__section-title">Socials</h3>
              <div className="user-details__info-grid">
                <InfoItem label="Twitter" value="@grace_effiom" />
                <InfoItem label="Facebook" value="Grace Effiom" />
                <InfoItem label="Instagram" value="@grace_effiom" />
              </div>
            </section>

            <hr className="user-details__section-divider" />

            {/* Guarantor */}
            <section className="user-details__section">
              <h3 className="user-details__section-title">Guarantor</h3>
              <div className="user-details__info-grid">
                <InfoItem label="Full Name" value="Debby Morgan" />
                <InfoItem label="Phone Number" value="07060780922" />
                <InfoItem label="Email Address" value="debby@gmail.com" />
                <InfoItem label="Relationship" value="Sister" />
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
              <InfoItem label="Bank Name" value="Providus Bank" />
              <InfoItem label="Account Number" value="9912345678" />
              <InfoItem label="Account Name" value="Grace Effiom" />
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
              <InfoItem label="Last Active Login" value={user?.dateJoined ?? 'May 15, 2020 10:00 AM'} />
              <InfoItem label="Date Joined" value={user?.dateJoined ?? 'May 15, 2020 10:00 AM'} />
            </div>
          </section>
        )}
      </div>
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
