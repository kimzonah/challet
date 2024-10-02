package com.challet.bankservice.domain.dto.response;

import io.swagger.v3.oas.annotations.media.Schema;
import java.util.List;
import lombok.Builder;

@Builder
@Schema(description = "카테고리별 합계")
public record CategoryPercentageResponseListDTO(
    
    @Schema(description = "카테고리 리스트")
    List<CategoryPercentageResponseDTO> categoryList
){
    public static CategoryPercentageResponseListDTO fromCategoryList(List<CategoryPercentageResponseDTO> categoryList){
        return CategoryPercentageResponseListDTO
            .builder()
            .categoryList(categoryList)
            .build();
    }
}
