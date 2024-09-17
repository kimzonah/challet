package com.challet.bankservice.domain.repository;

import com.challet.bankservice.domain.entity.ChBank;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ChalletBankRepository extends JpaRepository<ChBank, Long> {

}
