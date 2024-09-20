package com.challet.shbankservice.domain.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
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
@Table(name = "sh_bank")
public class ShBank {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "account_number", nullable = false, unique = true)
    private String accountNumber;

    @Column(name = "account_balance", nullable = false)
    private Long accountBalance;

    @Column(name = "create_date_time", nullable = false, columnDefinition = "DATETIME")
    private LocalDateTime createDateTime;

    @Column(name = "phone_number", nullable = false)
    private String phoneNumber;

    @Column(name = "mydata_status", nullable = false)
    private boolean myDataStatus;
}
