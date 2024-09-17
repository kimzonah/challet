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
@Table(name = "ch_account")
public class ChAccount {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "account_number", nullable = false)
    private String accountNumber;

    @Column(name = "account_balance", nullable = false)
    private Long accountBalance;

    @Column(name = "create_date_time", nullable = false, columnDefinition = "DATETIME")
    @CreationTimestamp
    private LocalDateTime createDateTime;

    @Column(name = "phone_number", nullable = false)
    private String phoneNumber;

    @OneToMany(mappedBy = "chAccount")
    private List<ChTransaction> chTransactions = new ArrayList<>();

    // 거래 발생시 처리
    public void addTransaction(ChTransaction chTransaction) {
        this.chTransactions.add(chTransaction);
        chTransaction.assignTransactionChAccount(this);
    }
}
