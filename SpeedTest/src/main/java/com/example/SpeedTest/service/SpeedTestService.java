package com.example.SpeedTest.service;

import com.example.SpeedTest.model.SpeedTestHistory;
import com.example.SpeedTest.model.SpeedTestResult;
import org.springframework.stereotype.Service;

import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.time.LocalDateTime;

@Service
public class SpeedTestService {

    public SpeedTestResult performSpeedTest() {
        try {
            // Chạy lệnh speedtest-cli và lấy kết quả
            ProcessBuilder pb = new ProcessBuilder("speedtest-cli", "--simple");
            Process process = pb.start();
            BufferedReader reader = new BufferedReader(new InputStreamReader(process.getInputStream()));
            String line;
            double downloadSpeed = 0;
            double uploadSpeed = 0;
            double ping = 0; // Sử dụng double để có thể xử lý cả số thực

            // Đọc kết quả từ speedtest-cli
            while ((line = reader.readLine()) != null) {
                if (line.startsWith("Download:")) {
                    downloadSpeed = Double.parseDouble(line.split(" ")[1]); // Lấy giá trị Mbps
                } else if (line.startsWith("Upload:")) {
                    uploadSpeed = Double.parseDouble(line.split(" ")[1]); // Lấy giá trị Mbps
                } else if (line.startsWith("Ping:")) {
                    ping = Double.parseDouble(line.split(" ")[1]); // Lấy giá trị ms
                }
            }
            // Lưu kết quả vào lịch sử
            //SpeedTestHistory history = new SpeedTestHistory(downloadSpeed, uploadSpeed, ping, LocalDateTime.now());
            //historyRepository.save(history);
            return new SpeedTestResult(downloadSpeed, uploadSpeed, ping);
        } catch (Exception e) {
            e.printStackTrace();
            return new SpeedTestResult(0, 0, 0); // Trả về kết quả mặc định khi có lỗi
        }
    }
}
