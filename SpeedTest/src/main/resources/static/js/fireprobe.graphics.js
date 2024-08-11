/*
 *  FireProbe APP Graphic
 */
var fireProbeGraphic = function (sp, DEBUG_LEVEL) {

    thatg = this;
    _.bindAll(this);
    this.DEBUG_LEVEL = typeof DEBUG_LEVEL !== 'undefined' ? DEBUG_LEVEL : logger.ERROR;
    this.sp = sp;
    this.tween = null;
    this.log = new logger('GRAPHIC', this.DEBUG_LEVEL);
    this.downloadChart = null;
    this.uploadChart = null;
    this.downloadChartConfig = null;
    this.uploadChartConfig = null;
    this.selectServerCanvas = null;
    this.selectServerCloseCanvas = null;
    this.startCanvas = null;
    this.serverCanvas = null;
    this.testingModeCanvas = null;
    this.gaugeConfig = null;
    this.gaugeCanvas = null;
    this.gaugeCanvas2 = null;
    this.gaugeContext2 = null;
    this.tfrC = null;
    this.progressCount = 0;

    $('.scrollbar-inner').scrollbar();

    this.gatherFontValues();

    // resize event
    // regather and recalculate
    $(window).resize(function () {
        thatg.gatherFontValues();
    });

    /*
        #000000 -> this.sp.configuration.colors.text
        #ffffff -> this.sp.configuration.colors.background
        #3490DC -> this.sp.configuration.colors.main
        #A0CDFF -> this.sp.configuration.colors.light
        #e0e0e0 -> this.sp.configuration.colors.track
    */

    if (!this.sp.configuration.colors) {
        this.sp.configuration.colors = {};
    }
    if (!this.sp.configuration.mobile) {
        this.sp.configuration.mobile = {};
    }

    if (this.sp.configuration.colors.background && this.sp.configuration.colors.background.length == 7) {
        $("body").css('background-color', this.sp.configuration.colors.background);
    } else {
        // no background color defined
    }
    if (this.sp.configuration.colors.text && this.sp.configuration.colors.text.length == 7) {
        $("#fireprobe").css('color', this.sp.configuration.colors.text);
        $("#fireprobe .powered a").css('color', this.sp.configuration.colors.text);
    } else {
        this.sp.configuration.colors.text = '#000000';
    }
    if (this.sp.configuration.colors.buttontext && this.sp.configuration.colors.buttontext.length == 7) {
        $("#fireprobe #restart").css('color', this.sp.configuration.colors.buttontext);
        $("#fireprobe #share").css('color', this.sp.configuration.colors.buttontext);
        $("#fireprobe #approve").css('color', this.sp.configuration.colors.buttontext);
    } else {
        this.sp.configuration.colors.buttontext = '#ffffff';
    }
    if (this.sp.configuration.colors.main && this.sp.configuration.colors.main.length == 7) {
        $("#fireprobe .start .text").css('color', this.sp.configuration.colors.main);
        $("#fireprobe .progress-bar").css('background-color', this.sp.configuration.colors.main);
        $("#fireprobe .progress-bar").css('border-color', this.sp.configuration.colors.main);
        $("#fireprobe #restart").css('background-color', this.sp.configuration.colors.main);
        $("#fireprobe #share").css('background-color', this.sp.configuration.colors.main);
        $("#fireprobe #approve").css('background-color', this.sp.configuration.colors.main);
        $("#fireprobe .select-server-wrapper").css('border-color', this.sp.configuration.colors.main);
        $("#fireprobe .select-server .s-server").mouseover(function () {
            $(this).css('border', "2px solid " + thatg.sp.configuration.colors.main);
        }).mouseout(function () {
            $(this).css('border', "none");
        });
        $("#fireprobe .scrollbar-inner .scroll-element .scroll-bar").css('background-color', this.sp.configuration.colors.main);
    } else {
        this.sp.configuration.colors.main = '#3490DC';
    }
    if (this.sp.configuration.colors.light && this.sp.configuration.colors.light.length == 7) {
        $("#fireprobe .progress").css('background-color', this.sp.configuration.colors.light);
        $("#fireprobe .progress").css('border-color', this.sp.configuration.colors.light);
    } else {
        this.sp.configuration.colors.light = '#A0CDFF';
    }
    if (this.sp.configuration.colors.track && this.sp.configuration.colors.track.length == 7) {
        $("#fireprobe .scrollbar-inner .scroll-element .scroll-element_track").css('background-color', this.sp.configuration.colors.track);
        $("#fireprobe .select-server .s-server").css('background-color', this.sp.configuration.colors.track);
    } else {
        this.sp.configuration.colors.track = '#e0e0e0';
    }

    this.requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame || window.msRequestAnimationFrame;
    window.requestAnimationFrame = requestAnimationFrame;

    this.drawStartCanvas();

    this.serverCanvas = $('#server-canvas');
    this.serverCanvas.drawLine({
        strokeStyle: this.sp.configuration.colors.main,
        fillStyle: this.sp.configuration.colors.main,
        strokeWidth: 1,
        rounded: true,
        closed: true,
        x1: 0, y1: 34,
        x2: 17, y2: 0,
        x3: 34, y3: 34
    });

    this.selectServerCloseCanvas = $('#server-select-close-canvas');
    this.selectServerCloseCanvas.drawLine({
        strokeStyle: this.sp.configuration.colors.main,
        fillStyle: this.sp.configuration.colors.main,
        strokeWidth: 5,
        rounded: true,
        closed: false,
        x1: 10, y1: 10,
        x2: 26, y2: 26,
    }).drawLine({
        strokeStyle: this.sp.configuration.colors.main,
        fillStyle: this.sp.configuration.colors.main,
        strokeWidth: 5,
        rounded: true,
        closed: false,
        x1: 26, y1: 10,
        x2: 10, y2: 26,
    });

    this.testingModeCanvas = $('#testing-mode-canvas');

    /* Gauge */
    this.gaugeConfig = {
        mainColor: this.sp.configuration.colors.main,
        mainBigIndColor: this.sp.configuration.colors.main,
        mainSmallIndColor: this.sp.configuration.colors.light,
        mainTextColor: this.sp.configuration.colors.text,
        secondOpacity: 0.3,
        fontFamily: '"Exo 2", sans-serif',
        started: false,
        currentAngle: -120,
        endAngle: -120,
        angleChangeStep: 0.01
    };

    this.gaugeCanvas = $('#gauge-canvas');
    this.gaugeCanvas2 = document.getElementById('gauge-canvas-2');
    this.gaugeContext2 = this.gaugeCanvas2.getContext('2d');

    if (this.DEBUG_LEVEL == logger.DEBUG) {
        /* Help lines */
        this.gaugeCanvas.drawLine({
            layer: true,
            groups: ['helpLine'],
            name: 'line0',
            strokeStyle: this.sp.configuration.colors.text,
            strokeWidth: 1,
            x1: 0, y1: 550,
            x2: 1100, y2: 550
        }).drawLine({
            layer: true,
            groups: ['helpLine'],
            name: 'line1',
            strokeStyle: this.sp.configuration.colors.text,
            strokeWidth: 1,
            x1: 550, y1: 0,
            x2: 550, y2: 745
        }).drawArc({
            layer: true,
            groups: ['helpLine'],
            name: 'line2',
            strokeStyle: '#00',
            strokeWidth: 1,
            x: 550, y: 550,
            radius: 430,
            start: -120, end: 120
        }).drawArc({
            layer: true,
            groups: ['helpLine'],
            name: 'line3',
            strokeStyle: '#00',
            strokeWidth: 1,
            x: 550, y: 550,
            radius: 452,
            start: -120, end: 120
        }).drawArc({
            layer: true,
            groups: ['helpLine'],
            name: 'line4',
            strokeStyle: '#00',
            strokeWidth: 1,
            x: 550, y: 550,
            radius: 469,
            start: -120, end: 120
        });
    }

    this.gaugeContext2.lineWidth = 42;
    this.gaugeContext2.strokeStyle = this.gaugeConfig.mainColor;
    this.gaugeContext2.shadowOffsetX = 0;
    this.gaugeContext2.shadowOffsetY = 0;
    this.gaugeContext2.shadowBlur = 0;
    this.gaugeContext2.clearRect(0, 0, this.gaugeCanvas2.width, this.gaugeCanvas2.height);
    this.gaugeContext2.beginPath();
    this.gaugeContext2.arc(550, 550, 400, -120 * (Math.PI / 180) - Math.PI / 2, -120 * (Math.PI / 180) - Math.PI / 2, false);
    this.gaugeContext2.stroke();

    this.gaugeCanvas.drawArc({
        layer: true,
        groups: ['gauge'],
        name: 'gauge1',
        strokeStyle: this.gaugeConfig.mainColor,
        strokeWidth: 42,
        x: 550, y: 550,
        radius: 400,
        start: -120, end: 120,
        opacity: this.gaugeConfig.secondOpacity,
    });

    /* Small */
    // 0 - 2
    this.gaugeCanvas.drawRect({
        layer: true,
        groups: ['smallInd', 'gauge'],
        name: 'smallInd00',
        strokeStyle: this.gaugeConfig.mainSmallIndColor,
        fillStyle: this.gaugeConfig.mainSmallIndColor,
        x: this.getPointXY(-114, 1.1).x, y: this.getPointXY(-114, 1.1).y,
        width: 3,
        height: 22,
        rotate: -114
    }).drawRect({
        layer: true,
        groups: ['smallInd', 'gauge'],
        name: 'smallInd01',
        strokeStyle: this.gaugeConfig.mainSmallIndColor,
        fillStyle: this.gaugeConfig.mainSmallIndColor,
        x: this.getPointXY(-108, 1.1).x, y: this.getPointXY(-108, 1.1).y,
        width: 3,
        height: 22,
        rotate: -108
    }).drawRect({
        layer: true,
        groups: ['smallInd', 'gauge'],
        name: 'smallInd02',
        strokeStyle: this.gaugeConfig.mainSmallIndColor,
        fillStyle: this.gaugeConfig.mainSmallIndColor,
        x: this.getPointXY(-102, 1.1).x, y: this.getPointXY(-102, 1.1).y,
        width: 3,
        height: 22,
        rotate: -102
    }).drawRect({
        layer: true,
        groups: ['smallInd', 'gauge'],
        name: 'smallInd03',
        strokeStyle: this.gaugeConfig.mainSmallIndColor,
        fillStyle: this.gaugeConfig.mainSmallIndColor,
        x: this.getPointXY(-96, 1.1).x, y: this.getPointXY(-96, 1.1).y,
        width: 3,
        height: 22,
        rotate: -96
    });

    // 2 - 5
    this.gaugeCanvas.drawRect({
        layer: true,
        groups: ['smallInd', 'gauge'],
        name: 'smallInd20',
        strokeStyle: this.gaugeConfig.mainSmallIndColor,
        fillStyle: this.gaugeConfig.mainSmallIndColor,
        x: this.getPointXY(-84, 1.1).x, y: this.getPointXY(-84, 1.1).y,
        width: 3,
        height: 22,
        rotate: -84
    }).drawRect({
        layer: true,
        groups: ['smallInd', 'gauge'],
        name: 'smallInd21',
        strokeStyle: this.gaugeConfig.mainSmallIndColor,
        fillStyle: this.gaugeConfig.mainSmallIndColor,
        x: this.getPointXY(-78, 1.1).x, y: this.getPointXY(-78, 1.1).y,
        width: 3,
        height: 22,
        rotate: -78
    }).drawRect({
        layer: true,
        groups: ['smallInd', 'gauge'],
        name: 'smallInd22',
        strokeStyle: this.gaugeConfig.mainSmallIndColor,
        fillStyle: this.gaugeConfig.mainSmallIndColor,
        x: this.getPointXY(-72, 1.1).x, y: this.getPointXY(-72, 1.1).y,
        width: 3,
        height: 22,
        rotate: -72
    }).drawRect({
        layer: true,
        groups: ['smallInd', 'gauge'],
        name: 'smallInd23',
        strokeStyle: this.gaugeConfig.mainSmallIndColor,
        fillStyle: this.gaugeConfig.mainSmallIndColor,
        x: this.getPointXY(-66, 1.1).x, y: this.getPointXY(-66, 1.1).y,
        width: 3,
        height: 22,
        rotate: -66
    });

    // 5 - 10
    this.gaugeCanvas.drawRect({
        layer: true,
        groups: ['smallInd', 'gauge'],
        name: 'smallInd50',
        strokeStyle: this.gaugeConfig.mainSmallIndColor,
        fillStyle: this.gaugeConfig.mainSmallIndColor,
        x: this.getPointXY(-54, 1.1).x, y: this.getPointXY(-54, 1.1).y,
        width: 3,
        height: 22,
        rotate: -54
    }).drawRect({
        layer: true,
        groups: ['smallInd', 'gauge'],
        name: 'smallInd51',
        strokeStyle: this.gaugeConfig.mainSmallIndColor,
        fillStyle: this.gaugeConfig.mainSmallIndColor,
        x: this.getPointXY(-48, 1.1).x, y: this.getPointXY(-48, 1.1).y,
        width: 3,
        height: 22,
        rotate: -48
    }).drawRect({
        layer: true,
        groups: ['smallInd', 'gauge'],
        name: 'smallInd52',
        strokeStyle: this.gaugeConfig.mainSmallIndColor,
        fillStyle: this.gaugeConfig.mainSmallIndColor,
        x: this.getPointXY(-42, 1.1).x, y: this.getPointXY(-42, 1.1).y,
        width: 3,
        height: 22,
        rotate: -42
    }).drawRect({
        layer: true,
        groups: ['smallInd', 'gauge'],
        name: 'smallInd53',
        strokeStyle: this.gaugeConfig.mainSmallIndColor,
        fillStyle: this.gaugeConfig.mainSmallIndColor,
        x: this.getPointXY(-36, 1.1).x, y: this.getPointXY(-36, 1.1).y,
        width: 3,
        height: 22,
        rotate: -36
    });

    // 10 - 25
    this.gaugeCanvas.drawRect({
        layer: true,
        groups: ['smallInd', 'gauge'],
        name: 'smallInd100',
        strokeStyle: this.gaugeConfig.mainSmallIndColor,
        fillStyle: this.gaugeConfig.mainSmallIndColor,
        x: this.getPointXY(-24, 1.1).x, y: this.getPointXY(-24, 1.1).y,
        width: 3,
        height: 22,
        rotate: -24
    }).drawRect({
        layer: true,
        groups: ['smallInd', 'gauge'],
        name: 'smallInd101',
        strokeStyle: this.gaugeConfig.mainSmallIndColor,
        fillStyle: this.gaugeConfig.mainSmallIndColor,
        x: this.getPointXY(-18, 1.1).x, y: this.getPointXY(-18, 1.1).y,
        width: 3,
        height: 22,
        rotate: -18
    }).drawRect({
        layer: true,
        groups: ['smallInd', 'gauge'],
        name: 'smallInd102',
        strokeStyle: this.gaugeConfig.mainSmallIndColor,
        fillStyle: this.gaugeConfig.mainSmallIndColor,
        x: this.getPointXY(-12, 1.1).x, y: this.getPointXY(-12, 1.1).y,
        width: 3,
        height: 22,
        rotate: -12
    }).drawRect({
        layer: true,
        groups: ['smallInd', 'gauge'],
        name: 'smallInd103',
        strokeStyle: this.gaugeConfig.mainSmallIndColor,
        fillStyle: this.gaugeConfig.mainSmallIndColor,
        x: this.getPointXY(-6, 1.1).x, y: this.getPointXY(-6, 1.1).y,
        width: 3,
        height: 22,
        rotate: -6
    });

    // 25-50
    this.gaugeCanvas.drawRect({
        layer: true,
        groups: ['smallInd', 'gauge'],
        name: 'smallInd250',
        strokeStyle: this.gaugeConfig.mainSmallIndColor,
        fillStyle: this.gaugeConfig.mainSmallIndColor,
        x: this.getPointXY(6, 1.1).x, y: this.getPointXY(6, 1.1).y,
        width: 3,
        height: 22,
        rotate: 6
    }).drawRect({
        layer: true,
        groups: ['smallInd', 'gauge'],
        name: 'smallInd251',
        strokeStyle: this.gaugeConfig.mainSmallIndColor,
        fillStyle: this.gaugeConfig.mainSmallIndColor,
        x: this.getPointXY(12, 1.1).x, y: this.getPointXY(12, 1.1).y,
        width: 3,
        height: 22,
        rotate: 12
    }).drawRect({
        layer: true,
        groups: ['smallInd', 'gauge'],
        name: 'smallInd252',
        strokeStyle: this.gaugeConfig.mainSmallIndColor,
        fillStyle: this.gaugeConfig.mainSmallIndColor,
        x: this.getPointXY(18, 1.1).x, y: this.getPointXY(18, 1.1).y,
        width: 3,
        height: 22,
        rotate: 18
    }).drawRect({
        layer: true,
        groups: ['smallInd', 'gauge'],
        name: 'smallInd253',
        strokeStyle: this.gaugeConfig.mainSmallIndColor,
        fillStyle: this.gaugeConfig.mainSmallIndColor,
        x: this.getPointXY(24, 1.1).x, y: this.getPointXY(24, 1.1).y,
        width: 3,
        height: 22,
        rotate: 24
    });

    // 50 - 100
    this.gaugeCanvas.drawRect({
        layer: true,
        groups: ['smallInd', 'gauge'],
        name: 'smallInd500',
        strokeStyle: this.gaugeConfig.mainSmallIndColor,
        fillStyle: this.gaugeConfig.mainSmallIndColor,
        x: this.getPointXY(36, 1.1).x, y: this.getPointXY(36, 1.1).y,
        width: 3,
        height: 22,
        rotate: 36
    }).drawRect({
        layer: true,
        groups: ['smallInd', 'gauge'],
        name: 'smallInd501',
        strokeStyle: this.gaugeConfig.mainSmallIndColor,
        fillStyle: this.gaugeConfig.mainSmallIndColor,
        x: this.getPointXY(42, 1.1).x, y: this.getPointXY(42, 1.1).y,
        width: 3,
        height: 22,
        rotate: 42
    }).drawRect({
        layer: true,
        groups: ['smallInd', 'gauge'],
        name: 'smallInd502',
        strokeStyle: this.gaugeConfig.mainSmallIndColor,
        fillStyle: this.gaugeConfig.mainSmallIndColor,
        x: this.getPointXY(48, 1.1).x, y: this.getPointXY(48, 1.1).y,
        width: 3,
        height: 22,
        rotate: 48
    }).drawRect({
        layer: true,
        groups: ['smallInd', 'gauge'],
        name: 'smallInd503',
        strokeStyle: this.gaugeConfig.mainSmallIndColor,
        fillStyle: this.gaugeConfig.mainSmallIndColor,
        x: this.getPointXY(54, 1.1).x, y: this.getPointXY(54, 1.1).y,
        width: 3,
        height: 22,
        rotate: 54
    });

    // 100 - 250
    this.gaugeCanvas.drawRect({
        layer: true,
        groups: ['smallInd', 'gauge'],
        name: 'smallInd1000',
        strokeStyle: this.gaugeConfig.mainSmallIndColor,
        fillStyle: this.gaugeConfig.mainSmallIndColor,
        x: this.getPointXY(66, 1.1).x, y: this.getPointXY(66, 1.1).y,
        width: 3,
        height: 22,
        rotate: 66
    }).drawRect({
        layer: true,
        groups: ['smallInd', 'gauge'],
        name: 'smallInd1001',
        strokeStyle: this.gaugeConfig.mainSmallIndColor,
        fillStyle: this.gaugeConfig.mainSmallIndColor,
        x: this.getPointXY(72, 1.1).x, y: this.getPointXY(72, 1.1).y,
        width: 3,
        height: 22,
        rotate: 72
    }).drawRect({
        layer: true,
        groups: ['smallInd', 'gauge'],
        name: 'smallInd1002',
        strokeStyle: this.gaugeConfig.mainSmallIndColor,
        fillStyle: this.gaugeConfig.mainSmallIndColor,
        x: this.getPointXY(78, 1.1).x, y: this.getPointXY(78, 1.1).y,
        width: 3,
        height: 22,
        rotate: 78
    }).drawRect({
        layer: true,
        groups: ['smallInd', 'gauge'],
        name: 'smallInd1003',
        strokeStyle: this.gaugeConfig.mainSmallIndColor,
        fillStyle: this.gaugeConfig.mainSmallIndColor,
        x: this.getPointXY(84, 1.1).x, y: this.getPointXY(84, 1.1).y,
        width: 3,
        height: 22,
        rotate: 84
    });

    // 250 - 500
    this.gaugeCanvas.drawRect({
        layer: true,
        groups: ['smallInd', 'gauge'],
        name: 'smallInd2500',
        strokeStyle: this.gaugeConfig.mainSmallIndColor,
        fillStyle: this.gaugeConfig.mainSmallIndColor,
        x: this.getPointXY(96, 1.1).x, y: this.getPointXY(96, 1.1).y,
        width: 3,
        height: 22,
        rotate: 96
    }).drawRect({
        layer: true,
        groups: ['smallInd', 'gauge'],
        name: 'smallInd2501',
        strokeStyle: this.gaugeConfig.mainSmallIndColor,
        fillStyle: this.gaugeConfig.mainSmallIndColor,
        x: this.getPointXY(102, 1.1).x, y: this.getPointXY(102, 1.1).y,
        width: 3,
        height: 22,
        rotate: 102
    }).drawRect({
        layer: true,
        groups: ['smallInd', 'gauge'],
        name: 'smallInd2502',
        strokeStyle: this.gaugeConfig.mainSmallIndColor,
        fillStyle: this.gaugeConfig.mainSmallIndColor,
        x: this.getPointXY(108, 1.1).x, y: this.getPointXY(108, 1.1).y,
        width: 3,
        height: 22,
        rotate: 108
    }).drawRect({
        layer: true,
        groups: ['smallInd', 'gauge'],
        name: 'smallInd2503',
        strokeStyle: this.gaugeConfig.mainSmallIndColor,
        fillStyle: this.gaugeConfig.mainSmallIndColor,
        x: this.getPointXY(114, 1.1).x, y: this.getPointXY(114, 1.1).y,
        width: 3,
        height: 22,
        rotate: 114
    });

    /* Numbers */
    this.gaugeCanvas.drawText({ // 0
        layer: true,
        groups: ['numbers', 'gauge'],
        name: 'num0',
        fillStyle: this.gaugeConfig.mainTextColor,
        strokeWidth: 1,
        x: this.getPointXY(-120, 1.235).x, y: this.getPointXY(-120, 1.235).y,
        fontSize: '44',
        fontFamily: this.gaugeConfig.fontFamily,
        text: '0'
    }).drawText({ // 2
        layer: true,
        groups: ['numbers', 'gauge'],
        name: 'num2',
        fillStyle: this.gaugeConfig.mainTextColor,
        strokeWidth: 1,
        x: this.getPointXY(-90, 1.235).x, y: this.getPointXY(-90, 1.235).y,
        fontSize: '44',
        fontFamily: this.gaugeConfig.fontFamily,
        text: '5'
    }).drawText({ // 5
        layer: true,
        groups: ['numbers', 'gauge'],
        name: 'num5',
        fillStyle: this.gaugeConfig.mainTextColor,
        strokeWidth: 1,
        x: this.getPointXY(-60, 1.235).x, y: this.getPointXY(-60, 1.235).y,
        fontSize: '44',
        fontFamily: this.gaugeConfig.fontFamily,
        text: '10'
    }).drawText({ // 10
        layer: true,
        groups: ['numbers', 'gauge'],
        name: 'num10',
        fillStyle: this.gaugeConfig.mainTextColor,
        strokeWidth: 1,
        x: this.getPointXY(-30, 1.255).x, y: this.getPointXY(-30, 1.255).y,
        fontSize: '44',
        fontFamily: this.gaugeConfig.fontFamily,
        text: '25'
    }).drawText({ // 25
        layer: true,
        groups: ['numbers', 'gauge'],
        name: 'num25',
        fillStyle: this.gaugeConfig.mainTextColor,
        strokeWidth: 1,
        x: this.getPointXY(0, 1.245).x, y: this.getPointXY(0, 1.245).y,
        fontSize: '44',
        fontFamily: this.gaugeConfig.fontFamily,
        text: '50'
    }).drawText({ // 50
        layer: true,
        groups: ['numbers', 'gauge'],
        name: 'num50',
        fillStyle: this.gaugeConfig.mainTextColor,
        strokeWidth: 1,
        x: this.getPointXY(30, 1.255).x, y: this.getPointXY(30, 1.255).y,
        fontSize: '44',
        fontFamily: this.gaugeConfig.fontFamily,
        text: '100'
    }).drawText({ // 100
        layer: true,
        groups: ['numbers', 'gauge'],
        name: 'num100',
        fillStyle: this.gaugeConfig.mainTextColor,
        strokeWidth: 1,
        x: this.getPointXY(60, 1.290).x, y: this.getPointXY(60, 1.290).y,
        fontSize: '44',
        fontFamily: this.gaugeConfig.fontFamily,
        text: '250'
    }).drawText({ // 250
        layer: true,
        groups: ['numbers', 'gauge'],
        name: 'num250',
        fillStyle: this.gaugeConfig.mainTextColor,
        strokeWidth: 1,
        x: this.getPointXY(85, 1.290).x, y: this.getPointXY(90, 1.290).y,
        fontSize: '44',
        fontFamily: this.gaugeConfig.fontFamily,
        text: '500'
    }).drawText({ // 500
        layer: true,
        groups: ['numbers', 'gauge'],
        name: 'num500',
        fillStyle: this.gaugeConfig.mainTextColor,
        strokeWidth: 1,
        x: this.getPointXY(115, 1.295).x, y: this.getPointXY(120, 1.245).y,
        fontSize: '44',
        fontFamily: this.gaugeConfig.fontFamily,
        text: '1000'
    });

    /* Big */
    this.gaugeCanvas.drawRect({ // 0
        layer: true,
        groups: ['bigInd', 'gauge'],
        name: 'bigInd0',
        strokeStyle: this.gaugeConfig.mainBigIndColor,
        fillStyle: this.gaugeConfig.mainBigIndColor,
        x: this.getPointXY(-120, 1.125).x, y: this.getPointXY(-120, 1.125).y,
        width: 4,
        height: 39,
        rotate: -120
    }).drawRect({ // 2
        layer: true,
        groups: ['bigInd', 'gauge'],
        name: 'bigInd2',
        strokeStyle: this.gaugeConfig.mainBigIndColor,
        fillStyle: this.gaugeConfig.mainBigIndColor,
        x: this.getPointXY(-90, 1.125).x, y: this.getPointXY(-90, 1.125).y,
        width: 4,
        height: 39,
        rotate: -90
    }).drawRect({ // 5
        layer: true,
        groups: ['bigInd', 'gauge'],
        name: 'bigInd5',
        strokeStyle: this.gaugeConfig.mainBigIndColor,
        fillStyle: this.gaugeConfig.mainBigIndColor,
        x: this.getPointXY(-60, 1.125).x, y: this.getPointXY(-60, 1.125).y,
        width: 4,
        height: 39,
        rotate: -60
    }).drawRect({ // 10
        layer: true,
        groups: ['bigInd', 'gauge'],
        name: 'bigInd10',
        strokeStyle: this.gaugeConfig.mainBigIndColor,
        fillStyle: this.gaugeConfig.mainBigIndColor,
        x: this.getPointXY(-30, 1.125).x, y: this.getPointXY(-30, 1.125).y,
        width: 4,
        height: 39,
        rotate: -30
    }).drawRect({ // 25
        layer: true,
        groups: ['bigInd', 'gauge'],
        name: 'bigInd25',
        strokeStyle: this.gaugeConfig.mainBigIndColor,
        fillStyle: this.gaugeConfig.mainBigIndColor,
        x: this.getPointXY(0, 1.125).x, y: this.getPointXY(0, 1.125).y,
        width: 4,
        height: 39,
        rotate: 0
    }).drawRect({ // 50
        layer: true,
        groups: ['bigInd', 'gauge'],
        name: 'bigInd50',
        strokeStyle: this.gaugeConfig.mainBigIndColor,
        fillStyle: this.gaugeConfig.mainBigIndColor,
        x: this.getPointXY(30, 1.125).x, y: this.getPointXY(30, 1.125).y,
        width: 4,
        height: 39,
        rotate: 30
    }).drawRect({ // 100
        layer: true,
        groups: ['bigInd', 'gauge'],
        name: 'bigInd100',
        strokeStyle: this.gaugeConfig.mainBigIndColor,
        fillStyle: this.gaugeConfig.mainBigIndColor,
        x: this.getPointXY(60, 1.125).x, y: this.getPointXY(60, 1.125).y,
        width: 4,
        height: 39,
        rotate: 60
    }).drawRect({ // 250
        layer: true,
        groups: ['bigInd', 'gauge'],
        name: 'bigInd250',
        strokeStyle: this.gaugeConfig.mainBigIndColor,
        fillStyle: this.gaugeConfig.mainBigIndColor,
        x: this.getPointXY(90, 1.125).x, y: this.getPointXY(90, 1.125).y,
        width: 4,
        height: 39,
        rotate: 90
    }).drawRect({ // 500
        layer: true,
        groups: ['bigInd', 'gauge'],
        name: 'bigInd500',
        strokeStyle: this.gaugeConfig.mainBigIndColor,
        fillStyle: this.gaugeConfig.mainBigIndColor,
        x: this.getPointXY(120, 1.125).x, y: this.getPointXY(120, 1.125).y,
        width: 4,
        height: 39,
        rotate: 120
    });
};
fireProbeGraphic.prototype.gatherFontValues = function () {
    thatg.tfrC = $('.tfr');

    // gather default vw values for trf class elements
    thatg.tfrC.each(function (i) {
        // clear to have values straight from css
        $(this).css('font-size', '');
        // read values and save to data field
        $(this).data('font-size', $(this).css('font-size').replace('px', '') * (100 / ($(window).width())));
    });

    // always recalculate real font sizes after
    this.recalculateFontSize();
}
fireProbeGraphic.prototype.recalculateFontSize = function () {
    thatg.tfrC.each(function (i) {
        $fs = $(this).data('font-size');
        $pw = $('#tester-wrapper').width();
        $(this).css('font-size', $pw * $fs / 100 + 'px');
    });
}
fireProbeGraphic.prototype.drawStartCanvas = function () {
    this.startCanvas = $('#start-canvas');
    this.startCanvas.drawArc({
        strokeStyle: this.sp.configuration.colors.main,
        strokeStyle: this.sp.configuration.colors.main,
        strokeWidth: 16,
        x: 250, y: 250,
        radius: 200,
        start: 0, end: 360
    });
}
fireProbeGraphic.prototype.getPointXY = function (angle, distance) {
    angle = angle - 90;
    var px = 550 + 400 * Math.cos(angle * Math.PI / 180) * distance;
    var py = 550 + 400 * Math.sin(angle * Math.PI / 180) * distance;

    return {x: px, y: py};
};
fireProbeGraphic.prototype.gaugeStartAnimation = function () {
    this.gaugeConfig.started = true;
    this.gaugeAnimate();
};
fireProbeGraphic.prototype.gaugeStopAnimation = function () {
    this.gaugeConfig.started = false;
};
fireProbeGraphic.prototype.gaugeAnimate = function () {

    if (thatg.gaugeConfig.currentAngle < -120) thatg.gaugeConfig.currentAngle = -120;
    if (thatg.gaugeConfig.currentAngle > 120) thatg.gaugeConfig.currentAngle = 120;

    thatg.gaugeContext2.clearRect(0, 0, thatg.gaugeCanvas2.width, thatg.gaugeCanvas2.height);
    thatg.gaugeContext2.beginPath();
    thatg.gaugeContext2.arc(550, 550, 400, -120 * (Math.PI / 180) - Math.PI / 2, thatg.gaugeConfig.currentAngle * (Math.PI / 180) - Math.PI / 2, false);
    thatg.gaugeContext2.stroke();

    var diff = Math.abs(thatg.gaugeConfig.endAngle - thatg.gaugeConfig.currentAngle);

    if (diff > 100) {
        thatg.gaugeConfig.angleChangeStep = 10;
    } else if (diff > 10) {
        thatg.gaugeConfig.angleChangeStep = 1;
    } else if (diff > 1) {
        thatg.gaugeConfig.angleChangeStep = 0.1;
    } else {
        thatg.gaugeConfig.angleChangeStep = 0.01;
    }

    if (thatg.gaugeConfig.currentAngle < thatg.gaugeConfig.endAngle) {
        thatg.gaugeConfig.currentAngle = thatg.gaugeConfig.currentAngle + thatg.gaugeConfig.angleChangeStep;
    }
    else if (thatg.gaugeConfig.currentAngle > thatg.gaugeConfig.endAngle) {
        thatg.gaugeConfig.currentAngle = thatg.gaugeConfig.currentAngle - thatg.gaugeConfig.angleChangeStep;
    }

    if (thatg.gaugeConfig.started) {
        requestAnimationFrame(function () {
            thatg.gaugeAnimate()
        });
    }
};
fireProbeGraphic.prototype.initialize = function () {
    this.log.info('Initializing APP Graphic');

    if (this.sp.configuration.serversvalid.length == 0) {
        if (this.sp.configuration['translation'] && this.sp.configuration['translation'][20]) {
            $('#fireprobe .server .title').html(this.sp.configuration['translation'][20]);
        } else {
            $('#fireprobe .server .title').html("NO SERVERS");
        }
        $('#fireprobe .server .value').html("");
        this.log.info("No servers.");
        return;
    }

    if (this.sp.configuration['translation'] && this.sp.configuration['translation'][10]) {
        $('#fireprobe .testing-mode .value').html(this.sp.configuration['translation'][10]);
    } else {
        $('#fireprobe .testing-mode .value').html('Ping');
    }
    $('#fireprobe .start').show();
    $('#fireprobe .ip .value').html(this.sp.results['ip']);
    $('#fireprobe .isp .value').html(this.sp.results['isp']);
    if (this.sp.configuration.servers_optimal_enabled == true && this.sp.configuration.multi > 1) {
        if (this.sp.configuration['translation'] && this.sp.configuration['translation'][22]) {
            $('#fireprobe .server .title').html(this.sp.configuration['translation'][22] + ": ");
        } else {
            $('#fireprobe .server .title').html('Autoselect: ');
        }
        if (this.sp.configuration['translation'] && this.sp.configuration['translation'][23]) {
            $('#fireprobe .server .value').html(this.sp.configuration['translation'][23]);
        } else {
            $('#fireprobe .server .value').html('Multi-location');
        }
    } else {
        $('#fireprobe .server .title').html(this.sp.configuration.servers[0].city + ':');
        $('#fireprobe .server .value').html(this.sp.configuration.servers[0].name);
    }

    $('#fireprobe .ip-result').html(this.sp.results['ip']);

    if (this.sp.configuration.multi > 1) {
        // auto select entry
        $clone = $('#fireprobe .select-server .server-empty').clone(true).data('arr', $.extend([], $('#fireprobe .select-server .server-empty').data('arr'))).removeClass('server-empty');
        if (this.sp.configuration['translation'] && this.sp.configuration['translation'][22]) {
            $('.server-name', $clone).html(this.sp.configuration['translation'][22]);
        } else {
            $('.server-name', $clone).html("Autoselect");
        }
        if (this.sp.configuration['translation'] && this.sp.configuration['translation'][23]) {
            $('.server-loc', $clone).html(this.sp.configuration['translation'][23]);
        } else {
            $('.server-loc', $clone).html("Multi-location");
        }
        $('.value-1', $clone).html("");
        $('.value-2', $clone).html("");
        $clone.data('serverId', 999999);
        $clone.click(function () {
            thatg.sp.setServer($(this).data('serverId'));
            if (thatg.sp.configuration.servers_optimal_enabled == true) {
                $('#fireprobe .server .title').html('Autoselect: ');
                $('#fireprobe .server .value').html('Multi-location');
            } else {
                $('#fireprobe .server .title').html(thatg.sp.configuration.serversvalid[$(this).data('serverId')].city + ':');
                $('#fireprobe .server .value').html(thatg.sp.configuration.serversvalid[$(this).data('serverId')].name);
            }
            $('#fireprobe .select-server-wrapper').hide();
        });
        $clone.appendTo('#fireprobe #select-server');
    }

    $(this.sp.configuration.serversvalid).each(function (i, e) {
        $clone = $('#fireprobe .select-server .server-empty').clone(true).data('arr', $.extend([], $('#fireprobe .select-server .server-empty').data('arr'))).removeClass('server-empty');
        $('.server-name', $clone).html(e.name);
        $('.server-loc', $clone).html(e.city);
        $('.value-1', $clone).html("~" + Math.round(e.distance));
        $('.value-2', $clone).html("km");
        $clone.data('serverId', i);
        $clone.click(function () {
            thatg.sp.setServer($(this).data('serverId'));

            $('#fireprobe .server .title').html(thatg.sp.configuration.serversvalid[$(this).data('serverId')].city + ':');
            $('#fireprobe .server .value').html(thatg.sp.configuration.serversvalid[$(this).data('serverId')].name);

            $('#fireprobe .select-server-wrapper').hide();
        });
        $clone.appendTo('#fireprobe #select-server');
    });

    this.selectServerCanvas = $('#fireprobe .select-server .server-canvas');
    this.selectServerCanvas.drawLine({
        strokeStyle: this.sp.configuration.colors.main,
        fillStyle: this.sp.configuration.colors.main,
        strokeWidth: 1,
        rounded: true,
        closed: true,
        x1: 0, y1: 34,
        x2: 17, y2: 0,
        x3: 34, y3: 34
    });

    $('#fireprobe .start').click(function () {
        $('html, body').animate({
            scrollTop: $("#tester-wrapper").offset().top
        }, 500);
        thatg.start();
        return false;
    });

    $('#fireprobe #restart').click(function () {
        $('html, body').animate({
            scrollTop: $("#tester-wrapper").offset().top
        }, 500);
        $('#fireprobe').removeClass('stage3');
        $('#fireprobe *').removeClass('stage3');
        thatg.start();
        return false;
    });

    $('#fireprobe .server').click(function () {
        if (thatg.sp.configuration.serversvalid.length > 1 && thatg.sp.configuration.manualServerSelect) {
            $('#fireprobe .select-server-wrapper').show();
        }
        return false;
    });

    $('#fireprobe .select-server-wrapper #server-select-close-canvas').click(function () {
        $('#fireprobe .select-server-wrapper').hide();
        return false;
    });

    $('body').trigger('fireprobe_graphics_initialized');
};
fireProbeGraphic.prototype.initPhase = function (action) {
    switch (action) {
        case 'latency':
            $('#fireprobe .server').unbind('click');

            $('#fireprobe #start-canvas').hide();
            $('#fireprobe .ip').hide();

            $('#fireprobe').addClass('stage2');
            $('#fireprobe #tester').addClass('stage2');
            $('#fireprobe .name').addClass('stage2');
            $('#fireprobe #server').addClass('stage2');
            $('#fireprobe .ip').addClass('stage2');
            $('#fireprobe .isp').addClass('stage2');
            $('#fireprobe .powered').addClass('stage2');
            $('#fireprobe .testing-mode').addClass('stage2');
            $('#fireprobe #testing-mode-canvas').addClass('stage2');
            $('#fireprobe .progress').addClass('stage2');
            $('#fireprobe .current').addClass('stage2');
            $('#fireprobe .ping').addClass('stage2');
            $('#fireprobe .download').addClass('stage2');
            $('#fireprobe .upload').addClass('stage2');
            $('#fireprobe .jitter').addClass('stage2');
            $('#fireprobe #gauge-canvas').addClass('stage2');
            $('#fireprobe #gauge-canvas-2').addClass('stage2');
            $('#fireprobe #download-chart-canvas').addClass('stage2');
            $('#fireprobe #upload-chart-canvas').addClass('stage2');
            $('#fireprobe .select-server-wrapper').addClass('stage2');
            $('#fireprobe .results-wrapper').addClass('stage2');
            $('#fireprobe .select-server-wrapper-dummy').addClass('stage2');

            this.gatherFontValues();

            if (this.sp.configuration['translation'] && this.sp.configuration['translation'][10]) {
                $('#fireprobe .testing-mode .value').html(this.sp.configuration['translation'][10]);
            } else {
                $('#fireprobe .testing-mode .value').html('Ping');
            }
            $('#fireprobe .current-result .value-2').html('ms');

            this.downloadChartConfig = {
                type: 'line',
                data: {
                    labels: [0],
                    datasets: [{
                        label: "D1",
                        data: [0],
                        fill: true,
                        backgroundColor: this.sp.configuration.colors.light,
                        borderColor: this.sp.configuration.colors.main,
                        radius: 0,
                        hoverRadius: 0,
                    }],
                },
                options: {
                    responsive: false,
                    scales: {
                        xAxes: [{display: false}],
                        yAxes: [{display: false}]
                    },
                    legend: {
                        display: false,
                    },
                    tooltips: {
                        enabled: false,
                    }
                }
            };

            this.uploadChartConfig = {
                type: 'line',
                data: {
                    labels: [0],
                    datasets: [{
                        label: "U1",
                        data: [0],
                        fill: true,
                        backgroundColor: this.sp.configuration.colors.light,
                        borderColor: this.sp.configuration.colors.main,
                        radius: 0,
                        hoverRadius: 0,
                    }],
                },
                options: {
                    responsive: false,
                    scales: {
                        xAxes: [{display: false}],
                        yAxes: [{display: false}]
                    },
                    legend: {
                        display: false,
                    },
                    tooltips: {
                        enabled: false,
                    }
                }
            };

            // Latency
            $('#fireprobe #testing-mode-canvas').removeClass('upload-mode').addClass('latency-mode');
            this.testingModeCanvas.clearCanvas();
            this.testingModeCanvas.drawLine({
                fillStyle: this.sp.configuration.colors.main,
                strokeStyle: this.sp.configuration.colors.main,
                strokeWidth: 10,
                x1: 23, y1: 40,
                x2: 70, y2: 40,
            }).drawLine({
                fillStyle: this.sp.configuration.colors.main,
                strokeStyle: this.sp.configuration.colors.main,
                strokeWidth: 3,
                rounded: true,
                closed: true,
                x1: 70, y1: 25,
                x2: 70, y2: 55,
                x3: 85, y3: 40,
            }).drawLine({
                fillStyle: this.sp.configuration.colors.main,
                strokeStyle: this.sp.configuration.colors.main,
                strokeWidth: 10,
                x1: 30, y1: 70,
                x2: 77, y2: 70,
            }).drawLine({
                fillStyle: this.sp.configuration.colors.main,
                strokeStyle: this.sp.configuration.colors.main,
                strokeWidth: 3,
                rounded: true,
                closed: true,
                x1: 30, y1: 55,
                x2: 30, y2: 85,
                x3: 15, y3: 70,
            })

            this.sp.graphicResponse('latency');
            this.tween = TweenLite.to($('#fireprobe .progress .progress-bar'), this.sp.configuration['latencyTime'], {css: {width: '100%'}});
            break;
        case 'download':
            if (this.sp.configuration['translation'] && this.sp.configuration['translation'][8]) {
                $('#fireprobe .testing-mode .value').html(this.sp.configuration['translation'][8]);
            } else {
                $('#fireprobe .testing-mode .value').html('Download');
            }
            $('#fireprobe .current-result .value-2').html('Mb/s');

            // Download
            $('#fireprobe #testing-mode-canvas').removeClass('latency-mode').addClass('download-mode');
            this.testingModeCanvas.clearCanvas();
            this.testingModeCanvas.drawLine({
                fillStyle: this.sp.configuration.colors.main,
                strokeStyle: this.sp.configuration.colors.main,
                strokeWidth: 10,
                x1: 52, y1: 10,
                x2: 52, y2: 35,
            }).drawLine({
                fillStyle: this.sp.configuration.colors.main,
                strokeStyle: this.sp.configuration.colors.main,
                strokeWidth: 3,
                rounded: true,
                closed: true,
                x1: 36, y1: 35,
                x2: 68, y2: 35,
                x3: 52, y3: 55,
            }).drawLine({
                //fillStyle: this.sp.configuration.colors.main,
                strokeStyle: this.sp.configuration.colors.main,
                strokeWidth: 6,
                rounded: true,
                closed: false,
                x1: 25, y1: 65,
                x2: 77, y2: 65,
            });

            this.downloadChart = new Chart(document.getElementById('download-chart-canvas'), this.downloadChartConfig);
            this.uploadChart = new Chart(document.getElementById('upload-chart-canvas'), this.uploadChartConfig);

            this.sp.graphicResponse('download');
            this.tween = TweenLite.to($('#fireprobe .progress .progress-bar'), this.sp.configuration['downloadTime'], {css: {width: '100%'}});
            break;
        case 'upload':
            if (this.sp.configuration['translation'] && this.sp.configuration['translation'][9]) {
                $('#fireprobe .testing-mode .value').html(this.sp.configuration['translation'][9]);
            } else {
                $('#fireprobe .testing-mode .value').html('Upload');
            }
            $('#fireprobe .current-result .value-2').html('Mb/s');

            // Upload
            $('#fireprobe #testing-mode-canvas').removeClass('latency-mode').addClass('upload-mode');
            this.testingModeCanvas.clearCanvas();
            this.testingModeCanvas.drawLine({
                fillStyle: this.sp.configuration.colors.main,
                strokeStyle: this.sp.configuration.colors.main,
                strokeWidth: 10,
                x1: 52, y1: 35,
                x2: 52, y2: 55,
            }).drawLine({
                fillStyle: this.sp.configuration.colors.main,
                strokeStyle: this.sp.configuration.colors.main,
                strokeWidth: 3,
                rounded: true,
                closed: true,
                x1: 36, y1: 35,
                x2: 68, y2: 35,
                x3: 52, y3: 12,
            }).drawLine({
                //fillStyle: this.sp.configuration.colors.main,
                strokeStyle: this.sp.configuration.colors.main,
                strokeWidth: 6,
                rounded: true,
                closed: false,
                x1: 25, y1: 65,
                x2: 77, y2: 65,
            });

            this.sp.graphicResponse('upload');
            this.tween = TweenLite.to($('#fireprobe .progress .progress-bar'), this.sp.configuration['uploadTime'], {css: {width: '100%'}});
            break;
        case 'results':
            this.gaugeStopAnimation();

            $('#fireprobe').removeClass('stage2');
            $('#fireprobe *').removeClass('stage2');
            $('#fireprobe').addClass('stage3');
            $('#fireprobe #tester').addClass('stage3');
            $('#fireprobe .name').addClass('stage3');
            $('#fireprobe #server').addClass('stage3');
            $('#fireprobe .isp').addClass('stage3');
            $('#fireprobe .date').addClass('stage3');
            $('#fireprobe .powered').addClass('stage3');
            $('#fireprobe .ping').addClass('stage3');
            $('#fireprobe .download').addClass('stage3');
            $('#fireprobe .upload').addClass('stage3');
            $('#fireprobe .jitter').addClass('stage3');
            $('#fireprobe #download-chart-canvas').addClass('stage3');
            $('#fireprobe #upload-chart-canvas').addClass('stage3');

            if (this.sp.jscd.os == 'Android' && this.sp.configuration.mobile && this.sp.configuration.mobile.android && this.sp.configuration.mobile.android_url && this.sp.configuration.mobile.android_img) {
                $('#fireprobe .mad').addClass('stage3');
                $('#fireprobe .mad').attr('href', this.sp.configuration.mobile.android_url);
                $('#fireprobe .mad').html('<img src="' + this.sp.configuration.mobile.android_img + '" alt="" />');
                $('#fireprobe .mad').unbind();
                $('#fireprobe .mad').click(function () {
                    thatg.sp.sendEvent("adclick_android");
                });
                if (this.sp.configuration.mobile.restart_txtcolor) {
                    $("#fireprobe #restart").css('color', this.sp.configuration.mobile.restart_txtcolor);
                }
                if (this.sp.configuration.mobile.restart_bgcolor) {
                    $("#fireprobe #restart").css('background-color', this.sp.configuration.mobile.restart_bgcolor);
                }
            } else if (this.sp.jscd.os == 'iOS' && this.sp.configuration.mobile && this.sp.configuration.mobile.ios && this.sp.configuration.mobile.ios_url && this.sp.configuration.mobile.ios_img) {
                $('#fireprobe .mad').addClass('stage3');
                $('#fireprobe .mad').attr('href', this.sp.configuration.mobile.ios_url);
                $('#fireprobe .mad').html('<img src="' + this.sp.configuration.mobile.ios_img + '" alt="" />');
                $('#fireprobe .mad').unbind();
                $('#fireprobe .mad').click(function () {
                    thatg.sp.sendEvent("adclick_ios");
                });
                if (this.sp.configuration.mobile.restart_txtcolor) {
                    $("#fireprobe #restart").css('color', this.sp.configuration.mobile.restart_txtcolor);
                }
                if (this.sp.configuration.mobile.restart_bgcolor) {
                    $("#fireprobe #restart").css('background-color', this.sp.configuration.mobile.restart_bgcolor);
                }
            } else if (this.sp.configuration.mobile && this.sp.configuration.mobile.desktop && this.sp.configuration.mobile.desktop_url && this.sp.configuration.mobile.desktop_img) {
                $('#fireprobe .mad').addClass('stage3');
                $('#fireprobe .mad').attr('href', this.sp.configuration.mobile.desktop_url);
                $('#fireprobe .mad').html('<img src="' + this.sp.configuration.mobile.desktop_img + '" alt="" />');
                $('#fireprobe .mad').unbind();
                $('#fireprobe .mad').click(function () {
                    thatg.sp.sendEvent("adclick_desktop");
                });
                if (this.sp.configuration.mobile.restart_txtcolor) {
                    $("#fireprobe #restart").css('color', this.sp.configuration.mobile.restart_txtcolor);
                }
                if (this.sp.configuration.mobile.restart_bgcolor) {
                    $("#fireprobe #restart").css('background-color', this.sp.configuration.mobile.restart_bgcolor);
                }
            } else {
                $('#fireprobe .results-wrapper').addClass('stage3');
            }

            $('#fireprobe #restart').addClass('stage3');
            $('#fireprobe #share').addClass('stage3');
            $('#fireprobe #approve').addClass('stage3');

            if (this.sp.configuration['smg']) {
                $('#fireprobe #restart').addClass('serviceMode');
                $('#fireprobe #approve').addClass('serviceMode');
                $('#fireprobe #approve').unbind();
                $('#fireprobe #approve').click(function () {
                    $('#fireprobe #approve').unbind();
                    thatg.sp.configuration['smg'] = false;
                    thatg.sp.uploadResults();
                    $('#fireprobe #restart').removeClass('serviceMode');
                    $('#fireprobe #approve').removeClass('serviceMode');
                    return false;
                });
            }

            $('#fireprobe .select-server-wrapper').addClass('stage3');
            $('#fireprobe .select-server-wrapper').hide();
            $('#fireprobe .select-server-wrapper-dummy').addClass('stage3');

            this.gatherFontValues();

            $('#fireprobe .results-wrapper .icon').removeClass('s5 s4 s3 s2 s1');
            $('#fireprobe .results-wrapper .web').addClass('s' + this.getSummaryScore(1));
            $('#fireprobe .results-wrapper .web .value-1').html(this.getSummaryScore(1));
            $('#fireprobe .results-wrapper .stream-lq .value-1').html(this.getSummaryScore(2));
            $('#fireprobe .results-wrapper .stream-lq').addClass('s' + this.getSummaryScore(2));
            $('#fireprobe .results-wrapper .stream-hq .value-1').html(this.getSummaryScore(3));
            $('#fireprobe .results-wrapper .stream-hq').addClass('s' + this.getSummaryScore(3));
            $('#fireprobe .results-wrapper .calls .value-1').html(this.getSummaryScore(4));
            $('#fireprobe .results-wrapper .calls').addClass('s' + this.getSummaryScore(4));
            $('#fireprobe .results-wrapper .games .value-1').html(this.getSummaryScore(5));
            $('#fireprobe .results-wrapper .games').addClass('s' + this.getSummaryScore(5));

            $('#fireprobe .server').click(function () {
                if (thatg.sp.configuration.serversvalid.length > 1) {
                    $('#fireprobe .select-server-wrapper').show();
                }
                return false;
            });

            if (this.sp.results['latencyResult'] == -1 || this.sp.results['downloadResult'] == -1 || this.sp.results['uploadResult'] == -1) {
                this.showError();
            }

            this.sp.graphicResponse('results');
            break;
    }
    ;
};

fireProbeGraphic.prototype.start = function () {
    this.gaugeCanvas.drawLayers();
    $('#fireprobe .current-result .value-1').html('...');
    $('#fireprobe .current-result .value-2').html('');
    $('#fireprobe .ping-result .value-1').html('...');
    $('#fireprobe .ping-result .value-2').html('');
    $('#fireprobe .download-result .value-1').html('...');
    $('#fireprobe .download-result .value-2').html('');
    $('#fireprobe .upload-result .value-1').html('...');
    $('#fireprobe .upload-result .value-2').html('');
    $('#fireprobe .jitter-result .value-1').html('...');
    $('#fireprobe .jitter-result .value-2').html('');
    $('#fireprobe .testing-mode .value').html('Ping');
    $('#fireprobe *').removeClass('stage2').removeClass('stage3');
    this.gatherFontValues();

    $('#fireprobe .start').hide();

    if (this.downloadChart) this.downloadChart.destroy();
    if (this.uploadChart) this.uploadChart.destroy();

    $('body').trigger('fireprobe_test_started');

    this.sp.start();
};
fireProbeGraphic.prototype.showProgress = function (action, isEnd) {
    isEnd = typeof isEnd !== 'undefined' ? isEnd : false;
    //var actPercent = (this.tween) ? this.tween.currentTime / this.tween.totalDuration : 0;
    if (action == 'download') {
        var actPercent = Math.min(this.sp.configuration['dtCount'] * this.sp.configuration['resultsRefresh'] / this.sp.configuration['downloadTime'], 1);
    } else if (action == 'upload') {
        var actPercent = Math.min(this.sp.configuration['utCount'] * this.sp.configuration['resultsRefresh'] / this.sp.configuration['uploadTime'], 1);
    }
    var correction = 1;
    var shake = 0;

    this.progressCount++;

    if (actPercent < 0.1) {
        correction = actPercent / 0.1;
    } else {
        correction = 1;
    }

    switch (action) {
        case 'latency':
            this.gaugeStartAnimation();
            if (this.sp.results['latencyResult'] > -1) {
                shake = Math.random() * this.sp.results['jitterResult'];
                $('#fireprobe .ping-result .value-1').html(Math.round(this.sp.results['latencyResult'] + shake));
                $('#fireprobe .jitter-result .value-1').html(Math.round(this.sp.results['jitterResult']));
                $('#fireprobe .current-result .value-1').html(Math.round(this.sp.results['latencyResult'] + shake));
                $('#fireprobe .ping-result .value-2').html("ms");
                $('#fireprobe .jitter-result .value-2').html("ms");
                $('#fireprobe .current-result .value-2').html("ms");
                this.speedIndicatorMove(this.sp.results['latencyResult'], 0.5, 1);
            } else {
                $('#fireprobe .ping-result .value-1').html("...");
                $('#fireprobe .current-result .value-1').html("...");
            }

            if (isEnd) {
                thatg.gaugeConfig.endAngle = -120;
                if (this.sp.results['latencyResult'] > -1) {
                    $('#fireprobe .ping-result .value-1').html(Math.round(this.sp.results['latencyResult']));
                    $('#fireprobe .current-result .value-1').html(Math.round(this.sp.results['latencyResult']));
                    $('#fireprobe .jitter-result .value-1').html(Math.round(this.sp.results['jitterResult']));
                    $('#fireprobe .ping-result .value-2').html("ms");
                    $('#fireprobe .jitter-result .value-2').html("ms");
                } else {
                    $('#fireprobe .ping-result .value-1').html("n/a");
                    $('#fireprobe .current-result .value-1').html("n/a");
                    $('#fireprobe .jitter-result .value-1').html("n/a");
                    this.sp.sendEvent("error_latency");
                }
                this.sp.sendEvent("end_latency");
                this.tween = TweenLite.to($('#fireprobe .progress .progress-bar'), 1, {
                    css: {width: '0%'},
                    onComplete: this.gotoDownload
                });
            }
            break;
        case 'download':
            if (this.sp.results['downloadResult'] > -1) {
                var div = 1;
                var unt = "Mb/s";
                // if (this.sp.results['downloadResult'] >= 1000) {
                //     div = 1000;
                //     unt = "Gb/s";
                // }

                shake = Math.random() / 10;
                $('#fireprobe .download-result .value-1').html((this.sp.results['downloadResult'] / div * correction + shake).toFixed(2));
                $('#fireprobe .current-result .value-1').html((this.sp.results['downloadResult'] * correction + shake).toFixed(2));
                $('#fireprobe .download-result .value-2').html(unt);
                $('#fireprobe .current-result .value-2').html("Mb/s");
                if (this.sp.results['downloadResult'] > 0 && this.progressCount % 10 == 0) {
                    this.downloadChart.data.datasets[0].data.push((this.sp.results['downloadRawResult'] * correction).toFixed(2));
                    this.downloadChart.data.labels.push((this.sp.results['downloadRawResult'] * correction).toFixed(2));
                    this.downloadChart.update();
                }
                this.speedIndicatorMove(this.sp.results['downloadRawResult'] * correction, 0.5, this.sp.configuration['unit']);
            } else {
                $('#fireprobe .download-result .value-1').html("...");
                $('#fireprobe .current-result .value-1').html("...");
            }

            if (isEnd) {
                thatg.gaugeConfig.endAngle = -120;
                this.tween = TweenLite.to($('#fireprobe .progress .progress-bar'), 1, {
                    css: {width: '0%'},
                    onComplete: this.gotoUpload
                });
                if (this.sp.results['downloadResult'] > -1) {
                    var div = 1;
                    var unt = "Mb/s";
                    // if (this.sp.results['downloadResult'] >= 1000) {
                    //     div = 1000;
                    //     unt = "Gb/s";
                    // }
                    $('#fireprobe .download-result .value-1').html((this.sp.results['downloadResult'] / div).toFixed(2));
                    $('#fireprobe .download-result .value-2').html(unt);
                } else {
                    $('#fireprobe .current-result .value-1').html("n/a");
                    $('#fireprobe .download-result .value-1').html("n/a");
                    $('#fireprobe .download-result .value-2').html("");
                    this.sp.sendEvent("error_download");
                }
                this.sp.sendEvent("end_download");
            }
            break;
        case 'upload':
            if (this.sp.results['uploadResult'] > -1) {
                var div = 1;
                var unt = "Mb/s";
                // if (this.sp.results['uploadResult'] >= 1000) {
                //     div = 1000;
                //     unt = "Gb/s";
                // }

                shake = Math.random() / 10;
                $('#fireprobe .upload-result .value-1').html((this.sp.results['uploadResult'] / div * correction + shake).toFixed(2));
                $('#fireprobe .current-result .value-1').html((this.sp.results['uploadResult'] * correction + shake).toFixed(2));
                $('#fireprobe .upload-result .value-2').html(unt);
                $('#fireprobe .current-result .value-2').html("Mb/s");
                if (this.sp.results['uploadResult'] > 0 && this.progressCount % 10 == 0) {
                    this.uploadChart.data.datasets[0].data.push((this.sp.results['uploadRawResult'] * correction).toFixed(2));
                    this.uploadChart.data.labels.push((this.sp.results['uploadRawResult'] * correction).toFixed(2));
                    this.uploadChart.update();
                }
                this.speedIndicatorMove(this.sp.results['uploadRawResult'] * correction, 0.5, this.sp.configuration['unit']);
            } else {
                $('#fireprobe .upload-result .value-1').html("...");
                $('#fireprobe .current-result .value-1').html("...");
            }

            if (isEnd) {
                this.gaugeConfig.endAngle = -120;
                this.tween = TweenLite.to($('#fireprobe .progress .progress-bar'), 1, {
                    css: {width: '0%'},
                    onComplete: this.gotoResults
                });
                if (this.sp.results['uploadResult'] > -1) {
                    var div = 1;
                    var unt = "Mb/s";
                    // if (this.sp.results['uploadResult'] >= 1000) {
                    //     div = 1000;
                    //     unt = "Gb/s";
                    // }
                    $('#fireprobe .upload-result .value-1').html((this.sp.results['uploadResult'] / div).toFixed(2));
                    $('#fireprobe .upload-result .value-2').html(unt);
                } else {
                    $('#fireprobe .current-result .value-1').html("n/a");
                    $('#fireprobe .upload-result .value-1').html("n/a");
                    $('#fireprobe .upload-result .value-2').html("");
                    this.sp.sendEvent("error_upload");
                }
                this.sp.sendEvent("end_upload");
            }
            break;
    }
};
fireProbeGraphic.prototype.showError = function () {
    $("#fireprobe #restart").hide();
    $("#fireprobe .error-wrapper").show();
};
fireProbeGraphic.prototype.gotoDownload = function () {
    this.initPhase('download');
};
fireProbeGraphic.prototype.gotoUpload = function () {
    this.initPhase('upload');
};
fireProbeGraphic.prototype.gotoResults = function () {
    this.initPhase('results');
};
fireProbeGraphic.prototype.resultsLoaded = function () {
};
fireProbeGraphic.prototype.speedIndicatorMove = function (speed, time, unit) {
    var blockAngle = 30;
    var blockScale = unit;
    var angle = 0;
    var block = 0;

    speed = speed / unit;

    if (speed <= 5) {
        angle = Math.round((speed - 2) / (5 - 2) * blockAngle) + 0 * blockAngle;
    } else if (speed <= 10) {
        angle = Math.round((speed - 5) / (10 - 5) * blockAngle) + 1 * blockAngle;
    } else if (speed <= 25) {
        angle = Math.round((speed - 10) / (25 - 10) * blockAngle) + 2 * blockAngle;
    } else if (speed <= 50) {
        angle = Math.round((speed - 25) / (50 - 25) * blockAngle) + 3 * blockAngle;
    } else if (speed <= 100) {
        angle = Math.round((speed - 50) / (100 - 50) * blockAngle) + 4 * blockAngle;
    } else if (speed <= 250) {
        angle = Math.round((speed - 100) / (250 - 100) * blockAngle) + 5 * blockAngle;
    } else if (speed <= 500) {
        angle = Math.round((speed - 250) / (500 - 250) * blockAngle) + 6 * blockAngle;
    } else if (speed <= 1000) {
        angle = Math.round((speed - 500) / (1000 - 500) * blockAngle) + 7 * blockAngle;
    } else {
        angle = 240;
    }

    if (isNaN(angle)) angle = 0;
    if (angle < 0) angle = 0;
    if (angle > 240) angle = 240;

    if (angle > 2) angle += -2 + Math.random() * 4;
    angle = -120 + angle;

    if (angle < -120) angle = -120;
    if (angle > 120) angle = 120;

    this.gaugeConfig.endAngle = angle;
};
fireProbeGraphic.prototype.getSummaryScore = function (type) {
    var val = 1;

    switch (type) {
        case 1:
            if (this.sp.results.downloadWeightedResult < 300)
                val = 1;
            else if (this.sp.results.downloadWeightedResult >= 300 && this.sp.results.downloadWeightedResult < 1000)
                val = 2;
            else if (this.sp.results.downloadWeightedResult >= 1000 && this.sp.results.downloadWeightedResult < 2000)
                val = 3;
            else if (this.sp.results.downloadWeightedResult >= 2000 && this.sp.results.downloadWeightedResult < 6000)
                val = 4;
            else if (this.sp.results.downloadWeightedResult >= 6000)
                val = 5;
            break;

        case 2:
            if (this.sp.results.downloadWeightedResult < 300)
                val = 1;
            else if (this.sp.results.downloadWeightedResult >= 300 && this.sp.results.downloadWeightedResult < 1000)
                val = 2;
            else if (this.sp.results.downloadWeightedResult >= 1000 && this.sp.results.downloadWeightedResult < 2000)
                val = 3;
            else if (this.sp.results.downloadWeightedResult >= 2000 && this.sp.results.downloadWeightedResult < 6000)
                val = 4;
            else if (this.sp.results.downloadWeightedResult >= 6000)
                val = 5;
            break;

        case 3:
            if (this.sp.results.downloadWeightedResult < 1000)
                val = 1;
            else if (this.sp.results.downloadWeightedResult >= 1000 && this.sp.results.downloadWeightedResult < 2000)
                val = 2;
            else if (this.sp.results.downloadWeightedResult >= 2000 && this.sp.results.downloadWeightedResult < 4000)
                val = 3;
            else if (this.sp.results.downloadWeightedResult >= 4000 && this.sp.results.downloadWeightedResult < 6000)
                val = 4;
            else if (this.sp.results.downloadWeightedResult >= 6000)
                val = 5;
            break;

        case 4:
            if (this.sp.results.downloadWeightedResult >= 100 && this.sp.results.uploadWeightedResult >= 100) {
                if (this.sp.results.latencyResult < 50)
                    val = 5;
                else if (this.sp.results.latencyResult < 100)
                    val = 4;
                else if (this.sp.results.latencyResult < 200)
                    val = 3;
                else if (this.sp.results.latencyResult < 300)
                    val = 2;
                else
                    val = 1;
            } else if (this.sp.results.downloadWeightedResult >= 30 && this.sp.results.uploadWeightedResult >= 30) {
                if (this.sp.results.latencyResult < 20)
                    val = 5;
                else if (this.sp.results.latencyResult < 60)
                    val = 4;
                else if (this.sp.results.latencyResult < 100)
                    val = 3;
                else if (this.sp.results.latencyResult < 200)
                    val = 2;
                else
                    val = 1;
            } else {
                val = 1;
            }
            break;

        case 5:
            if (this.sp.results.downloadWeightedResult >= 2000 && this.sp.results.uploadWeightedResult >= 2000) {
                if (this.sp.results.latencyResult < 30 && this.sp.results.jitterResult < 10)
                    val = 5;
                else if (this.sp.results.latencyResult < 60 && this.sp.results.jitterResult < 10)
                    val = 4;
                else if (this.sp.results.latencyResult < 100 && this.sp.results.jitterResult < 20)
                    val = 3;
                else if (this.sp.results.latencyResult < 200 && this.sp.results.jitterResult < 50)
                    val = 2;
                else
                    val = 1;
            } else if (this.sp.results.downloadWeightedResult >= 1000 && this.sp.results.uploadWeightedResult >= 500) {
                if (this.sp.results.latencyResult < 20 && this.sp.results.jitterResult < 10)
                    val = 5;
                else if (this.sp.results.latencyResult < 40 && this.sp.results.jitterResult < 10)
                    val = 4;
                else if (this.sp.results.latencyResult < 60 && this.sp.results.jitterResult < 20)
                    val = 3;
                else if (this.sp.results.latencyResult < 80 && this.sp.results.jitterResult < 20)
                    val = 2;
                else
                    val = 1;
            } else {
                val = 1;
            }
            break;
    }

    return val;
};