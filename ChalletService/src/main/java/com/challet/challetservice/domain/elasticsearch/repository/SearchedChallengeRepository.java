package com.challet.challetservice.domain.elasticsearch.repository;

import com.challet.challetservice.domain.entity.SearchedChallenge;
import org.springframework.data.elasticsearch.repository.ElasticsearchRepository;

public interface SearchedChallengeRepository extends ElasticsearchRepository<SearchedChallenge, Long> {

}
