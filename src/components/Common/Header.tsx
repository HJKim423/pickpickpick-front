import { useEffect, useState } from "react";
import styled from "styled-components";
import colors from "../../assets/colors";
import { ReactComponent as Logo } from "../../assets/images/Home/PPPick-logo.svg";
import { ReactComponent as Profile } from "../../assets/images/Home/profile.svg";
import type { MenuProps } from "antd";
import { Dropdown, Button } from "antd";
import { Navigate, useNavigate } from "react-router";
import KakaoLogout from "../../pages/Login/KakaoLogout";
import { getUserInfo } from "../../api/user";
import { useQuery } from "react-query";

import LoginModal from "../../pages/Login/LoginModal";
import KakaoLogin from "../../pages/Login/KakaoLogin";
import NaverLogin from "../../pages/Login/NaverLogin";
import GoogleLogin from "../../pages/Login/GoogleLogin";

const items: MenuProps["items"] = [
  {
    key: "1",
    label: (
      <a href="https://www.pppick.store/mypage">
        <div
          className="menu-item"
          style={{
            fontSize: "15px",
            width: "120px",
            padding: "7px 0",
            textAlign: "center",
            color: colors.text,
          }}
        >
          마이페이지
        </div>
      </a>
    ),
  },
  {
    key: "2",
    label: (
      <a href="https://www.pppick.store/heart">
        <div
          className="menu-item"
          style={{
            fontSize: "15px",
            width: "120px",
            padding: "7px 0",
            textAlign: "center",
            color: colors.text,
          }}
        >
          나의 찜목록
        </div>
      </a>
    ),
  },
  {
    key: "3",
    label: (
      <a href="https://www.pppick.store/portfolio/post">
        <div
          className="menu-item"
          style={{
            fontSize: "15px",
            width: "120px",
            padding: "7px 0",
            textAlign: "center",
            color: colors.text,
          }}
        >
          포트폴리오 등록
        </div>
      </a>
    ),
  },
  {
    key: "4",
    label: (
      <a href="https://www.pppick.store/product/post">
        <div
          className="menu-item"
          style={{
            fontSize: "15px",
            width: "120px",
            padding: "7px 0",
            textAlign: "center",
            color: colors.text,
          }}
        >
          상품 등록
        </div>
      </a>
    ),
  },
  {
    key: "5",
    label: (
      <KakaoLogout />
      // <div
      //   className="menu-item"
      //   style={{
      //     fontSize: "15px",
      //     width: "100px",
      //     padding: "7px 0",
      //     textAlign: "center",
      //     color: colors.text,
      //   }}
      // >
      //   로그아웃
      // </div>
    ),
  },
];

const Header = () => {
  const [isLogin, setIsLogin] = useState<boolean>(false);
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const userId = Number(localStorage.getItem("userId"));
  const { data: User } = useQuery("getUser", () => getUserInfo(userId));
  const ImgURL =
    User?.data.imageUrl[0] === "h"
      ? User?.data.imageUrl
      : `https://api.pppick.store/${User?.data.imageUrl}`;
  useEffect(() => {
    if (userId) {
      setIsLogin(true);
    } else {
      setIsLogin(false);
    }
  }, [userId]);

  return (
    <HeaderStyle>
      <div className="header">
        <Logo
          onClick={() => {
            navigate("/");
            window.location.reload();
          }}
          style={{ cursor: "pointer" }}
        />
        <div className="header-right">
          <div className="login">
            {isLogin ? (
              <>
                <Dropdown menu={{ items }} overlayStyle={{ zIndex: 11 }}>
                  <div className="profile">
                    {User?.data.imageUrl ? (
                      <img src={ImgURL} alt="" />
                    ) : (
                      <Profile width="45px" height="45px" />
                    )}
                  </div>
                </Dropdown>
              </>
            ) : (
              <div className="login-container">
                <h1>로그인</h1>
                <div className="login-button">
                  <KakaoLogin />
                </div>
                <div className="login-button">
                  <NaverLogin />
                </div>
                <div className="login-button">
                  <GoogleLogin />
                </div>
              </div>
              // <div
              //   className="login-container"
              //   onClick={() => {
              //     setIsOpen(true);
              //   }}
              // >
              //   로그인하기
              // </div>
            )}
          </div>
        </div>
      </div>
      {/* <LoginModal isOpen={isOpen} setIsOpen={setIsOpen} /> */}
    </HeaderStyle>
  );
};

export default Header;

const HeaderStyle = styled.header`
  position: fixed;
  z-index: 10;
  background-color: #ffffff;
  width: 100%;
  border-bottom: 1px solid #e4e5ed;

  .header {
    height: 74px;
    width: 1200px;
    margin: 0 auto;
    padding: 0 16px;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .login-container {
    display: flex;
    align-items: center;
    h1 {
      margin-bottom: 5px;
      margin-right: 10px;
      color: gray;
      font-weight: 700;
    }
  }
  .login-button {
    width: 40px;
    cursor: pointer;
    margin: 0 auto;
    margin-bottom: 5px;
    margin-left: 10px;
    img {
      width: 100%;
      //   object-fit: cover;
    }
  }

  .profile {
    width: 45px;
    height: 45px;
    display: flex;
    align-items: center;
    transition: 0.2s all ease-out;

    img {
      width: 100%;
      height: 100%;
      border-radius: 100%;
    }
  }
  .profile: hover {
    cursor: pointer;
    filter: drop-shadow(0 0 3px rgba(0, 0, 0, 0.5));
  }

  .login {
    position: relative;
    padding-left: 40px;
  }

  .admin {
    font-size: 10px;
    margin-top: 2px;
    color: gray;
    text-decoration: underline;
    cursor: pointer;
    position: absolute;
    right: 0;
  }
`;
