package com.challet.bankservice.domain.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.challet.bankservice.domain.entity.ChalletBankTransaction;
import com.challet.bankservice.domain.entity.SearchedTransaction;

public interface ChalletBankTransactionRepository extends JpaRepository<ChalletBankTransaction, Long> {
}
