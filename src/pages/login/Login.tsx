import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Container,
  TextField,
  Button,
  Typography,
  IconButton,
  InputAdornment,
  Paper,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";

const Login = ({
  setIsAuthenticated,
}: {
  setIsAuthenticated: (auth: boolean) => void;
}) => {
  const [credentials, setCredentials] = useState({
    username: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const adminAccount = {
    username: import.meta.env.VITE_ADMIN_USERNAME,
    password: import.meta.env.VITE_ADMIN_PASSWORD,
  };
  const userAccount = {
    username: import.meta.env.VITE_USER_USERNAME,
    password: import.meta.env.VITE_USER_PASSWORD,
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (
      (credentials.username === adminAccount.username &&
        credentials.password === adminAccount.password) ||
      (credentials.username === userAccount.username &&
        credentials.password === userAccount.password)
    ) {
      alert("Login Successful!");

      localStorage.setItem("isLoggedIn", "true");
      setIsAuthenticated(true);
      navigate("/");
    } else {
      alert("Invalid username or password");
    }
  };

  return (
    <Container maxWidth="xs" sx={{ mt: 15 }}>
      <Paper elevation={3} sx={{ p: 4, textAlign: "center" }}>
        <Typography variant="h5" sx={{ mb: 3 }}>
          OnCallCare Login
        </Typography>
        <form onSubmit={handleSubmit}>
          <TextField
            fullWidth
            label="Username"
            name="username"
            variant="outlined"
            value={credentials.username}
            onChange={handleChange}
            sx={{ mb: 2 }}
          />
          <TextField
            fullWidth
            label="Password"
            name="password"
            type={showPassword ? "text" : "password"}
            variant="outlined"
            value={credentials.password}
            onChange={handleChange}
            sx={{ mb: 2 }}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={() => setShowPassword(!showPassword)}>
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
          <Button fullWidth variant="contained" color="primary" type="submit">
            Login
          </Button>
        </form>
      </Paper>
    </Container>
  );
};

export default Login;
