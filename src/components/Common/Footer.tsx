import styled from "styled-components";
import React from "react";
import colors from "../../assets/colors";
import { useNavigate } from "react-router";

const Footer = () => {
  const navigate = useNavigate();
  const onClickMoveAdmin = () => {
    navigate("/admin/signin");
  };

  return (
    <FooterStyle>
      <FooterLinkStyle onClick={() => onClickMoveAdmin()}>
        관리자 페이지
      </FooterLinkStyle>
    </FooterStyle>
  );
};

export default Footer;
const FooterStyle = styled.footer`
  width: 100%;
  height: 74px;
  border-top: 1px solid #e4e5ed;
  background-color: #ffffff;
  justify-content: center;
  align-items: center;
  display: flex;
`;

const FooterLinkStyle = styled.div`
  cursor: pointer;
`;
