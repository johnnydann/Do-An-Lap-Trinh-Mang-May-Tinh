package com.example.SpeedTest.repository;

import com.example.SpeedTest.model.SpeedTestHistory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface SpeedTestHistoryRepository extends JpaRepository<SpeedTestHistory, Long> {

}
