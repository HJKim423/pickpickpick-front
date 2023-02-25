import styled from "styled-components";
import { PageStyled } from "../../assets/pageStyle";
import { BigText, SmallText } from "../../assets/CommonStyled";
import { useLocation, useParams } from "react-router";
import CommonYellowButton from "../../components/Common/Button";
import { useMutation, useQuery } from "react-query";
import { getProductData } from "../../api/product";
import { RequestPayResponse, RequestPayParams } from "../../api/import";
import { postOrder, paymentVerify, getOrderStatus } from "../../api/order";
import { getUserInfo } from "../../api/user";
import { useEffect, useState } from 'react';
const OrderPageStyle = styled(PageStyled)`

    .OrderButtonWrapper{
        width : 100%;
        display: flex;
        justify-content: end;
    }
`

const OrderBoxContainer = styled.div`
    width : 70%;
    height : 400px;
    border : 1px solid rgb(228, 229, 237);
    margin : 0 auto;
    margin-top : 50px;
    padding : 40px;
`

const OrderInfoContainer = styled.div`
    display: flex;
    flex-direction : row;
    margin-top : 10px;
`

const OrderImgBox = styled.img`
    width : 200px;
    height : 200px;
`

const OrderTextContainer = styled.div`
    display : flex;
    flex-direction: column;
    margin-left : 15px;
`

const DivideLine = styled.div`
    
    height: 1px;
    width : 100%;
    margin : 0 auto;
    margin : 30px 0;
    background-color: rgb(228, 229, 237);
`
const OrderPriceContainer = styled.div`
    display: flex;
    flex-direction : column;
    margin-right : auto;

    .text-container{
        display : flex;
        flex-direction : row;
        width : 200px;
    }
`


interface OrderStatusParams{
    merchantUid : string,
    orderStatus : string,
}

const OrderPage = () => {

    const { state } = useLocation();
    const { id } = useParams();
    const { data : productInfo } = useQuery('getProduct', () => getProductData(Number(id)));
    const { data : User } = useQuery("getUser", () => getUserInfo(Number(localStorage.getItem('userId'))));
    let merchantUid : string = ''   // useState -> 값을 즉시 변동 못해서 전역 변수로 설정함. 리팩토링 필요
    let imp_uid : string = '';
    let orderStatus : string = '';
    const product = productInfo?.data.workInfo
    const product_img = product?.workImages.length! > 0 ? `http://ec2-15-164-113-99.ap-northeast-2.compute.amazonaws.com:8080/${product?.workImages[0].workImgSrcPath}` : 'https://ibb.co/2hz8Jgr'
    

    const { mutate : handlePostOrder } = useMutation(postOrder, {   // 상품등록 api
        onSuccess : data => {
            console.log(data);
            merchantUid = data.data.merchant_uid;
            console.log(merchantUid, data.data.merchant_uid);
            console.log('상품등록api');
        },
        onError : data => {
            console.log(data);
        },
    })
    
    const { data : getOrder} = useQuery(['getOrderStatus', orderStatus], () => getOrderStatus(     //  orders/status/
        {
            orderStatus,
            merchantUid
        }
    ), {
        enabled : !!orderStatus
    })

    console.log(getOrder, orderStatus);

    const { mutate : handlePaymentVerify } = useMutation(paymentVerify, {
        onSuccess : data => {
            console.log(data);
            orderStatus = data.data.payment.paymentStatus;  // 결제 상태 "COMPLETE" or "CANCEL"
            
        },
        onError : data => {
            console.log(data);
        }
    })

    const onClickPayment = () => {
        if (!window.IMP) return;
        /* 1. 가맹점 식별하기 */
        const { IMP } = window;
        IMP.init("imp05604134"); // 가맹점 식별코드
        


        handlePostOrder({   // 상품 주문 API
            orderCount : state,
            orderPrice : Number(product?.workPrice),
            userNum : Number(localStorage.getItem('userId')),
            workNum : Number(id),
        })
        
        /* 2. 결제 데이터 정의하기 */
        const data: RequestPayParams = {
          pg: "html5_inicis", // PG사 : https://portone.gitbook.io/docs/sdk/javascript-sdk/payrq#undefined-1 참고
          pay_method: "card", // 결제수단
          merchant_uid: merchantUid, // 주문번호
          amount: Number(product?.workPrice! * state), // 결제금액
          name: product?.workName, // 주문명
          buyer_name: User?.data.name, // 구매자 이름
          buyer_tel: User?.data.phone!, // 구매자 전화번호
          buyer_email: User?.data.email, // 구매자 이메일
          buyer_addr: "", // 구매자 주소
          buyer_postcode: "", // 구매자 우편번호
        };
        console.log(data);
        
        /* 4. 결제 창 호출하기 */
        IMP.request_pay(data, callback);
      };
    
      /* 3. 콜백 함수 정의하기 */
      function callback(response: RequestPayResponse) {
        const { success, error_msg } = response;
    
        if (success) {
          console.log(response);
          imp_uid = response.imp_uid!;
            
          handlePaymentVerify({     // payment/verify API
            merchantUid,
            imp_uid,
          })

        } else {
          alert(`결제 실패: ${error_msg}`);
          orderStatus = "CANCEL";

        }
      }

    return (
        
        <OrderPageStyle>
            {
                product === undefined ? <div>loading</div>
                :
            <>
                <BigText>결제하기</BigText>
                <OrderBoxContainer>
                    <SmallText>주문 내역</SmallText>
                    <OrderInfoContainer>
                        <OrderInfoContainer>
                            <OrderImgBox src={product_img}/>
                            <OrderTextContainer>
                                <h2 style={{marginBottom:"15px", fontWeight:"bold"}}>{product.workDesc}</h2>
                                <h3>{product.workName}</h3>
                            </OrderTextContainer>
                        </OrderInfoContainer>
                    </OrderInfoContainer>
                    <DivideLine/>
                    <OrderPriceContainer>
                        <div className="text-container">
                            <BigText>수량 : </BigText>
                            <BigText>{state}개</BigText>
                        </div>
                        <div className="text-container">
                            <BigText>총 결제금액 : </BigText>
                            <BigText>{product.workPrice! * state}원</BigText>
                        </div>
                    </OrderPriceContainer>
                    <div className="OrderButtonWrapper">
                        <CommonYellowButton onClick={()=>{onClickPayment()}} width={200} height={50} hover={false} text={"결제하기"}/>
                    </div>
                </OrderBoxContainer>
            </>
            }
        </OrderPageStyle>
    )
}

export default OrderPage;