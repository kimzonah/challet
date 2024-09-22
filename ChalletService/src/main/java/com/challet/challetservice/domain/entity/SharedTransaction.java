package com.challet.challetservice.domain.entity;

import com.challet.challetservice.domain.dto.request.SharedTransactionRegisterRequestDTO;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import java.time.LocalDateTime;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Builder
@Getter
@AllArgsConstructor
@NoArgsConstructor
@Table(name = "shared_transaction")
public class SharedTransaction {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_challenge_id", nullable = false)
    private UserChallenge userChallenge;

    @Column(nullable = false)
    private String withdrawal;

    @Column(nullable = false)
    private Long transactionAmount;

    @Column(name = "transaction_datetime", nullable = false, columnDefinition = "DATETIME")
    private LocalDateTime transactionDateTime;

    @Column(name = "content", nullable = true, columnDefinition = "TEXT")
    private String content;

    @Column(name = "image", nullable = true)
    private String image;

    public static SharedTransaction from(SharedTransactionRegisterRequestDTO request, UserChallenge userChallenge) {
        return SharedTransaction.builder()
            .userChallenge(userChallenge)
            .withdrawal(request.withdrawal())
            .transactionAmount(request.transactionAmount())
            .transactionDateTime(LocalDateTime.now())
            .content(request.content())
            .image(request.image())
            .build();
    }

}
