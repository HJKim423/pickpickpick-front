import { stringify } from "rc-field-form/es/useWatch";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { useMutation, useQueryClient } from "react-query";
import { useNavigate } from "react-router";
import styled from "styled-components";
import { postPortfolio } from "../../api/portfolio";
import colors from "../../assets/colors";

const PostPortfolio = () => {
  const navigate = useNavigate();
  const [checkedType, setCheckedType] = useState<string>("illust");
  const [checkedTypeNum, setCheckedTypeNum] = useState<number>(1);
  const [portfolioName, setPortfolioName] = useState<string>("");
  const [imgView, setImgView] = useState([]);
  const [tag, setTag] = useState<string>("");
  const [tagArr, setTagArr] = useState<string[]>([]);
  const [tagName, setTagName] = useState("");
  const imgRef = useRef<any>();
  const tagRef = useRef<any>();
  const [files, setFiles] = useState<File[]>([]);

  const userId = localStorage.getItem("userId") ?? 0;
  const portfolioDate = new Date().toString();

  const queryClient = useQueryClient();
  const { mutate: posting } = useMutation(postPortfolio, {
    onSuccess: data => {
      queryClient.invalidateQueries("postPortfolio");
      if (data.msg === "Success") {
        navigate("/");
      }
    },
    onError: error => {
      console.log(error, "포스팅에러");
    },
  });

  const onUploadImage = () => {
    setFiles([...files, imgRef.current.files[0]]);
  };

  const onClickRadio = (type: string, typeNum: number) => {
    setCheckedType(type);
    setCheckedTypeNum(typeNum);
  };

  const onChangeName = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPortfolioName(e.target.value);
  };

  const onChangeTag = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTag(e.target.value);
  };

  const addTag = (tag: string) => {
    if (tagArr.includes(tag)) return;
    setTagArr(tagArr => [...tagArr, tag]);
  };

  const deleteTag = (e: React.MouseEvent<HTMLDivElement>) => {
    const eventTarget = e.target as HTMLElement;
    const newTagArr = tagArr.filter(v => v !== eventTarget.outerText);
    setTagArr(newTagArr);
  };

  useEffect(() => {
    setTagName("#" + tagArr.join(" #"));
  }, [tagArr]);

  const handlePost = () => {
    posting({
      files: files,
      portfolioDate,
      portfolioName,
      portfolioType: checkedTypeNum.toString(),
      tagName,
      userNum: +userId,
    });
  };

  return (
    <PageStyle type={checkedType}>
      <div className="title">내 포트폴리오 등록하기</div>
      <div className="name">
        <div className="subtitle">포트폴리오 이름</div>
        <input
          className="input-name"
          placeholder="포트폴리오 이름을 입력하세요."
          value={portfolioName}
          onChange={onChangeName}
        />
      </div>
      <div className="type">
        <div className="subtitle">포트폴리오 타입</div>
        <div className="type-container" onChange={e => console.log(e.target)}>
          <div className="type-item" onClick={() => onClickRadio("illust", 1)}>
            <div className="radio" id="illust" />
            <label htmlFor="illust">일러스트</label>
          </div>
          <div
            className="type-item"
            onClick={() => onClickRadio("caricature", 2)}
          >
            <div className="radio" id="caricature" />
            <label htmlFor="caricature">캐리커쳐</label>
          </div>
          <div className="type-item" onClick={() => onClickRadio("webtoon", 3)}>
            <div className="radio" id="webtoon" />
            <label htmlFor="webtoon">웹툰·콘티</label>
          </div>
          <div
            className="type-item"
            onClick={() => onClickRadio("character", 4)}
          >
            <div className="radio" id="character" />
            <label htmlFor="character">캐릭터</label>
          </div>
          <div
            className="type-item"
            onClick={() => onClickRadio("emoticon", 5)}
          >
            <div className="radio" id="emoticon" />
            <label htmlFor="emoticon">이모티콘</label>
          </div>
        </div>
      </div>
      <div className="tags">
        <div className="subtitle">포트폴리오 태그</div>
        <div className="tag-container">
          {tagArr.map((item, index) => (
            <div key={index} className="tag" onClick={deleteTag}>
              {item}
            </div>
          ))}
          <input
            ref={tagRef}
            className="input-tag"
            placeholder="태그를 입력하고 엔터를 누르세요."
            value={tag}
            onChange={onChangeTag}
            onKeyPress={e => {
              if (e.key === "Enter") {
                addTag(tag);
                setTag("");
              }
            }}
          />
        </div>
      </div>
      <div className="upload">
        <div className="subtitle">포트폴리오 업로드</div>

        {imgView.map((img, index) => (
          <img className="upload-img" src={img} alt="" key={index} />
        ))}
        <label htmlFor="file">
          <div className="input-upload">파일 업로드하기</div>
        </label>
        <input
          ref={imgRef}
          type="file"
          id="file"
          className="input-upload"
          onChange={onUploadImage}
          multiple
        />
        <ul>
          {files.map(file => (
            <li key={file.name}>{file.name}</li>
          ))}
        </ul>
      </div>
      <div className="post">
        <div className="post-button" onClick={handlePost}>
          등록하기
        </div>
      </div>
    </PageStyle>
  );
};

export default PostPortfolio;

const PageStyle = styled.div<{ type: string }>`
  padding: 135px 16px 140px 16px;
  width: 1200px;
  margin: 0 auto;
  color: ${colors.text};

  .title {
    font-weight: bold;
    line-height: 36px;
    font-size: 24px;
    margin-bottom: 24px;
  }

  .name,
  .type,
  .upload,
  .tags {
    padding: 24px;
    border: 1px solid #e4e5ed;
    margin-bottom: 24px;
    display: flex;
    flex-direction: column;
  }

  .input-name,
  .input-tag {
    width: 500px;
    height: 30px;
    padding: 7px 14px;
    border: none;
    border-bottom: 1px solid #9a9ba7;
  }

  .input-name:focus,
  .input-tag:focus {
    outline: 0;
  }

  .tag-container {
    display: flex;
    flex-wrap: wrap;
  }
  .input-tag {
    width: 200px;
    border: none;
  }

  .tag {
    font-size: 16px;
    font-weight: 500;
    align-items: center;
    padding: 8px 16px;
    margin: 0 12px 12px 0;
    border-radius: 1rem;
    background-color: #f8f9fa;
    color: #ffd400;
    cursor: pointer;
  }

  .subtitle {
    font-size: 15px;
    font-weight: bold;
    line-height: 1.5438;
    margin: 0 0 16px 0;
  }

  .post {
    display: flex;
    justify-content: flex-end;

    .post-button {
      color: ${colors.text};
      background-color: ${colors.button};
      padding: 1px 6px;
      width: 179px;
      height: 43px;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 7px;
      font-weight: bold;
      font-size: 16px;
      cursor: pointer;
      transition: 0.2s all ease-out;
    }
    .post-button:hover {
      filter: brightness(90%);
    }
  }

  .type-container {
    margin-top: 12px;
    padding: 16px;
    border: 1px solid rgb(228, 229, 237);
    border-radius: 4px;
    display: flex;
    column-gap: 40px;
  }

  .type-item {
    display: flex;
    align-items: center;

    .radio {
      width: 18px;
      height: 18px;
      border-radius: 50%;
      border: 1px solid #979797;
      margin-right: 5px;
    }
  }

  #${props => props.type} {
    background-color: #ffd400;
    border-color: #ffd400;
  }

  .upload-img {
    width: 500px;
    margin: 14px 0;
  }

  .input-upload {
    margin-bottom: 10px;
    width: 150px;
    height: 30px;
    background: ${colors.button};
    color: #fff;
    border: 1px solid ${colors.button};
    border-radius: 10px;
    font-weight: 500;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  #file {
    display: none;
  }
`;
