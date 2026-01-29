"use client";
import React, { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import FormControl from "@mui/material/FormControl";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Snackbar from "@mui/material/Snackbar";
import IconButton from "@mui/material/IconButton";
import InputAdornment from "@mui/material/InputAdornment";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import "./login.css";
import { auth, db, githubprovider, provider } from "../../app/config/firebase";
import { signInWithEmailAndPassword, signInWithPopup } from "firebase/auth";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/app/redux/store";
import { loginThunk, registerThunk } from "@/app/redux/features/users/userSlice";
import { useAppSelector } from "@/app/redux/hooks";

const LoginUserSchema = z.object({
  email: z.string().trim().min(1, "Email is required").email("Enter a valid email address"),
  password: z.string().min(8, { message: "Password is required" }),
});

type LoginFormInputs = z.infer<typeof LoginUserSchema>;

interface UserState {
  users: LoginFormInputs[];
  isAuthenticated: boolean;
}

interface RootState {
  users: UserState;
}

export default function LoginForm() {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const err = useAppSelector((state: any) => state.users.error)

  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleClose = (event: React.SyntheticEvent | Event, reason?: string) => {
    if (reason === "clickaway") return;
    setSnackbarOpen(false);
  };

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(LoginUserSchema),
    defaultValues: { email: "", password: "" },
  });

  const handleTogglePassword = () => setShowPassword((prev) => !prev);

  const handleSignIn = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      if (!user.email) {
        throw new Error("Google account has no email");
      }

      const loginData = {
        email: user.email
      }

      const loginResponse = await dispatch(loginThunk( loginData));

      if (loginThunk.fulfilled.match(loginResponse)) {
        setSnackbarMessage("Login successful!");
        setSnackbarOpen(true);
        router.push('/question')
        return;
      } else {
        setSnackbarMessage("User does not exist, Register First!");
        setSnackbarOpen(true);
      }
    } catch (error) {
      console.error(error);
      setSnackbarMessage("Google sign-in failed");
      setSnackbarOpen(true);
    }
  };

  const handleSignInGithub = async () => {
    try {
      const result = await signInWithPopup(auth, githubprovider);
      const user = result.user;

      const loginData = {
        email: user.email
      }

      const loginResponse = await dispatch(loginThunk(loginData));

      if (loginThunk.fulfilled.match(loginResponse)) {
        setSnackbarMessage("Login successful!");
        setSnackbarOpen(true);
        router.push('/question')
        return;
      } else {
        setSnackbarMessage("User does not exist, Register First!");
        setSnackbarOpen(true);
      }
    } catch (error) {
      console.error(error);
      setSnackbarMessage("GitHub sign-in failed");
      setSnackbarOpen(true);
    }
  }

  const onSubmit = async (data: LoginFormInputs) => {
    try {
      const response = await signInWithEmailAndPassword(auth, data.email, data.password);

      const loginData = {
        email: data.email
      }
      const loginResponse = await dispatch(loginThunk(loginData));

      if (loginThunk.fulfilled.match(loginResponse)) {
        setSnackbarMessage("Login successful!");
        setSnackbarOpen(true);
        setTimeout(() => router.push('/question'), 1200);
      } else {
        setSnackbarMessage(err);
        setSnackbarOpen(true);
      }

    } catch (error: any) {
  const message =
    error.code === "auth/user-not-found"
      ? "User not registered"
      : error.code === "auth/wrong-password"
      ? "Incorrect password"
      : "Login failed";

  setSnackbarMessage(message);
  setSnackbarOpen(true);
}

  };

  return (
    <div>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Box sx={{ display: "flex", flexDirection: "column", width: 300, gap: 1.5, mt: 4 }}>
          <FormControl variant="standard">
            <TextField
              label="Email"
              variant="standard"
              {...register("email")}
              error={!!errors.email}
              helperText={errors.email ? errors.email.message : ""}
            />
          </FormControl>

          <FormControl variant="standard">
            <TextField
              label="Password"
              type={showPassword ? "text" : "password"}
              variant="standard"
              {...register("password")}
              error={!!errors.password}
              helperText={errors.password ? errors.password.message : ""}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={handleTogglePassword} edge="end">
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
          </FormControl>

          <Button variant="contained" sx={{ mt: 2 }} type="submit">
            Login
          </Button>
        </Box>
      </form>

      <Button
        variant="contained"
        sx={{ mt: 4, width: 300, borderRadius: "500px" }}
        onClick={handleSignIn}
      >
        Sign in With Google
      </Button>

      <Button
        variant="contained"
        sx={{ mt: 4, width: 300, borderRadius: "500px" }}
        onClick={handleSignInGithub}
      >
        Sign in With Github
      </Button>
      <div className="register">
        <p>
          Not Registered{" "}
          <span className="register_link" onClick={() => router.push("/register")}>
            Register
          </span>
        </p>
      </div>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={2000}
        onClose={handleClose}
        message={snackbarMessage}
      />
    </div>
  );
}
