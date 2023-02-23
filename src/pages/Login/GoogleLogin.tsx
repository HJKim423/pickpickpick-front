import axios from "axios";
import { useCallback, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router";
import Google from "../../assets/images/Home/google.png";
import jwt_decode from "jwt-decode";

interface UserInfo {
  aud: string;
  auth_time: number;
  email: string;
  exp: number;
  iat: number;
  iss: string;
  nickname: string;
  sub: string;
}

const GoogleLogin = () => {
  const KAKAO_AUTH_URL = `http://ec2-15-164-113-99.ap-northeast-2.compute.amazonaws.com:8080/oauth2/authorization/google?redirect_uri=http://localhost:3000/oauth2/redirect`;
  const loaction = useLocation();
  const searchParams = new URLSearchParams(loaction.search);
  const token = searchParams.get("token");
  const [excuted, setExcuted] = useState<boolean>(false);

  const navigate = useNavigate();

  const getGoogleToken = useCallback(async () => {
    try {
      await axios
        .get(
          `http://ec2-15-164-113-99.ap-northeast-2.compute.amazonaws.com:8080/auth/token?token=${token}`,
          {
            headers: {
              "Content-type": "application/x-www-form-urlencoded",
            },
          }
        )
        .then(res => {
          setExcuted(true);
          localStorage.setItem("userId", res.data.data.userNum);
          console.log(res.data.data.userNum);
          navigate("/");
        });
    } catch (err) {}
  }, []);

  const handleLoginGoogle = () => {
    window.location.href = KAKAO_AUTH_URL;
  };

  useEffect(() => {
    if (!loaction.search || excuted) return;
    getGoogleToken();
  }, []);

  return (
    <div onClick={handleLoginGoogle}>
      <img src={Google} alt="google" />
    </div>
  );
};

export default GoogleLogin;
