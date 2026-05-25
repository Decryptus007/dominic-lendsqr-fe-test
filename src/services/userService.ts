export interface User {
  id: string;
  organization: string;
  username: string;
  email: string;
  phoneNumber: string;
  dateJoined: string;
  status: 'Active' | 'Inactive' | 'Pending' | 'Blacklisted';
  bvn: string;
  gender: string;
  maritalStatus: string;
  children: string;
  residenceType: string;
  educationLevel: string;
  employmentStatus: string;
  sector: string;
  duration: string;
  officeEmail: string;
  monthlyIncome: string;
  loanRepayment: string;
  twitter: string;
  facebook: string;
  instagram: string;
  guarantorName: string;
  guarantorPhone: string;
  guarantorEmail: string;
  guarantorRelationship: string;
  bankName: string;
  accountNumber: string;
  accountBalance: string;
  accountName: string;
}

const STORAGE_KEY = 'lendsqr_users';

export const userService = {
  /**
   * Fetches all users.
   * Checks localStorage first. If not present, fetches from the mock API (/mock-users.json)
   * and stores it in localStorage before returning.
   */
  async fetchUsers(): Promise<User[]> {
    const cached = localStorage.getItem(STORAGE_KEY);
    if (cached) {
      try {
        return JSON.parse(cached) as User[];
      } catch (e) {
        console.error('Failed to parse cached users, refetching...', e);
      }
    }

    // Not cached or corrupt cache, fetch from mock API
    const response = await fetch('/mock-users.json');
    if (!response.ok) {
      throw new Error(`Failed to fetch mock users: ${response.statusText}`);
    }
    const data = await response.json() as User[];
    
    // Save to localStorage cache
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    return data;
  },

  /**
   * Retrieves a specific user by their ID.
   * If the cache is empty, it fetches and initializes the cache first.
   */
  async getUserById(id: string): Promise<User | undefined> {
    let users = await this.getCachedUsers();
    if (users.length === 0) {
      users = await this.fetchUsers();
    }
    return users.find((u) => u.id === id);
  },

  /**
   * Updates a user's status.
   * Saves changes to localStorage so they persist across routes and page reloads.
   */
  async updateUserStatus(id: string, status: User['status']): Promise<User | undefined> {
    let users = await this.getCachedUsers();
    if (users.length === 0) {
      users = await this.fetchUsers();
    }

    let updatedUser: User | undefined;
    const updatedUsers = users.map((u) => {
      if (u.id === id) {
        updatedUser = { ...u, status };
        return updatedUser;
      }
      return u;
    });

    if (updatedUser) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedUsers));
    }
    
    return updatedUser;
  },

  /**
   * Helper to retrieve cached users synchronously/asynchronously from localStorage.
   */
  async getCachedUsers(): Promise<User[]> {
    const cached = localStorage.getItem(STORAGE_KEY);
    if (!cached) return [];
    try {
      return JSON.parse(cached) as User[];
    } catch {
      return [];
    }
  }
};
