import React from "react";
import { Paper, Typography, Container, Box } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useDispatch } from "react-redux";
import { setLogin } from "reducers/authReducer";
import { signUpIfNotExist } from "service/auth";
import jwt_decode from "jwt-decode";
import { GoogleLogin } from "@react-oauth/google";

const Auth = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  async function handleCallBackResponse(response) {
    var userObject = jwt_decode(response.credential);
    try {
      const response = await signUpIfNotExist(userObject);
      dispatch(setLogin(response));
      navigate("/");
    } catch (error) {
      if (error.response) {
        toast.error(error.response.data.message, {
          position: toast.POSITION.TOP_CENTER,
        });
      } else {
        toast.error(error.message, {
          position: toast.POSITION.TOP_CENTER,
        });
      }
    }
  }

  return (
    <Container component="main" maxWidth="xs" fixed>
      <ToastContainer />

      <Paper elevation={3} sx={{ borderRadius: "1", height: "15rem" }}>
        <Box
          sx={{
            marginTop: 15,
            p: 1.5,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            height: "20rem",
          }}
        >
          <Box
            component="img"
            sx={{
              height: 100,
              width: 100,
            }}
            alt="Ultra logo"
            src="assets/images/icons/icon-384x384.png"
          />
          <Typography component="h1" variant="h5">
            Join Ultra
          </Typography>
          <Box sx={{ m: 2, mt: 0, p: 3 }}>
            <GoogleLogin
              theme="filled_black"
              type="standard"
              text="continue_with"
              shape="pill"
              size="large"
              logo_alignment="center"
              useOneTap="true"
              ux_mode="popup"
              onSuccess={(credentialResponse) => {
                handleCallBackResponse(credentialResponse);
              }}
              onError={(err) => {
                toast.error(err, {
                  position: toast.POSITION.TOP_CENTER,
                });
              }}
            />
          </Box>
        </Box>
      </Paper>
    </Container>
  );
};

export default Auth;
