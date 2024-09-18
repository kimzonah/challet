package com.challet.bankservice.domain.repository;

import com.challet.bankservice.domain.dto.response.AccountInfoResponseListDTO;

public interface ChalletBankRepositoryCustom {

    AccountInfoResponseListDTO findByAccountInfo(String phoneNumber);
}
