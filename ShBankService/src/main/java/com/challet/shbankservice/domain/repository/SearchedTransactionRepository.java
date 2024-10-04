package com.challet.shbankservice.domain.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.elasticsearch.repository.ElasticsearchRepository;

import com.challet.shbankservice.domain.entity.SearchedTransaction;

public interface SearchedTransactionRepository extends ElasticsearchRepository<SearchedTransaction, String> {

    Page<SearchedTransaction> findByAccountId(Long accountId, Pageable pageable);

    Page<SearchedTransaction> findByAccountIdAndDepositContaining(Long accountId, String deposit,
        Pageable pageable);
}
