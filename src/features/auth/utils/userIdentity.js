export function getUserIdentity(user) {
  if (!user) return null;

  if (typeof user.fullName === "string" && user.fullName.trim()) {
    return user.fullName.trim();
  }

  if (typeof user.firstName === "string" && user.firstName.trim()) {
    const firstName = user.firstName.trim();
    if (typeof user.lastName === "string" && user.lastName.trim()) {
      return `${firstName} ${user.lastName.trim()}`;
    }
    return firstName;
  }

  if (typeof user.name === "string" && user.name.trim()) {
    return user.name.trim();
  }

  if (typeof user.username === "string" && user.username.trim()) {
    return user.username.trim();
  }

  if (typeof user.email === "string" && user.email.trim()) {
    return user.email.trim();
  }

  return null;
}