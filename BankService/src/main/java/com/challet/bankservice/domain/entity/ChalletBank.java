package com.challet.bankservice.domain.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;

@Entity
@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "ch_bank")
public class ChalletBank {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "account_number", nullable = false, unique = true)
    private String accountNumber;

    @Column(name = "account_balance", nullable = false)
    private Long accountBalance;

    @Column(name = "create_date_time", nullable = false, columnDefinition = "DATETIME")
    @CreationTimestamp
    private LocalDateTime createDateTime;

    @Column(name = "phone_number", nullable = false)
    private String phoneNumber;

    @OneToMany(mappedBy = "challetBank")
    private List<ChalletTransaction> challetTransactions = new ArrayList<>();

    // 거래 발생시 처리
    public void addTransaction(ChalletTransaction challetTransaction) {
        this.challetTransactions.add(challetTransaction);
        challetTransaction.assignTransactionChAccount(this);
    }

    public static ChalletBank createAccount(String phoneNumber, String accountNumber) {
        return ChalletBank.builder()
            .phoneNumber(phoneNumber)
            .accountNumber(accountNumber)
            .accountBalance(0L)
            .build();
    }
}
