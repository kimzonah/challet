package com.challet.challetservice.domain.entity;

import io.swagger.v3.oas.annotations.media.Schema;
import java.time.LocalDate;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.elasticsearch.annotations.DateFormat;
import org.springframework.data.elasticsearch.annotations.Document;
import org.springframework.data.elasticsearch.annotations.Field;
import org.springframework.data.elasticsearch.annotations.FieldType;

@Getter
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Document(indexName = "challenges")
@Schema(description = "챌린지 검색")
public class SearchedChallenge {

    @Id
    @Schema(description = "챌린지ID")
    private String challengeId;

    @Field(type = FieldType.Keyword)
    @Schema(description = "챌린지 진행 상태", allowableValues = {"RECRUITING", "PROGRESSING", "END"})
    private String status;

    @Field(type = FieldType.Keyword)
    @Schema(description = "챌린지 카테고리", allowableValues = {"DELIVERY", "TRANSPORT", "COFFEE", "SHOPPING"})
    private String category;

    @Field(type = FieldType.Text)
    @Schema(description = "챌린지 제목")
    private String title;

    @Schema(description = "챌린지 소비한도")
    private Long spendingLimit;

    @Field(type = FieldType.Date, format = DateFormat.date, pattern = "yyyy-MM-dd")
    @Schema(description = "챌린지 시작날짜")
    private LocalDate startDate;

    @Field(type = FieldType.Date, format = DateFormat.date, pattern = "yyyy-MM-dd")
    @Schema(description = "챌린지 마감날짜")
    private LocalDate endDate;

    @Schema(description = "참여 가능 인원")
    private Integer maxParticipants;

    @Schema(description = "현재 참여 인원")
    private Integer currentParticipants;

    @Schema(description = "공개 여부 (비공개 : false, 공개 : true)")
    private Boolean isPublic;

    public static SearchedChallenge fromChallenge(Challenge challenge) {
        return SearchedChallenge.builder()
            .challengeId(String.valueOf(challenge.getId()))
            .status(challenge.getStatus().toString())
            .category(challenge.getCategory().toString())
            .title(challenge.getTitle())
            .spendingLimit(challenge.getSpendingLimit())
            .startDate(challenge.getStartDate())
            .endDate(challenge.getEndDate())
            .maxParticipants(challenge.getMaxParticipants())
            .currentParticipants(1)
            .isPublic(challenge.getInviteCode() == null)
            .build();
    }
}
