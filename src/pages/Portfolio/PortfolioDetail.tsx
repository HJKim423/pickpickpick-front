import styled from "styled-components";
import colors from "../../assets/colors";
import ImageSwiper from "../../components/Portfolio/ImageSwiper";
import { ReactComponent as Profile } from "../../assets/images/Home/profile.svg";
import ModalTag from "../../components/Portfolio/ModalTag";
import CommonYellowButton from "../../components/Common/Button";
import { ReactComponent as Heart } from "../../assets/images/Portfolio/heart.svg";
import { ReactComponent as HeartFilled } from "../../assets/images/Portfolio/heart-filled.svg";
import { useEffect, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { useParams, useNavigate } from "react-router";
import { getPortfolioId } from "../../api/portfolio";
import { getUserInfo } from "../../api/user";
import {
  getFavorites,
  patchFavorites,
  postFavorites,
} from "../../api/favorites";
import Toast from "../../components/Common/toast";
import Spinner from "../../components/Common/spinner";

const PortfolioDetail = () => {
  let { id } = useParams();
  const userNum = Number(localStorage.getItem("userId"));
  const [isHeart, setIsHeart] = useState<boolean>(false);
  const [type, setType] = useState("일러스트");
  const [click, setClick] = useState(false);
  const [artistId, setArtistId] = useState(0);
  const navigate = useNavigate();
  const { data: Info } = useQuery("getInfo", () => getPortfolioId(Number(id)), {
    onSuccess: data => {
      console.log(data);
      setArtistId(data.data.user);
    },
  });
  const tagInfo = Info?.data.portfolioTags ?? [];
  const imgInfo = Info?.data.portfolioImgList ?? [];
  const ArtistId = Info?.data.user;

  const { data: User } = useQuery("getUserId", () => getUserInfo(ArtistId), {
    enabled: !!artistId,
  });

  const ImgURL =
    User?.data.imageUrl[0] === "h"
      ? User?.data.imageUrl
      : `https://api.pppick.store/${User?.data.imageUrl}`;

  const { data, refetch } = useQuery("getFavorites", () =>
    getFavorites(userNum)
  );
  const favoritesData = data?.data ?? [{}];

  const queryClient = useQueryClient();
  const { mutate: favorites } = useMutation(postFavorites, {
    onSuccess: data => {
      queryClient.invalidateQueries("postFavorites");
      console.log(data, "좋아요");
      if (data.msg === "Success") {
      }
    },
    onError: error => {
      console.log(error, "좋아요에러");
    },
  });

  const { mutate: cancleFavorites } = useMutation(patchFavorites, {
    onSuccess: data => {
      queryClient.invalidateQueries("patchFavorites");
      console.log(data, "좋아요취소");
      if (data.msg === "Success") {
      }
    },
    onError: error => {
      console.log(error, "좋아요취소에러");
    },
  });

  //   useEffect(() => {
  //     console.log(User?.data.name);
  //     UserRefetch();
  //   }, [Info?.data.user]);

  let heartArr: number[] = [];
  useEffect(() => {
    favoritesData.map((v: any) => {
      if (!heartArr.includes(v.portfolioNum)) {
        heartArr.push(v.portfolioNum);
      }
    });
    getFav();
  }, [favoritesData]);

  const getFav = () => {
    if (heartArr.includes(Number(id))) {
      setIsHeart(true);
    } else {
      setIsHeart(false);
    }
  };

  useEffect(() => {
    refetch();
    if (isHeart && click) {
      favorites({
        portfolioNum: Number(id),
        userNum,
      });
    } else if (!isHeart && click) {
      cancleFavorites({
        portfolioNum: Number(id),
        userNum,
      });
    }
    setClick(false);
  }, [isHeart, click]);

  useEffect(() => {
    console.log(Info);
    if (Info?.data.portfolioType === 1) {
      setType("일러스트");
    } else if (Info?.data.portfolioType === 2) {
      setType("캐리커쳐");
    } else if (Info?.data.portfolioType === 3) {
      setType("웹툰 . 콘티");
    } else if (Info?.data.portfolioType === 4) {
      setType("캐릭터");
    } else if (Info?.data.portfolioType === 5) {
      setType("이모티콘");
    }
  }, [Info]);

  const heartItem = (item: any) => {
    item.stopPropagation();
    setClick(true);
    setIsHeart(!isHeart);
    // setHeartList(heartList => [...heartList, item.portfolioNum])
  };

  const toastProps_1 = {
    title: "문의하기",
    content:
      "디자인을 의뢰하고 싶으시면 문의하기 버튼을 클릭하여 문의해 주세요",
    top_pos: -50,
    right_pos: 30,
    start_time: 500,
  };
  const toastProps_2 = {
    title: "작가페이지",
    content:
      "더 다양한 포트폴리오와 상품을 확인하고 싶으시다면 작가 이름을 클릭해 주세요",
    top_pos: -50,
    right_pos: 30,
    start_time: 5000,
  };

  return (
    <PageStyle>
      {User === undefined || Info === undefined ? (
        <Spinner />
      ) : (
        <>
          <div className="images-container">
            <ImageSwiper data={imgInfo} />
          </div>
          <div className="bottom-section">
            <div className="modal-info">
              <div className="modal-info-top">
                <div className="modal-info-type">{type}</div>
                <div className="item-heart" onClick={item => heartItem(item)}>
                  {isHeart ? <HeartFilled /> : <Heart />}
                </div>
              </div>
              <div className="modal-info-title">{Info?.data.portfolioName}</div>
              <div className="modal-info-tags">
                {tagInfo.map((item: any) => (
                  <ModalTag key={item.tag.tagNum} tag={item.tag.tagName} />
                ))}
              </div>
            </div>
            <div className="middle-section">
              <Toast props={toastProps_2} />
              <Toast props={toastProps_1} />
            </div>
            <div className="right-section">
              <div
                onClick={() => {
                  navigate(`/artist/${artistId}`);
                }}
                className="artist-section"
              >
                <div className="artist-img">
                  {User?.data.imageUrl ? (
                    <img src={ImgURL} alt="" />
                  ) : (
                    <Profile width="45px" height="45px" />
                  )}
                </div>
                <div className="arist-info">
                  <div className="artist-info-name">{User?.data?.name}</div>
                </div>
              </div>
              <CommonYellowButton
                onClick={() => {
                  navigate(`/board/${artistId}`);
                }}
                text={"작가에게 문의하기"}
                width={269}
                height={52}
                hover={true}
              />
            </div>
          </div>
        </>
      )}
    </PageStyle>
  );
};

export default PortfolioDetail;

const PageStyle = styled.div`
  padding: 135px 0px 40px 0px;
  color: ${colors.text};
  .images-container {
    height: 450px;
    display: flex;
    overflow: hidden;
  }

  .middle-section {
    position: relative;
    width: 100%;
    height: 100%;
  }

  .bottom-section {
    width: 1200px;
    margin: 0 auto;
    margin-top: 50px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    background: ${colors.bgcolor};
    padding: 20px;
    border-radius: 8px;
  }

  .artist-section {
    display: flex;
    // justify-content: center;
    align-items: center;
    margin-bottom: 20px;
    margin-left: 10px;
    cursor: pointer;
  }

  .artist-img {
    width: 45px;
    height: 45px;
    border-radius: 50%;
    background: gray;
    margin-right: 20px;

    img {
      width: 100%;
      height: 100%;
      border-radius: 50%;
    }
  }

  .artist-info {
    text-align: center;
  }

  .artist-info-name {
    font-size: 18px;
  }

  /* .inquiry-button {
    color: ${colors.text};
    background-color: ${colors.button};
    padding: 1px 6px;
    width: 269px;
    height: 52px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 7px;
    font-weight: bold;
    font-size: 16px;
    filter: drop-shadow(0 0 3px rgba(0, 0, 0, 0.3));
    cursor: pointer;
    transition: 0.2s all ease-out;
  }
  .inquiry-button:hover {
    filter: brightness(90%);
  } */

  .modal-info {
    .modal-info-top {
      width: 300px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      position: relative;
    }
    .modal-info-type {
      color: rgb(114, 117, 133);
      margin: 0px;
      font-weight: normal;
      font-size: 14px;
    }
    .modal-info-title {
      margin-top: 8px;
      font-size: 20px;
      line-height: 31px;
      font-weight: 700;
      color: rgb(48, 52, 65);
    }
    .item-heart {
      position: absolute;
      top: 0px;
      right: 30px;
      transition: 0.2s all ease-out;
      // background: red;
      cursor: pointer;
      color: black;
    }

    .item-heart:hover {
      transform: scale(1.1);
    }
    .modal-info-tags {
      margin: 24px 0px 0px;
      font-weight: normal;
      display: flex;
      gap: 8px;
      flex-wrap: wrap;
      padding: 14px 24px 0 0;
    }
  }
`;
