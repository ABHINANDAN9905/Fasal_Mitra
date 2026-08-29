import {
  registerUser,
  loginUser,
  demoLoginUser,
  getUserFromToken,
  logoutUser,
  getDemoFarmersList
} from '../services/authService.js';

export async function signup(req, res) {
  try {
    const { name, phone, email, password, state, district, village, preferredCrop, farmSizeAcres } = req.body;
    const result = await registerUser({
      name,
      phone,
      email,
      password,
      state,
      district,
      village,
      preferredCrop,
      farmSizeAcres
    });

    return res.status(201).json({
      success: true,
      message: 'Account created successfully! Welcome to Fasal Mitra.',
      ...result
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message || 'Registration failed'
    });
  }
}

export async function login(req, res) {
  try {
    const { identifier, phone, email, password } = req.body;
    const result = await loginUser({
      identifier: identifier || phone || email,
      password
    });

    return res.json({
      success: true,
      message: 'Logged in successfully! Welcome back.',
      ...result
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message || 'Login failed'
    });
  }
}

export async function demoLogin(req, res) {
  try {
    const { farmerId } = req.body;
    const result = await demoLoginUser(farmerId);

    return res.json({
      success: true,
      message: 'Logged in with Demo Farmer Account',
      ...result
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message || 'Demo login failed'
    });
  }
}

export async function getMe(req, res) {
  try {
    const authHeader = req.headers.authorization || '';
    const token = authHeader.replace(/^Bearer\s+/i, '').trim();

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'No authorization token provided'
      });
    }

    const user = await getUserFromToken(token);
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid or expired session. Please log in again.'
      });
    }

    return res.json({
      success: true,
      user
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || 'Failed to retrieve profile'
    });
  }
}

export async function logout(req, res) {
  try {
    const authHeader = req.headers.authorization || '';
    const token = authHeader.replace(/^Bearer\s+/i, '').trim();

    await logoutUser(token);

    return res.json({
      success: true,
      message: 'Logged out successfully'
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || 'Logout failed'
    });
  }
}

export async function getDemoFarmers(req, res) {
  try {
    const farmers = getDemoFarmersList();
    return res.json({
      success: true,
      farmers
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || 'Failed to load demo accounts'
    });
  }
}
