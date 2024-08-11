package com.example.SpeedTest.controller;

import com.example.SpeedTest.model.SpeedTestHistory;
import com.example.SpeedTest.model.SpeedTestResult;
import com.example.SpeedTest.repository.SpeedTestHistoryRepository;
import com.example.SpeedTest.service.SpeedTestService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.servlet.view.RedirectView;

import java.util.List;

@Controller
public class SpeedTestController {

    @Autowired
    private SpeedTestService speedTestService;

    @Autowired
    private SpeedTestHistoryRepository historyRepository;

    @GetMapping("/")
    public RedirectView redirectToSpeedTest() {
        return new RedirectView("/speedtest/index");
    }

    @GetMapping("/speedtest/index")
    public String speedTestIndex() {
        return "speedtest/index"; // Đảm bảo rằng tệp này tồn tại trong thư mục views
    }

    @GetMapping("/speedtest")
    @ResponseBody
    public SpeedTestResult performSpeedTest() {
        return speedTestService.performSpeedTest(); // Trả về kết quả đo tốc độ dưới dạng JSON
    }

    @GetMapping("/speedtest/history")
    @ResponseBody
    public List<SpeedTestHistory> getHistory() {
        return historyRepository.findAll();
    }
}
