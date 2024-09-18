package com.challet.bankservice.domain.repository;

import com.challet.bankservice.domain.entity.ChalletBank;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

public interface ChalletBankRepository extends JpaRepository<ChalletBank, Long>,
    ChalletBankRepositoryCustom {

    @Query("SELECT ch.accountBalance FROM ChalletBank ch WHERE ch.id = :accountId")
    Optional<Long> findAccountBalanceById(Long accountId);
}
