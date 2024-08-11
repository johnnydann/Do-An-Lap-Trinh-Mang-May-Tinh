package com.example.SpeedTest.model;

public class SpeedTestResult {
    private double downloadSpeed;
    private double uploadSpeed;
    private double ping; // Sử dụng double cho ping

    public SpeedTestResult(double downloadSpeed, double uploadSpeed, double ping) {
        this.downloadSpeed = downloadSpeed;
        this.uploadSpeed = uploadSpeed;
        this.ping = ping;
    }

    public double getDownloadSpeed() {
        return downloadSpeed;
    }

    public void setDownloadSpeed(double downloadSpeed) {
        this.downloadSpeed = downloadSpeed;
    }

    public double getUploadSpeed() {
        return uploadSpeed;
    }

    public void setUploadSpeed(double uploadSpeed) {
        this.uploadSpeed = uploadSpeed;
    }

    public double getPing() {
        return ping;
    }

    public void setPing(double ping) {
        this.ping = ping;
    }
}
