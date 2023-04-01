export const ENV = {
  SERVER_URL: "https://cmusic-server.onrender.com/api",
};

export const loadingBackdropStyle = {
  position: "fixed",
  width: "100%",
  height: "100%",
  maxHeight: "100vh",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  zIndex: 10000,
  backgroundColor: "#ffffffd4",
};

export const audioSpinnerStyle = {
  position: "fixed",
  width: "50%",
  height: "50%",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  zIndex: 10000,
};

export const formItemLayout = {
  labelCol: {
    xs: {
      span: 24,
    },
    sm: {
      span: 8,
    },
  },
  wrapperCol: {
    xs: {
      span: 24,
    },
    sm: {
      span: 16,
    },
  },
};
