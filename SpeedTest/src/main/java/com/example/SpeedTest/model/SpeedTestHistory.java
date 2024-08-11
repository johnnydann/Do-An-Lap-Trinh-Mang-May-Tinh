package com.example.SpeedTest.model;


import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import lombok.Getter;

import java.time.LocalDateTime;

@Getter
@Entity
public class SpeedTestHistory {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private double downloadSpeed;
    private double uploadSpeed;
    private double ping;

    private LocalDateTime timestamp;

    public SpeedTestHistory() {
    }

    public SpeedTestHistory(double downloadSpeed, double uploadSpeed, double ping, LocalDateTime timestamp) {
        this.downloadSpeed = downloadSpeed;
        this.uploadSpeed = uploadSpeed;
        this.ping = ping;
        this.timestamp = timestamp;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public void setDownloadSpeed(double downloadSpeed) {
        this.downloadSpeed = downloadSpeed;
    }

    public void setUploadSpeed(double uploadSpeed) {
        this.uploadSpeed = uploadSpeed;
    }

    public void setPing(double ping) {
        this.ping = ping;
    }

    public void setTimestamp(LocalDateTime timestamp) {
        this.timestamp = timestamp;
    }
}
