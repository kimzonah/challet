package com.challet.bankservice.domain.elastic.repository;

import co.elastic.clients.elasticsearch.ElasticsearchClient;
import co.elastic.clients.elasticsearch._types.query_dsl.*;
import co.elastic.clients.elasticsearch.core.SearchResponse;
import co.elastic.clients.elasticsearch.core.search.Hit;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.*;
import org.springframework.stereotype.Repository;

import java.io.IOException;
import java.util.List;
import java.util.stream.Collectors;

import com.challet.bankservice.domain.entity.SearchedTransaction;

@Repository
@RequiredArgsConstructor
public class CustomSearchedTransactionRepositoryImpl implements CustomSearchedTransactionRepository {

	private final ElasticsearchClient elasticsearchClient;

	@Override
	public Page<SearchedTransaction> findByAccountIdAndKeyword(Long accountId, String keyword, Pageable pageable) {
		try {
			// Bool 쿼리 생성
			BoolQuery.Builder boolQueryBuilder = new BoolQuery.Builder()
				.must(mq -> mq.term(t -> t.field("accountId").value(accountId)));

			if (keyword != null && !keyword.isEmpty()) {
				boolQueryBuilder.must(mq -> mq
					.bool(bq -> bq
						.should(sq -> sq.wildcard(wq -> wq.field("deposit").value("*" + keyword + "*")))
						.should(sq -> sq.wildcard(wq -> wq.field("withdrawal").value("*" + keyword + "*")))
					)
				);
			}

			Query query = boolQueryBuilder.build()._toQuery();

			// 검색 요청 생성
			SearchResponse<SearchedTransaction> searchResponse = elasticsearchClient.search(s -> s
					.index("ch_bank_transaction")
					.query(query)
					.from((int) pageable.getOffset())
					.size(pageable.getPageSize()),
				SearchedTransaction.class
			);

			// 검색 결과 처리
			List<SearchedTransaction> content = searchResponse.hits().hits().stream()
				.map(Hit::source)
				.collect(Collectors.toList());

			long total = searchResponse.hits().total() != null ? searchResponse.hits().total().value() : 0;

			return new PageImpl<>(content, pageable, total);

		} catch (IOException e) {
			throw new RuntimeException("Elasticsearch 검색 오류", e);
		}
	}
}

