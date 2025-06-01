import md5 from "blueimp-md5";

/**
 * Generates a Gravatar URL from an email
 * @param email User's email
 * @param size Optional size (default is 64)
 * @returns Gravatar image URL
 */
export const generateAvatarUrl = (email: string, size: number = 64): string => {
  const hash = md5(email?.trim().toLowerCase());
  return `https://www.gravatar.com/avatar/${hash}?d=identicon&s=${size}`;
};
