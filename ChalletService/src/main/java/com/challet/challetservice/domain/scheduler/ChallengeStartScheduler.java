package com.challet.challetservice.domain.scheduler;

import com.challet.challetservice.domain.entity.Challenge;
import com.challet.challetservice.domain.repository.ChallengeRepository;
import java.time.LocalDate;
import java.util.List;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

@Component
@RequiredArgsConstructor
@Slf4j
public class ChallengeStartScheduler {

    private final ChallengeRepository challengeRepository;

    @Scheduled(cron = "0 0 0 * * ?")
    @Transactional
    public void startChallenge() {

        List<Challenge> challenges = challengeRepository.getChallengesToStart(LocalDate.now());
        for(Challenge challenge : challenges) {
            challenge.startChallenge();
            log.info("{} Challenge started", challenge.getId());
        }
        challengeRepository.saveAll(challenges);

    }

}
