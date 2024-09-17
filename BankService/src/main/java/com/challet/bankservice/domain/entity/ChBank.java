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
public class ChBank {

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

    @OneToMany(mappedBy = "chBank")
    private List<ChTransaction> chTransactions = new ArrayList<>();

    // 거래 발생시 처리
    public void addTransaction(ChTransaction chTransaction) {
        this.chTransactions.add(chTransaction);
        chTransaction.assignTransactionChAccount(this);
    }

    public static ChBank createAccount(String phoneNumber, String accountNumber) {
        return ChBank.builder()
            .phoneNumber(phoneNumber)
            .accountNumber(accountNumber)
            .accountBalance(0L)
            .build();
    }
}
