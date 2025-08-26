export function validateEmailOrPhone(value) {
  if (!value.trim()) {
    return "Email or phone is required";
  }

  // Email regex (simple, not overly strict)
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  // Phone regex (10–15 digits, optional + at start)
  const phoneRegex = /^\+?\d{10,15}$/;

  if (!emailRegex.test(value) && !phoneRegex.test(value)) {
    return "Enter a valid email or phone number";
  }

  return null; // ✅ No errors
}
export function validateFullName(fullName) {
  if (!fullName.trim()) {
    return "Full name is required";
  }
  if (fullName.trim().length < 2) {
    return "Full name must be at least 2 characters";
  }
  return null;
}

export function validatePassword(password){
  if (!password) {
    return "Password is required";
  }

  if (password.length < 8) {
    return "Password must be at least 8 characters";
  }

  if (!/[A-Z]/.test(password)) {
    return "Password must contain at least one uppercase letter";
  }

  if (!/[a-z]/.test(password)) {
    return "Password must contain at least one lowercase letter";
  }

  if (!/[0-9]/.test(password)) {
    return "Password must contain at least one number";
  }

  if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
    return "Password must contain at least one special character";
  }

  return null;
}


export function validateConfirmPassword(
  password,
  confirmPassword
) {
  if (!confirmPassword) {
    return "Confirm password is required";
  }
  if (password !== confirmPassword) {
    return "Passwords do not match";
  }
  return null;
}


export const ValidateIsEmail  = (data)=>{
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(data)
}
export const ValidateIsPhone = (data) =>{
  const phoneRegex = /^\+?\d{10,15}$/;
  return phoneRegex.test(data)
}

export function validateUsername(username) {
  if (!username.trim()) {
    return "Username is required";
  }

  // ✅ Must not start with number
  if (/^[0-9]/.test(username)) {
    return "Username cannot start with a number";
  }

  // ✅ Allowed: letters, numbers, underscore, dot
  const usernameRegex = /^[A-Za-z][A-Za-z0-9._]*$/;

  if (!usernameRegex.test(username)) {
    return "Username can only contain letters, numbers, underscores, and dots";
  }

  // ✅ Optional: min/max length rule (add if needed)
  if (username.length < 3) {
    return "Username must be at least 3 characters long";
  }
  if (username.length > 20) {
    return "Username cannot exceed 20 characters";
  }

  return null; // ✅ valid
}
