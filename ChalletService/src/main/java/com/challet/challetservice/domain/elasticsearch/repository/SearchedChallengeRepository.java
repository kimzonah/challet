package com.challet.challetservice.domain.elasticsearch.repository;

import com.challet.challetservice.domain.entity.SearchedChallenge;
import org.springframework.data.elasticsearch.repository.ElasticsearchRepository;
import java.util.List;

public interface SearchedChallengeRepository extends ElasticsearchRepository<SearchedChallenge, Long> {

    List<SearchedChallenge> findByStatusAndCategoryAndTitleContaining(String status, String category, String title);

    List<SearchedChallenge> findByStatusAndTitleContaining(String status, String title);

    List<SearchedChallenge> findByStatusContaining(String status);
}
