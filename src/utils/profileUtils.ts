export const getInitials = (nickname: string) => {
  return nickname.slice(0, 2).toUpperCase();
};
