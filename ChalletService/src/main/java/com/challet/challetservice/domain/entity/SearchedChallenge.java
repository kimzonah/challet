package com.challet.challetservice.domain.entity;

import io.swagger.v3.oas.annotations.media.Schema;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.util.Date;
import lombok.Builder;
import org.springframework.data.annotation.Id;
import org.springframework.data.elasticsearch.annotations.Document;
import org.springframework.data.elasticsearch.annotations.Field;
import org.springframework.data.elasticsearch.annotations.FieldType;

@Builder
@Document(indexName = "challenges")  // Elasticsearch에 저장될 인덱스명 설정
@Schema(description = "챌린지 검색")
public record SearchedChallenge(

    @Id
    @Field(type = FieldType.Long)  // Long 타입으로 매핑
    @Schema(description = "챌린지ID")
    String challengeId,

    @Field(type = FieldType.Keyword)  // 정확한 값 일치를 위해 Keyword 타입으로 매핑
    @Schema(description = "챌린지 진행 상태", allowableValues = {"RECRUITING", "PROGRESSING", "END"})
    String status,

    @Field(type = FieldType.Keyword)  // Keyword 타입으로 매핑 (category는 분석하지 않음)
    @Schema(description = "챌린지 카테고리", allowableValues = {"DELIVERY", "TRANSPORT", "COFFEE", "SHOPPING"})
    String category,

    @Field(type = FieldType.Text)  // Text 타입으로 매핑 (title은 분석)
    @Schema(description = "챌린지 제목")
    String title,

    @Field(type = FieldType.Long)  // Long 타입으로 매핑
    @Schema(description = "챌린지 소비한도")
    Long spendingLimit,

    @Field(type = FieldType.Date, format = {}, pattern = "yyyy-MM-dd")  // Date 타입으로 매핑
    @Schema(description = "챌린지 시작날짜")
    Date startDate,

    @Field(type = FieldType.Date, format = {}, pattern = "yyyy-MM-dd")  // Date 타입으로 매핑
    @Schema(description = "챌린지 마감날짜")
    Date endDate,

    @Field(type = FieldType.Integer)  // Integer 타입으로 매핑
    @Schema(description = "참여 가능 인원")
    Integer maxParticipants,

    @Field(type = FieldType.Integer)  // Integer 타입으로 매핑
    @Schema(description = "현재 참여 인원")
    Integer currentParticipants,

    @Field(type = FieldType.Boolean)  // Boolean 타입으로 매핑
    @Schema(description = "공개 여부 (비공개 : false, 공개 : true)")
    Boolean isPublic
) {

    public static SearchedChallenge fromChallenge(Challenge challenge) {
        return SearchedChallenge.builder()
            .challengeId(String.valueOf(challenge.getId()))
            .status(challenge.getStatus().toString())
            .category(challenge.getCategory().toString())
            .title(challenge.getTitle())
            .spendingLimit(challenge.getSpendingLimit())
            .startDate(convertToDate(challenge.getStartDate().atStartOfDay()))
            .endDate(convertToDate(challenge.getEndDate().atStartOfDay()))
            .maxParticipants(challenge.getMaxParticipants())
            .currentParticipants(1)
            .isPublic(challenge.getInviteCode() == null)
            .build();
    }

    public static Date convertToDate(LocalDateTime localDateTime) {
        return Date.from(localDateTime.atZone(ZoneId.systemDefault()).toInstant());
    }
}
