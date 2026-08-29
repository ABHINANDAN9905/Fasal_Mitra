import crypto from 'crypto';

// Initial pre-configured demo farmers for instant 1-click testing
const INITIAL_FARMERS = [
  {
    id: 'farmer-1',
    name: 'Ramesh Patil',
    hindiName: 'रमेश पाटिल',
    marathiName: 'रमेश पाटील',
    phone: '9876543210',
    email: 'ramesh.patil@fasalmitra.in',
    state: 'Maharashtra',
    district: 'Nashik',
    village: 'Niphad',
    preferredCrop: 'onion',
    farmSizeAcres: 5,
    role: 'Farmer',
    avatar: '👨‍🌾',
    createdAt: new Date().toISOString()
  },
  {
    id: 'farmer-2',
    name: 'Sardar Balwinder Singh',
    hindiName: 'बलविंदर सिंह',
    marathiName: 'बलविंदर सिंग',
    phone: '9123456780',
    email: 'balwinder.singh@fasalmitra.in',
    state: 'Punjab',
    district: 'Khanna',
    village: 'Khanna Rural',
    preferredCrop: 'wheat',
    farmSizeAcres: 12,
    role: 'Farmer & FPO Lead',
    avatar: '🌾',
    createdAt: new Date().toISOString()
  },
  {
    id: 'farmer-3',
    name: 'Venkatesh Rao',
    hindiName: 'वेंकटेश राव',
    marathiName: 'व्यंकटेश राव',
    phone: '9988776655',
    email: 'venkatesh.rao@fasalmitra.in',
    state: 'Karnataka',
    district: 'Kolar',
    village: 'Kolar Hub',
    preferredCrop: 'tomato',
    farmSizeAcres: 4,
    role: 'Vegetable Grower',
    avatar: '🍅',
    createdAt: new Date().toISOString()
  },
  {
    id: 'farmer-4',
    name: 'Virender Yadav',
    hindiName: 'वीरेंद्र यादव',
    marathiName: 'वीरेंद्र यादव',
    phone: '9811223344',
    email: 'virender.yadav@fasalmitra.in',
    state: 'Haryana',
    district: 'Gurugram',
    village: 'Sohna',
    preferredCrop: 'wheat',
    farmSizeAcres: 8,
    role: 'Farmer',
    avatar: '🚜',
    createdAt: new Date().toISOString()
  }
];

// In-memory persistent store for users during runtime
const users = new Map();
const sessions = new Map();

// Helper to hash password using Node's crypto
const hashPassword = (password, salt = 'fasal-mitra-salt') => {
  return crypto.pbkdf2Sync(password, salt, 1000, 32, 'sha256').toString('hex');
};

// Seed initial demo farmers
for (const f of INITIAL_FARMERS) {
  users.set(f.phone, {
    ...f,
    passwordHash: hashPassword('farmer123')
  });
  if (f.email) {
    users.set(f.email.toLowerCase(), users.get(f.phone));
  }
}

// Generate auth token
const generateToken = (userId) => {
  const token = crypto.randomBytes(32).toString('hex');
  sessions.set(token, {
    userId,
    createdAt: Date.now(),
    expiresAt: Date.now() + 30 * 24 * 60 * 60 * 1000 // 30 days
  });
  return token;
};

/**
 * Register a new Farmer account
 */
export const registerUser = async ({
  name,
  phone,
  email,
  password,
  state = 'Maharashtra',
  district = 'Nashik',
  village = '',
  preferredCrop = 'onion',
  farmSizeAcres = 2
}) => {
  if (!name || !name.trim()) {
    throw new Error('Please enter your full name');
  }
  if (!phone || phone.trim().length < 10) {
    throw new Error('Please enter a valid 10-digit mobile number');
  }
  if (!password || password.length < 4) {
    throw new Error('Password must be at least 4 characters');
  }

  const cleanPhone = phone.trim();
  const cleanEmail = email ? email.trim().toLowerCase() : '';

  // If user already exists, update their profile and log them in
  let existingUser = users.get(cleanPhone) || (cleanEmail ? users.get(cleanEmail) : null);
  const userId = existingUser ? existingUser.id : `farmer-${Date.now()}`;

  const updatedUser = {
    id: userId,
    name: name.trim(),
    phone: cleanPhone,
    email: cleanEmail || `${cleanPhone}@fasalmitra.in`,
    state: state || 'Maharashtra',
    district: district || 'Nashik',
    village: village || '',
    preferredCrop: preferredCrop || 'onion',
    farmSizeAcres: Number(farmSizeAcres) || 2,
    role: 'Farmer',
    avatar: '👨‍🌾',
    passwordHash: hashPassword(password),
    createdAt: existingUser ? existingUser.createdAt : new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  users.set(cleanPhone, updatedUser);
  if (cleanEmail) {
    users.set(cleanEmail, updatedUser);
  }

  const token = generateToken(updatedUser.id);

  const { passwordHash, ...userWithoutPassword } = updatedUser;
  return {
    user: userWithoutPassword,
    token
  };
};

/**
 * Authenticate Farmer with Phone/Email and Password
 */
export const loginUser = async ({ identifier, password }) => {
  if (!identifier || !identifier.trim()) {
    throw new Error('Mobile number or Email is required');
  }
  if (!password) {
    throw new Error('Password is required');
  }

  const cleanId = identifier.trim().toLowerCase();
  const user = users.get(cleanId);

  if (!user) {
    throw new Error('No account found with this mobile number. Please sign up above.');
  }

  const hashedInput = hashPassword(password);
  if (user.passwordHash !== hashedInput) {
    throw new Error('Incorrect password. (For demo accounts, password is: farmer123)');
  }

  const token = generateToken(user.id);

  const { passwordHash, ...userWithoutPassword } = user;
  return {
    user: userWithoutPassword,
    token
  };
};

/**
 * Quick 1-Click Demo Login
 */
export const demoLoginUser = async (farmerId = 'farmer-1') => {
  const farmer = INITIAL_FARMERS.find(f => f.id === farmerId) || INITIAL_FARMERS[0];
  const user = users.get(farmer.phone);
  const token = generateToken(user.id);
  const { passwordHash, ...userWithoutPassword } = user;
  return {
    user: userWithoutPassword,
    token
  };
};

/**
 * Get User Profile from Token
 */
export const getUserFromToken = async (token) => {
  if (!token) return null;
  const session = sessions.get(token);
  if (!session) return null;

  if (Date.now() > session.expiresAt) {
    sessions.delete(token);
    return null;
  }

  // Find user by ID
  for (const user of users.values()) {
    if (user.id === session.userId) {
      const { passwordHash, ...userWithoutPassword } = user;
      return userWithoutPassword;
    }
  }

  return null;
};

/**
 * Invalidate Session Token
 */
export const logoutUser = async (token) => {
  if (token) {
    sessions.delete(token);
  }
  return true;
};

/**
 * Get List of Pre-configured Demo Farmers for UI 1-Click Login
 */
export const getDemoFarmersList = () => {
  return INITIAL_FARMERS.map(f => ({
    id: f.id,
    name: f.name,
    hindiName: f.hindiName,
    marathiName: f.marathiName,
    phone: f.phone,
    state: f.state,
    district: f.district,
    preferredCrop: f.preferredCrop,
    avatar: f.avatar,
    role: f.role
  }));
};
