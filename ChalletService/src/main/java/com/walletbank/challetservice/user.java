package com.walletbank.challetservice;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;

@Entity
public class user {

    @Id
    private Long id;
    private Integer age;
}
