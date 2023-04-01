export const datetime = (value) => {
  const date = new Date(value);
  return date.toLocaleString("vn-VN", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
};

export const formatTimeDuration = (timeInMillis) => {
  const minutes = Math.floor(timeInMillis / 60000);
  const seconds = Math.floor((timeInMillis % 60000) / 1000);
  return `${minutes < 10 ? "0" : ""}${minutes}:${
    seconds < 10 ? "0" : ""
  }${seconds}`;
};