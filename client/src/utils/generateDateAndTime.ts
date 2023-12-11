export const formatDate = () => {
  return new Date().toLocaleDateString('ru', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
};

export const formatTime = () => {
  return new Date().toLocaleTimeString('ru', {
    hour: '2-digit',
    minute: '2-digit',
  });
};
