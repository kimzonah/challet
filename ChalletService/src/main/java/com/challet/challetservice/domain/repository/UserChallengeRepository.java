package com.challet.challetservice.domain.repository;

import com.challet.challetservice.domain.entity.Challenge;
import com.challet.challetservice.domain.entity.User;
import com.challet.challetservice.domain.entity.UserChallenge;
import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface UserChallengeRepository extends JpaRepository<UserChallenge, Long> {

    Boolean existsByChallengeAndUser(Challenge challenge, User user);

    UserChallenge findByChallengeAndUser(Challenge challenge, User user);

}
