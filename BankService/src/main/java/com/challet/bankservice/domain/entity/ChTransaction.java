package com.challet.bankservice.domain.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
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
@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "ch_transaction")
public class ChTransaction {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "ch_account_id", nullable = false)
    private ChAccount chAccount;

    @Column(name = "transaction_amount", nullable = false)
    private Long transactionAmount;

    @Column(name = "transaction_datetime", nullable = false, columnDefinition = "TIMESTAMP")
    private LocalDateTime transactionDatetime;

    @Column(name = "deposit", nullable = false)
    private String deposit;

    @Column(name = "withdrawal", nullable = false)
    private String withdrawal;

    @Column(name = "transaction_balance", nullable = false)
    private Long transactionBalance;

    @Enumerated(EnumType.STRING)
    private Category category;


    public void assignTransactionChAccount(ChAccount chAccount) {
        this.chAccount = chAccount;
    }
}
