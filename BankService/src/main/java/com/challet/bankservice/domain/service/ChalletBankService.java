package com.challet.bankservice.domain.service;

import com.challet.bankservice.domain.dto.response.AccountInfoResponseListDTO;

public interface ChalletBankService {

    void createAccount(String phoneNumber);

    AccountInfoResponseListDTO findAccount(String phoneNumber);
}
