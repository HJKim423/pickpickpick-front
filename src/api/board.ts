import api from "./api";

// 작가별 문의게시판의 게시글 목록 조회

interface BoardList {
    result : boolean,
    msg : string,
    code : string,
    errorMsg : string,
    data : BoardListElement[]
}

interface BoardListElement {
    postNum : number,
    userName : string,
    postTitle : string,
}

export const getBoardList = async (userNumber:number) => {
    const response = await api.get<BoardList>(`board/${userNumber}/post`)
    .then(
        res => res.data.data
    )
    return response
}


//------------------------------------------

interface BoardPost{
    postBoardNum : number,
    files : []
    postContent : string, 
    postPwd : string,
    postTitle : string,
    userNum : number,
}

export const handleSubmitBoard = async( params : BoardPost ) => {   // 작가별 문의게시판에 게시물 등록
    const { postBoardNum, files, postContent, postPwd, postTitle, userNum } = params;
    const response = await api.post<BoardPost>(`board/${postBoardNum}/post`, {
        postBoardNum, 
        files, 
        postContent, 
        postPwd, 
        postTitle, 
        userNum
    },{
        headers: {
            "Content-Type": "multipart/form-data",
          },
    })

    return response.data;
}
