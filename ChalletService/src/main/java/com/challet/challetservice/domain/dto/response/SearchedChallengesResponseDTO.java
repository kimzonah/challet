package com.challet.challetservice.domain.dto.response;

import com.challet.challetservice.domain.entity.SearchedChallenge;
import java.util.List;
import lombok.Builder;

@Builder
public record SearchedChallengesResponseDTO(int count, List<SearchedChallenge> searchedChallenges) {

    public static SearchedChallengesResponseDTO fromSearchedChallenges(List<SearchedChallenge> searchedChallenges) {
        return SearchedChallengesResponseDTO.builder()
            .count(searchedChallenges.size())
            .searchedChallenges(searchedChallenges)
            .build();
    }
}
