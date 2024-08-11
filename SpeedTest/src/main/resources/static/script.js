$(document).ready(function () {
    var gauge = createGauge('speedGauge');

    function createGauge(elementId) {
        var opts = {
            angle: 0.2,
            lineWidth: 0.1,
            radiusScale: 1,
            pointer: {
                length: 0.6,
                strokeWidth: 0.035,
                color: '#ffffff'
            },
            limitMax: false,
            limitMin: false,
            colorStart: '#6FADCF',
            colorStop: '#8FC0DA',
            strokeColor: '#E0E0E0',
            generateGradient: true,
            highDpiSupport: true,
            staticZones: [
                {strokeStyle: "#F03E3E", min: 0, max: 30},
                {strokeStyle: "#FFDD00", min: 30, max: 70},
                {strokeStyle: "#30B32D", min: 70, max: 100}
            ],
        };
        var target = document.getElementById(elementId);
        var gauge = new Gauge(target).setOptions(opts);
        gauge.maxValue = 100;
        gauge.setMinValue(0);
        gauge.animationSpeed = 32;
        gauge.set(0);
        return gauge;
    }

    function animateGauge(gauge, value, elementId) {
        var current = 0;
        var step = value / 20;
        var interval = setInterval(function () {
            if (current >= value) {
                clearInterval(interval);
            } else {
                current += step;
                gauge.set(current);
                $('#' + elementId).text(current.toFixed(2));
            }
        }, 100);
    }

    function fetchSpeedTestData() {
        return $.get('/speedtest'); // Adjust the URL according to your setup
    }

    function handleSpeedTestResult(data) {
        var downloadSpeed = data.downloadSpeed || 0;
        var uploadSpeed = data.uploadSpeed || 0;
        var ping = data.ping || 0;

        animateGauge(gauge, downloadSpeed, 'downloadValue');
        $('#pingValue').text(ping.toFixed(2));
        $('#downloadValue').text(downloadSpeed.toFixed(2));
        $('#uploadValue').text(uploadSpeed.toFixed(2));
    }

    function performSpeedTest() {
        fetchSpeedTestData()
            .done(function (data) {
                handleSpeedTestResult(data);
            })
            .fail(function (jqXHR, textStatus, errorThrown) {
                console.error("Error fetching speed test data: ", textStatus, errorThrown);
            });
    }

    $('#startBtn').click(function () {
        $('#initialView').hide();
        $('#speedTestView').show();
        performSpeedTest();
    });
});
