import React, { useState } from 'react';
import { Avatar, Box, TextField, Typography, Link, Alert } from '@mui/material';
import Grid from '@mui/material/Grid2';
import LockOpenIcon from '@mui/icons-material/LockOpen';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { selectLoginError, selectLoginLoading } from './usersSlice';
import MeetingRoomIcon from '@mui/icons-material/MeetingRoom';
import { LoginMutation } from '../../types';
import { googleLogin, login } from './usersThunks';
import { LoadingButton } from '@mui/lab';
import { CredentialResponse, GoogleLogin } from '@react-oauth/google';

const Login = () => {
  const dispatch = useAppDispatch();
  const loginLoading = useAppSelector(selectLoginLoading);
  const error = useAppSelector(selectLoginError);
  const navigate = useNavigate();
  const [state, setState] = useState<LoginMutation>({
    email: '',
    password: '',
  });

  const inputChangeHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setState((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const submitFormHandler = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await dispatch(login(state)).unwrap();
      navigate('/');
    } catch (e) {
      console.error(e);
    }
  };

  const googleLoginHandler = async (credentialResponse: CredentialResponse) => {
    try {
      if (credentialResponse.credential) {
        await dispatch(googleLogin(credentialResponse.credential)).unwrap();
      }
      navigate('/');

    } catch (e) {
      console.error(e);
    }
  };

  return (
    <Box
      sx={{
        mt: 1,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
      }}
    >
      <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
        <LockOpenIcon />
      </Avatar>
      <Typography component="h1" variant="h5">
        Sign in
      </Typography>
      {error && (
        <Alert severity="error" sx={{ mt: 3 }}>
          {error.error}
        </Alert>
      )}
      <Box sx={{ pt: 2 }}>
        <GoogleLogin
          onSuccess={googleLoginHandler}
          onError={() => {
            console.error('Login Failed!');
          }}
        />
      </Box>
      <Box component="form" noValidate onSubmit={submitFormHandler} sx={{ mt: 3 }}>
        <Grid container direction="column" spacing={2}>
          <Grid>
            <TextField
              type="email"
              label="Email"
              name="email"
              value={state.email}
              autoComplete="current-username"
              onChange={inputChangeHandler}
              required
            />
          </Grid>
          <Grid>
            <TextField
              type="password"
              label="Password"
              name="password"
              value={state.password}
              autoComplete="current-password"
              onChange={inputChangeHandler}
              required
            />
          </Grid>
        </Grid>
        <LoadingButton
          type="submit"
          fullWidth
          sx={{ mt: 3, mb: 2 }}
          color="primary"
          loading={loginLoading}
          loadingPosition="start"
          startIcon={<MeetingRoomIcon />}
          variant="contained"
        >
          <span>Sign in</span>
        </LoadingButton>
        <Link component={RouterLink} to={'/register'} variant="body2">
          Or sign up
        </Link>
      </Box>
    </Box>
  );
};

export default Login;
