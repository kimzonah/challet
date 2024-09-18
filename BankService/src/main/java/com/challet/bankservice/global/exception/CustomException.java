package com.challet.bankservice.global.exception;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public enum CustomException {
    NOT_FOUND_USER_EXCEPTION(400,"NotFoundUserException","유저가 존재하지 않습니다."),
    NOT_CREATE_USER_ACCOUNT_EXCEPTION(400, "NotCreateUserAccountException", "계좌 생성 실패."),
    NOT_FOUND_USER_ACCOUNT_EXCEPTION(400, "NotFoundUserAccountException", "챌렛 계좌가 존재하지 않습니다."),
    NOT_FOUND_TRANSACTION_DETAIL_EXCEPTION(400, "NotFoundTransactionDetailException", "거래내역이 존재하지 않습니다."),
    NOT_GET_TRANSACTION_DETAIL_EXCEPTION(400, "NotGetTransactionDetailException", "잘못된 거래내역 입니다.(동일한 거래내역 2개이상)");

    private int statusNum;
    private String errorCode;
    private String errorMessage;
}