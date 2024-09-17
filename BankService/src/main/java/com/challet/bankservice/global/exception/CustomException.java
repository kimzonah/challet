package com.challet.bankservice.global.exception;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public enum CustomException {
    NOT_FOUND_USER_EXCEPTION(400,"NotFoundUserException","유저가 존재하지 않습니다."),
    NOT_CREATE_USER_ACCOUNT_EXCEPTION(400, "NotCreateUserAccountException", "계좌 생성 실패");

    private int statusNum;
    private String errorCode;
    private String errorMessage;
}