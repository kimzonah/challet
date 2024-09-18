package com.challet.challetservice.global.exception;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public enum CustomException {
    NOT_FOUND_USER_EXCEPTION(400, "NotFoundUserException", "유저가 존재하지 않습니다."),
    NOT_FOUND_CHALLENGE_EXCEPTION(400, "NotFoundChallengeException","챌린지가 존재하지 않습니다."),
    USER_ALREADY_EXISTS_EXCEPTION(400, "UserAlreadyExists","이미 가입된 유저입니다."),

    PASSWORD_MISMATCH_EXCEPTION(401, "PasswordMismatchException", "비밀번호가 일치하지 않습니다."),
    INVALID_TOKEN_EXCEPTION(401, "InvalidTokenException","유효하지 않은 토큰입니다.");

    private int statusNumber;
    private String errorCode;
    private String errorMessage;
}