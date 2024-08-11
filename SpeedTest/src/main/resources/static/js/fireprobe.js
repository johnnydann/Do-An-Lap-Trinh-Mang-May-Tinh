/*
 *  FireProbeAPP
 */
var fireProbeApp = function (gatewayUrl, app, DEBUG_LEVEL) {

    that = this;
    _.bindAll(this);

    this.uploadData = [];
    var updc = "hwRgD7y5CmxOXLPiQQT8kqemDuY7wgfI6AT3dTWUARjQKbG7CEZrFuGX5EhWp71HThlU7Vgz9LrdTEN68Iy78TtAREM4GXmJUZNnJx5OyoAe4wwgBVyHQO7X8H0T4yuFQySTy41hcEmfZ5OPAgOchlvt60M5jdEpnpUkEC4CqQmooWizCOmCNX40uKOoBKueCsECGvw50S4zXM4FUNdEQ2pfwOZo0x8dmOwfQxUnkfttmPyT94K7U1T6uQfq5GnUh3FFk4oaxCIx1uOeA2CjK8ykzcd4s5FtA5HpGQilZVeQJDT10xwIPoUG38b4E26KUZQihQxA0nNouBC3XT8YcPRZvhePSNUWC3x6TykPqdxEkxYNNHA6gh9obFNueRfzbz7Ec1kY0PCmCfVoYaT7nn3AE9zL6abWpJgVJMMSlScHTzyOHy5MymZxPAwGVyY8fZnFyhaqy25xS8YflSLJH1CHunx7zQmxi5DZepeMzZOi80Piac2aLF0kJwQgqHHcDQqOAO6pdZ6lcS552RL5KFFQFrUDd2n2F9g3PII8gJyEKacwEraHW7HtLuPGeHzy6675wLe60uOtIjTrWtlNHkVnZYTv20SssLcKnU6fLiDeVoGqcjdFRhjG4GOb4WnqWTGEjpLoCB98rK9SKppi6a3IzyT4ZFphLemfhq0juejtcgvA35U6Y0JYOzknFIYJA89Ffvcok2amcAQ9wokmKJNHR5e58jVpbEGOecz0GrqX9xX8MjkyTnUMINFxncPNem17k5Ce1THm2WWu7OJb2wrJAzMpbaJ4QrnNoA8AmzOJWam7jaiZvBzESixQkoFcPCSbkyp7FA6wrFteGwezfD03JIKLETTme7LfBh3MUhmiKMTtYrqfEB4arGPJNQZdVMbFrTtMfT5f4aN7Mu55qVCJKXRq5slR1uPo0fDkK8OTEEq6XpT7XSHBVUFVYbvmL0ffhUEdhOtv58vppFwYYHkZfLuRP8tvjtNLdOjOKhg4Rkz1iNDN7WdxUzoF0MWB";
    for (i = 0; i < 16; i++) {
        updc += updc;
        if (i > 2) {
            this.uploadData.push(new Blob([updc + "uploadend"]));
        }
    }

    this.configuration = {};
    this.results = {};
    this.currentMethods = [];
    this.postdata = null;
    this.configuration['tls'] = location.protocol == 'https:' ? 1 : 0;
    this.configuration['gatewayUrl'] = typeof gatewayUrl !== 'undefined' ? gatewayUrl : null;
    this.configuration['url'] = [];
    this.configuration['url']['stats'] = 'https://stats.v-speed.eu/api/gateway';
    this.configuration['url']['web'] = 'https://web.v-speed.eu/api/gateway';
    this.configuration['url']['speedtestpl'] = 'https://www.speedtest.pl/api/gateway';
    this.configuration['hashkey'] = "7B5E9kw)Q9x6}H9fntV]DexRn_![kjMR";

    this.configuration['app'] = app;
    this.DEBUG_LEVEL = typeof DEBUG_LEVEL !== 'undefined' ? DEBUG_LEVEL : logger.ERROR;
    this.log = new logger('APP', this.DEBUG_LEVEL);

    this.configuration['fingerprint'] = null;
    if (window.requestIdleCallback) {
        requestIdleCallback(function () {
            Fingerprint2.get(function (components) {
                that.configuration['fingerprint'] = that.processFingerprint(components);
            })
        })
    } else {
        setTimeout(function () {
            Fingerprint2.get(function (components) {
                that.configuration['fingerprint'] = that.processFingerprint(components);
            })
        }, 500)
    }

    if (utils.getCookie('fpsess')) {
        this.configuration['session'] = utils.getCookie('fpsess');
    } else {
        this.configuration['session'] = CryptoJS.MD5(Math.random().toString()).toString();
        utils.setCookie('fpsess', this.configuration['session'], 1095);
    }
    that.log.info('Session: ' + this.configuration['session']);

    this.currentMethods['latency'] = [];
    this.currentMethods['download'] = [];
    this.currentMethods['upload'] = [];

    this.checkServers = {};
    this.checkServersList = {};
    this.checkServers = [];
    this.configuration['cs'] = null;
    this.configuration['csc'] = 0;
    this.configuration['key'] = "";
    this.configuration['colors'] = "";
    this.configuration['mobile'] = "";
    this.configuration['connection'] = 1;
    this.configuration['redirect'] = 0;
    this.configuration['sort'] = 0;

    this.configuration['servers_optimal'] = [];
    this.configuration['servers_optimal_enabled'] = true;
    this.configuration['serverscount'] = 4;

    this.configuration['stats'] = {};
    this.configuration['translation'] = {};
    this.configuration['port'] = null;

    this.configuration['sm'] = null;
    this.configuration['smcv'] = [];
    this.configuration['smg'] = null;

    this.scriptVersion = 200;
    this.jscd = utils.jscd();

    // threads
    this.configuration['downloadMaxThreads'] = 16;
    this.configuration['downloadDefaultThreads'] = 2;
    this.configuration['uploadMaxThreads'] = 16;
    this.configuration['uploadDefaultThreads'] = 2;

    // upload legacy
    this.configuration['uploadLegacyMaxPacketSize'] = 1024;
    this.configuration['uploadLegacyMaxPacketTime'] = 1000;

    // other configuration
    this.configuration['manualServerSelect'] = true;
    this.configuration['serversGroup'] = null;
    this.configuration['posturl'] = null;
    this.configuration['servers'] = [];
    this.configuration['serversvalid'] = [];
    this.configuration['latencyTime'] = 5;
    this.configuration['latencyThreads'] = 1;
    this.configuration['latencyServersRun'] = 0;
    this.configuration['latencyTestMaxCount'] = 10;
    this.configuration['lt'] = null;
    this.configuration['lrt'] = null;
    this.configuration['ltCount'] = 0;
    this.configuration['downloadTime'] = 20;
    this.configuration['downloadStartThread'] = 0;
    this.configuration['downloadThreads'] = 1;
    this.configuration['downloadRatio'] = 5;
    this.configuration['downloadTimeMax'] = 0;
    this.configuration['downloadTimeCurrent'] = 0;
    this.configuration['downloadIntervalTime'] = 0.1;
    this.configuration['downloadMaxPacketSize'] = 1024;
    this.configuration['downloadMaxPacketTime'] = 500;
    this.configuration['downloadDefaultPacketCount'] = 1;
    this.configuration['dt'] = null;
    this.configuration['rdt'] = null;
    this.configuration['dtCount'] = 0;
    this.configuration['uploadTime'] = 20;
    this.configuration['uploadStartThread'] = 0;
    this.configuration['uploadThreads'] = 1;
    this.configuration['uploadRatio'] = 5;
    this.configuration['uploadTimeMax'] = 0;
    this.configuration['uploadTimeCurrent'] = 0;
    this.configuration['uploadIntervalTime'] = 0.1;
    this.configuration['uploadMaxPacketSize'] = 1024;
    this.configuration['uploadMaxPacketTime'] = 500;
    this.configuration['uploadDefaultPacketCount'] = 1;
    this.configuration['ut'] = null;
    this.configuration['rut'] = null;
    this.configuration['utCount'] = 0;
    this.configuration['unit'] = 1000;
    this.configuration['imageSharingBBCode'] = '';
    this.configuration['imageSharingUrl'] = '';
    this.configuration['fbSharingUrl'] = '';
    this.configuration['googleSharingUrl'] = '';
    this.configuration['twitterSharingUrl'] = '';
    this.configuration['advPath'] = '';
    this.configuration['advUrl'] = '';

    this.configuration['l_vote_isp'] = '';
    this.configuration['l_vote_thanks'] = '';

    this.configuration['calculationWeight'] = 0.25;
    this.configuration['bytesArrayDownload'] = new Array();
    this.configuration['bytesArrayUpload'] = new Array();
    this.configuration['weightedThreshold'] = 0 * 1000;

    this.configuration['method_latency'] = 'ws';
    this.configuration['method_download'] = 'http';
    this.configuration['method_upload'] = 'http';

    this.configuration['resultsRefresh'] = 0.25;
    this.configuration['resultsDisplayRefresh'] = 0.05;
    this.configuration['download_size'] = 250;

    switch (this.jscd.browser) {
        case 'Safari':
            this.configuration['download_size'] = 50;
            break;
        case 'IE':
            this.configuration['download_size'] = 25;
            break;
    }

    this.results['latencyResult'] = 0;
    this.results['jitterResult'] = 0;
    this.results['latencyTimes'] = new Array;
    this.results['latencyAverageResult'] = 0;
    this.results['latencyPartialResult'] = new Array;
    this.results['downloadResult'] = 0;
    this.results['downloadRawResult'] = 0;
    this.results['downloadWeightedResult'] = 0;
    this.results['downloadResultPrev'] = 0;
    this.results['downloadResultPrevSpeed'] = 0;
    this.results['downloadRunningThreads'] = 0;
    this.results['downloadReceivedKbytes'] = 0;
    this.results['uploadResult'] = 0;
    this.results['uploadRawResult'] = 0;
    this.results['uploadWeightedResult'] = 0;
    this.results['uploadResultPrev'] = 0;
    this.results['uploadResultPrevSpeed'] = 0;
    this.results['uploadRunningThreads'] = 0;
    this.results['uploadSendKbytes'] = 0;
    this.results['ip'] = '';
    this.results['isp'] = '';
    this.results['org'] = '';
    this.results['resultId'] = null;
    this.results['resultIdS'] = null;
    this.results['startTimestamp'] = null;

    this.results['startDownloadTime'] = null;
    this.results['startUploadTime'] = null;

    this.results['longitude'] = null;
    this.results['latitude'] = null;
    this.results['accuracy'] = null;
    this.results['coordinates_mode'] = null;

    this.results['proxy'] = 0;
    this.results['saved'] = 0;

    this.byteSamples = [];
    this.timeSamples = [];
    this.speedSamples = [];
    this.lastBytes = 0;
    this.globalBytes = 0;

};

fireProbeApp.prototype.setLocale = function (locale) {
    this.configuration['locale'] = locale;
};

fireProbeApp.prototype.initialize = function () {
    this.log.info('Initializing APP');
    this.log.info('Browser: ' + this.jscd.browser + ', Version: ' + this.jscd.browserMajorVersion + ', Os: ' + this.jscd.os + ', OsVersion: ' + this.jscd.osVersion + ', Mobile: ' + this.jscd.mobile);

    if (!this.configuration['gatewayUrl']) {
        this.log.error('No gateway url provided!');
    } else {
        this.configuration['downloadThreads'] = this.configuration['downloadDefaultThreads'];
        this.configuration['downloadStartThread'] = 0;
        this.configuration['uploadThreads'] = this.configuration['uploadDefaultThreads'];
        this.configuration['uploadStartThread'] = 0;

        //this.checkLocation();
        this.loadConfiguration();
    }
};
fireProbeApp.prototype.initializeGraphic = function () {
    this.spg.initialize();
    this.sendEvent("graphics_loaded");
};
fireProbeApp.prototype.sendEvent = function (name) {
    if (typeof fireProbeEvent === 'function') {
        fireProbeEvent(name);
    }
};
fireProbeApp.prototype.processFingerprint = function (components) {
    var fp = Fingerprint2.x64hash128(components.map(function (pair) {
        return pair.value
    }).join(), 31);
    this.log.info('Fingerprint: ' + fp);
    return fp;
};
fireProbeApp.prototype.startCheckServers = function () {
    this.log.info('Checking servers...');

    var key = null;

    function getDistanceFromLatLonInKm(lat1, lon1, lat2, lon2) {
        var R = 6371; // Radius of the earth in km
        var dLat = deg2rad(lat2 - lat1);  // deg2rad below
        var dLon = deg2rad(lon2 - lon1);
        var a =
            Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
            Math.sin(dLon / 2) * Math.sin(dLon / 2)
        ;
        var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        var d = R * c; // Distance in km
        return d;
    }

    function deg2rad(deg) {
        return deg * (Math.PI / 180)
    }

    if (this.results['lat'] != null && this.results['lon'] != null) {
        var server_lat, server_lon;
        var distances = new Array();
        for (var i in this.configuration.servers) {
            server_lat = this.configuration.servers[i]['latitude'] / 10000000;
            server_lon = this.configuration.servers[i]['longitude'] / 10000000;

            distance = getDistanceFromLatLonInKm(this.results['lat'], this.results['lon'], server_lat, server_lon);
            this.configuration.servers[i]['distance'] = distance;
            //console.log("host: " + this.configuration.servers[i]['host'] + ", distance " + Math.round(this.configuration.servers[i]['distance']) + " km");
        }

        for (var i in this.configuration.servers) {
            //console.log("host: " + this.configuration.servers[i]['host'] + ", distance " + Math.round(this.configuration.servers[i]['distance']) + " km");
        }

        ci = 0;
        cj = 0;
        for (var i in this.configuration.servers) {
            min = i;
            ci++;
            for (var j in this.configuration.servers) {
                cj++;
                if (cj > ci) {
                    if (this.configuration.servers[j]['distance'] < this.configuration.servers[min]['distance']) {
                        min = j;

                    }
                }
            }
            cj = 0;
            server = new Array();
            server = this.configuration.servers[i];
            this.configuration.servers[i] = this.configuration.servers[min];
            this.configuration.servers[min] = server;
        }
    }

    index = 0;
    //check if some servers are assigned to ip class and move them to the beginning of the list
    for (var i in this.configuration.servers) {
        assign = this.configuration.servers[i]['assign'];
        if (assign != null && assign == 1) {
            serv = this.configuration.servers[i];
            this.configuration.servers.splice(i, 1);
            this.configuration.servers.splice(index, 0, serv);
            index++;
        }
    }

    var csc = 0;
    for (key in this.configuration.servers) {
        if (key !== 'undefined') {
            this.checkServersList[this.configuration.servers[key].host] = {
                key: key,
                port: this.configuration.servers[key].port,
                pr: this.configuration.servers[key].pr,
                legacy: this.configuration.servers[key].legacy
            }
            csc++;
        }
        if (csc >= 10) {
            break;
        }
    }

    for (key in this.checkServersList) {
        if (key !== 'undefined') {
            switch (this.configuration['method_latency']) {
                case 'http':
                    this.checkServers[key] = new latencyMethodHttp(0, key, this.checkServersList[key].port, this.checkServersList[key].pr, 10);
                    break;
                default:
                    this.checkServers[key] = new latencyMethodWebSocket(0, key, this.checkServersList[key].port, this.checkServersList[key].pr, 10);
            }
            this.checkServers[key].startTest();
        }
    }

    setTimeout(this.finishCheckServers, 3000);

};
fireProbeApp.prototype.finishCheckServers = function () {

    for (key in this.checkServersList) {
        if (this.checkServers[key].getLatency() == -1) {
            this.configuration.servers.splice(this.checkServersList[key].key, 1);
        } else if (typeof this.configuration.servers[this.checkServersList[key].key] !== 'undefined') {
            this.configuration.servers[this.checkServersList[key].key]['time'] = this.checkServers[key].getLatency();
        }
    }

    if (this.configuration.sort == 1) {
        var items = 10;
        var min;
        var index;

        for (i = 0; i < items && i < this.configuration.servers.length; i++) {
            min = this.configuration.servers[i]['time'];
            index = i;
            for (j = i; j < items && j < this.configuration.servers.length; j++) {
                if (this.configuration.servers[j]['time'] < min) {
                    min = this.configuration.servers[j]['time'];
                    index = j;
                }
            }
            var temp = this.configuration.servers[i];
            this.configuration.servers[i] = this.configuration.servers[index];
            this.configuration.servers[index] = temp;
        }
    }

    index = 0;
    //check if some servers are assigned to ip class and move them to the beginning of the list
    for (var i in this.configuration.servers) {
        assign = this.configuration.servers[i]['assign'];
        if (assign != null && assign == 1) {
            serv = this.configuration.servers[i];
            this.configuration.servers.splice(i, 1);
            this.configuration.servers.splice(index, 0, serv);
            index++;
        }
    }

    this.configuration['serversvalid'] = this.configuration['servers'];
    this.configuration['servers'] = [];
    if (this.configuration['serversvalid'].length <= this.configuration['serverscount']) {
        this.configuration['servers_optimal'] = this.configuration['serversvalid'];
    } else {
        for (i = 0; i < this.configuration['serverscount']; i++) {
            this.configuration['servers_optimal'].push(this.configuration['serversvalid'][i]);
        }
    }

    if (this.configuration.multi > 1) {
        this.configuration['servers'] = this.configuration['servers_optimal'];
        this.configuration['servers_optimal_enabled'] = true;
    } else {
        this.configuration['servers'][0] = this.configuration['serversvalid'][0];
    }

    this.checkServers['websocket'] = {};
    this.checkServers['legacy'] = {};
    this.checkServersList = {};
    this.log.info('Servers checked.');
    $('body').trigger('fireprobe_configuration_changed', [this.configuration]);
    this.initializeGraphic();

};
fireProbeApp.prototype.checkLocation = function () {
    var options = {
        enableHighAccuracy: true,
        timeout: 30000,
        maximumAge: 0
    };
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(this.foundLocation, this.errorLocation, options);
    }
};
fireProbeApp.prototype.foundLocation = function (pos) {
    var crd = pos.coords;
    this.log.info('Location details: ' + 'latitude : ' + crd.latitude + ', longitude: ' + crd.longitude + ', accuracy: ' + crd.accuracy);
    this.results['longitude'] = crd.longitude;
    this.results['latitude'] = crd.latitude;
    this.results['accuracy'] = crd.accuracy;
    this.results['coordinates_mode'] = 100;
};
fireProbeApp.prototype.errorLocation = function (err) {
    this.log.debug('ERROR(' + err.code + '): ' + err.message);
};
fireProbeApp.prototype.setServer = function (serverId) {
    this.log.info('Setting new server for tests.');
    that.sendEvent("set_server");

    this.configuration['servers'] = [];
    if (serverId == 999999) {
        this.configuration['servers'] = this.configuration['servers_optimal'];
        this.configuration['servers_optimal_enabled'] = true;
    } else {
        this.configuration['servers'].push(this.configuration['serversvalid'][serverId]);
        this.configuration['servers_optimal_enabled'] = false;
    }

    $('body').trigger('fireprobe_configuration_changed', [this.configuration]);
};
fireProbeApp.prototype.loadConfiguration = function () {
    this.log.info('Loading configuration...');

    $.ajax({
        type: 'POST',
        dataType: 'json',
        url: this.configuration['gatewayUrl'],
        cache: false,
        processData: true,
        data: {
            action: 'init',
            app: this.configuration['app'],
            locale: this.configuration['locale'],
            ssl: location.protocol == 'https:' ? 1 : 0
        },
        error: this.evtLoadConfigError,
        success: this.evtLoadConfigSuccess
    });
};
fireProbeApp.prototype.evtLoadConfigError = function () {
    this.log.error('Cannot load configuration!');
};
fireProbeApp.prototype.evtLoadConfigSuccess = function (cfg) {

    if (cfg.status == 'ok') {

        this.configuration['latencyTime'] = cfg.latencyTime;
        this.configuration['latencyTestMaxCount'] = cfg.latencyTestMaxCount;
        this.configuration['downloadTime'] = cfg.downloadTime;
        this.configuration['uploadTime'] = cfg.uploadTime;

        // this.configuration['latencyTime'] = 3;
        // this.configuration['downloadTime'] = 15;
        // this.configuration['uploadTime'] = 15;

        this.configuration['unit'] = cfg.unit;
        this.configuration['servers'] = cfg.servers;
        // that.configuration['servers'].push({
        //     city: "WrocĹaw",
        //     host: 'lab.fireinfra.net',
        //     id: 999999,
        //     latitude: 51.102090,
        //     longitude: 16.942748,
        //     name: "FIREPROBE LAB",
        //     port: 9114,
        //     pr: 'wss',
        //     assign: 999999
        // });
        // that.configuration['servers'].push({
        //     city: "WrocĹaw",
        //     host: 'lab2.fireinfra.net',
        //     id: 999999,
        //     latitude: 51.102090,
        //     longitude: 16.942748,
        //     name: "FIREPROBE LAB 2",
        //     port: 9114,
        //     pr: 'wss',
        //     assign: 999999
        // });
        // that.configuration['servers'].push({
        //     city: "WrocĹaw",
        //     host: 'lab3.fireinfra.net',
        //     id: 999999,
        //     latitude: 51.102090,
        //     longitude: 16.942748,
        //     name: "FIREPROBE LAB 3",
        //     port: 9114,
        //     pr: 'wss',
        //     assign: 999999
        // });
        // that.configuration['servers'].push({
        //     city: "WrocĹaw",
        //     host: 'lab4.fireinfra.net',
        //     id: 999999,
        //     latitude: 51.102090,
        //     longitude: 16.942748,
        //     name: "FIREPROBE LAB 4",
        //     port: 9114,
        //     pr: 'wss',
        //     assign: 999999
        // });
        this.configuration['l_vote_isp'] = cfg.l_vote_isp;
        this.configuration['l_vote_thanks'] = cfg.l_vote_thanks;
        this.configuration['serversGroup'] = cfg.serversGroup;

        this.configuration['posturl'] = cfg.posturl;
        this.configuration['key'] = cfg.key;
        this.configuration['colors'] = cfg.colors;
        this.configuration['mobile'] = cfg.mobile;
        this.configuration['stats'] = cfg.stats;
        this.configuration['translation'] = cfg.translation;
        this.configuration['redirect'] = cfg.redirect;
        this.configuration['sort'] = cfg.sort;
        this.configuration['port'] = cfg.port;

        this.configuration['sm'] = cfg.sm;
        this.configuration['smcv'] = cfg.smcv;

        if (this.configuration['sm']) {
            if (Object.keys(this.configuration['smcv']).length > 0) {
                if (typeof fpCustom != 'undefined' && fpCustom) {
                    var smg = true;
                    var jp = JSON.parse(fpCustom);
                    for (var k in this.configuration['smcv']) {
                        if (this.configuration['smcv'][k]) {
                            if (typeof jp[k] != 'undefined') {
                                if (this.configuration['smcv'][k] != jp[k]) {
                                    smg = false;
                                }
                            } else {
                                smg = false;
                            }
                        } else {
                            if (typeof jp[k] == 'undefined') {
                                smg = false;
                            }
                        }
                    }
                    ;
                    this.configuration['smg'] = smg;
                } else {
                    this.configuration['smg'] = false;
                }
            } else {
                this.configuration['smg'] = true;
            }
        } else {
            this.configuration['smg'] = false;
        }

        if (this.configuration['smg']) {
            this.log.info('Enabling Service Mode...');
        }

        this.configuration['connection'] = cfg.connection;
        this.configuration['manualServerSelect'] = cfg['manual-server-select'];

        this.configuration['multi'] = cfg.multi;
        this.configuration['serverscount'] = this.configuration['multi'];

        this.results['ip'] = cfg.ip;
        this.results['isp'] = cfg.isp;
        this.results['org'] = cfg.org;
        this.results['lon'] = this.results['longitude'] = cfg.lon;
        this.results['lat'] = this.results['latitude'] = cfg.lat;
        this.results['accuracy'] = cfg.acc;
        this.results['coordinates_mode'] = 0;
        this.results['proxy'] = cfg.proxy;

        this.configuration['imageSharingBBCode'] = utils.replaceAll(utils.replaceAll(cfg.bbcodeurl, '\*\[amp\]\*', '&'), '\*\[eq\]\*', '=');
        this.configuration['imageSharingUrl'] = utils.replaceAll(utils.replaceAll(cfg.resultimg, '\*\[amp\]\*', '&'), '\*\[eq\]\*', '=');
        this.configuration['fbSharingUrl'] = utils.replaceAll(utils.replaceAll(cfg.fbsharer, '\*\[amp\]\*', '&'), '\*\[eq\]\*', '=');
        this.configuration['googleSharingUrl'] = utils.replaceAll(utils.replaceAll(cfg.gsharer, '\*\[amp\]\*', '&'), '\*\[eq\]\*', '=');
        this.configuration['twitterSharingUrl'] = utils.replaceAll(utils.replaceAll(cfg.tsharer, '\*\[amp\]\*', '&'), '\*\[eq\]\*', '=');

        switch (this.configuration['connection']) {
            case '2':
                this.configuration['method_latency'] = this.configuration['method_download'] = this.configuration['method_upload'] = 'ws';
                break;
            case '3':
                this.configuration['method_latency'] = this.configuration['method_download'] = this.configuration['method_upload'] = 'http';
                break;
        }
        this.log.info('Test method: ' + this.configuration['method_latency'] + " / " + this.configuration['method_download'] + " / " + this.configuration['method_upload']);

        this.spg = new fireProbeGraphic(this, this.DEBUG_LEVEL);

        this.sendEvent("config_loaded");
        this.startCheckServers();

    } else {
        this.log.error('Cannot load configuration!');
    }
};

fireProbeApp.prototype.start = function () {
    this.log.info('Starting speedtest');
    this.sendEvent("start_test");
    this.log.info('Browser: ' + this.jscd.browser + ', Version: ' + this.jscd.browserMajorVersion + ', Os: ' + this.jscd.os + ', OsVersion: ' + this.jscd.osVersion + ', Mobile: ' + this.jscd.mobile);

    this.configuration['ltCount'] = 0;
    this.configuration['dtCount'] = 0;
    this.configuration['utCount'] = 0;

    this.configuration['latencyServersRun'] = 0;
    this.configuration['downloadStartThread'] = 0;
    this.configuration['downloadThreads'] = this.configuration['downloadDefaultThreads'];
    this.configuration['uploadStartThread'] = 0;
    this.configuration['uploadThreads'] = this.configuration['uploadDefaultThreads'];

    this.results['latencyResult'] = -1;
    this.results['latencyAverageResult'] = -1;
    this.results['latencyPartialResult'] = new Array;
    this.results['downloadResult'] = -1;
    this.results['downloadRawResult'] = -1;
    this.results['downloadWeightedResult'] = -1;
    this.results['downloadResultPrev'] = 0;
    this.results['downloadResultPrevSpeed'] = 0;
    this.results['downloadRunningThreads'] = 0;
    this.results['downloadReceivedKbytes'] = 0;
    this.results['uploadResult'] = -1;
    this.results['uploadRawResult'] = -1;
    this.results['uploadWeightedResult'] = -1;
    this.results['uploadResultPrev'] = 0;
    this.results['uploadResultPrevSpeed'] = 0;
    this.results['uploadRunningThreads'] = 0;
    this.results['uploadSendKbytes'] = 0;
    this.results['startTimestamp'] = Math.floor($.now() / 1000);

    this.results['saved'] = 0;

    this.configuration['bytesArrayDownload'] = new Array();
    this.configuration['bytesArrayUpload'] = new Array();

    this.spg.initPhase('latency');
};
fireProbeApp.prototype.graphicResponse = function (action) {
    switch (action) {
        case 'latency':
            this.log.debug('Graphic said latency is ready.');
            this.log.info('Starting latency test...');
            this.configuration['lt'] = setInterval(this.latencyProgress, this.configuration['resultsRefresh'] * 1000);
            this.configuration['rlt'] = setInterval(this.latencyRefresh, this.configuration['resultsDisplayRefresh'] * 1000);
            this.startLatency();
            break;
        case 'download':
            this.log.debug('Graphic said download is ready.');
            this.log.info('Starting download test (' + this.configuration['downloadDefaultThreads'] + ' threads)...');
            this.configuration['downloadTimeMax'] = this.configuration['downloadTime'] / this.configuration['downloadIntervalTime'];
            this.configuration['dt'] = setInterval(this.downloadProgress, this.configuration['resultsRefresh'] * 1000);
            this.configuration['rdt'] = setInterval(this.downloadRefresh, this.configuration['resultsDisplayRefresh'] * 1000);
            this.byteSamples = [];
            this.timeSamples = [];
            this.speedSamples = [];
            this.lastBytes = 0;
            this.globalBytes = 0;
            this.startDownload();
            break;
        case 'upload':
            this.log.debug('Graphic said upload is ready.')
            this.log.info('Starting upload test (' + this.configuration['uploadDefaultThreads'] + ' threads)...');
            this.configuration['uploadTimeMax'] = this.configuration['uploadTime'] / this.configuration['uploadIntervalTime'];
            this.configuration['ut'] = setInterval(this.uploadProgress, this.configuration['resultsRefresh'] * 1000);
            this.configuration['rut'] = setInterval(this.uploadRefresh, this.configuration['resultsDisplayRefresh'] * 1000);
            this.byteSamples = [];
            this.timeSamples = [];
            this.speedSamples = [];
            this.lastBytes = 0;
            this.globalBytes = 0;
            this.startUpload();
            break;
        case 'results':
            this.log.debug('Graphic said results are ready.')
            this.log.info('Setting results...');
            this.uploadResults();
            break;
    }
    ;
};

fireProbeApp.prototype.startLatency = function () {
    for (var i in this.configuration.servers) {
        switch (this.configuration['method_latency']) {
            case 'http':
                this.currentMethods.latency[i] = new latencyMethodHttp(i, this.configuration.servers[i].host, this.configuration.servers[i].port, this.configuration.servers[i].pr, 20);
                break;
            default:
                this.currentMethods.latency[i] = new latencyMethodWebSocket(i, this.configuration.servers[i].host, this.configuration.servers[i].port, this.configuration.servers[i].pr, 20);
                break;
        }
        this.currentMethods.latency[i].startTest();
    }
};
fireProbeApp.prototype.latencyRefresh = function () {
    this.spg.showProgress('latency');
};
fireProbeApp.prototype.latencyProgress = function () {

    this.configuration['ltCount']++;
    var latencyResults = [];
    var jitterResults = [];
    var latencyFinished = true;

    for (var i in this.currentMethods.latency) {
        if (this.currentMethods.latency[i] && this.currentMethods.latency[i].getIsRunning()) {
            latencyResults[i] = this.currentMethods.latency[i].getLatency();
            jitterResults[i] = this.currentMethods.latency[i].getJitter();
        }
        if (this.currentMethods.latency[i] && this.currentMethods.latency[i].getTestCount() < 20) {
            latencyFinished = false;
        }
    }

    if (latencyResults.length) {
        this.results['latencyResult'] = utils.calculateMinFromArray(latencyResults);
    } else {
        this.results['latencyResult'] = -1;
    }
    if (jitterResults.length) {
        this.results['jitterResult'] = utils.calculateMedianFromArray(jitterResults);
    } else {
        this.results['jitterResult'] = -1;
    }

    if (this.configuration['ltCount'] * this.configuration['resultsRefresh'] >= this.configuration['latencyTime'] || latencyFinished ==  true) {

        clearInterval(this.configuration['lt']);
        clearInterval(this.configuration['rlt']);

        for (var i in this.currentMethods.latency) {
            if (this.currentMethods.latency[i]) {
                this.currentMethods.latency[i].stopTest();
            }
        }
        this.currentMethods.latency = [];
        this.spg.showProgress('latency', true);

        this.log.info('Latency test finished: ' + this.results['latencyResult'] + ' ms');
        this.log.info('Jitter test finished: ' + this.results['jitterResult'] + ' ms');
        this.sendStats('latency');
    }

};

fireProbeApp.prototype.startDownload = function () {
    var jd = 0;
    if (this.configuration['downloadStartThread'] == 0) {
        this.results['startDownloadTime'] = utils.currDateMiSecs();
    }
    for (var i = this.configuration['downloadStartThread']; i < this.configuration['downloadThreads']; i++) {
        jd = i % _.size(this.configuration.servers);
        switch (this.configuration['method_download']) {
            case 'ws':
                this.currentMethods.download[i] = new downloadMethodWebSocket(i, this.configuration.servers[jd].host, this.configuration.servers[jd].port, this.configuration.servers[jd].pr);
                break;
            default:
                this.currentMethods.download[i] = new downloadMethodHttp(i, this.configuration.servers[jd].host, this.configuration.servers[jd].port, this.configuration.servers[jd].pr);
        }
        this.currentMethods.download[i].startTest();
    }
    this.configuration['downloadStartThread'] = this.configuration['downloadThreads'];
};
fireProbeApp.prototype.downloadRefresh = function () {
    this.spg.showProgress('download');
};
fireProbeApp.prototype.downloadProgress = function () {

    var time = 0;
    var targetThreads = 0;
    var speedSample = 0;

    this.configuration['dtCount']++;

    if (this.globalBytes > 0) {
        if (this.lastBytes < this.globalBytes) {
            time = utils.currDateMiSecs() - this.results['startDownloadTime'];
            this.lastBytes = this.globalBytes;
            this.byteSamples.push(this.globalBytes);
            this.timeSamples.push(time);
            if (this.byteSamples.length - 2 >= 0 && this.timeSamples.length - 2 >= 0) {
                speedSample = (this.byteSamples[this.byteSamples.length - 1] - this.byteSamples[this.byteSamples.length - 2]) / (this.timeSamples[this.timeSamples.length - 1] - this.timeSamples[this.timeSamples.length - 2]) * 8;
                this.speedSamples.push(speedSample);
                this.results['downloadWeightedResult'] = this.results['downloadRawResult'] = utils.calculateVspeed(this.speedSamples, 0.1, 0.9);
                this.results['downloadResult'] = Math.floor(this.results['downloadWeightedResult'] / this.configuration['unit'] * 100) / 100;
                targetThreads = utils.targetThreads(this.results['downloadWeightedResult'], 'download', this.configuration['method_download']);
                if (targetThreads > this.configuration['downloadThreads'] && this.configuration['dtCount'] * this.configuration['resultsRefresh'] > 1) {
                    this.configuration['downloadThreads'] = targetThreads;
                    this.log.info('Download connections increased to: ' + this.configuration['downloadThreads']);
                    this.startDownload();
                }
            }
        }
    } else {
        this.results['downloadRawResult'] = this.results['downloadWeightedResult'] = this.results['downloadResult'] = -1;
    }

    if ((utils.currDateMiSecs() - this.results['startDownloadTime']) / 1000 >= this.configuration['downloadTime']) {

        clearInterval(this.configuration['dt']);
        clearInterval(this.configuration['rdt']);

        for (var i = 0; i < this.configuration['downloadThreads']; i++) {
            if (this.currentMethods.download[i]) {
                if (this.currentMethods.download[i].getIsStarted() && this.currentMethods.download[i].getIsRunning()) {
                    this.results['downloadRunningThreads']++;
                }
                this.currentMethods.download[i].stopTest();
            }
            this.currentMethods.download[i] = null;
        }

        this.currentMethods.download = [];
        this.spg.showProgress('download', true);

        this.log.info('Download test finished: ' + this.results['downloadResult'] + ' Mbps (data received: ' + (this.globalBytes / 1024 / 1024).toFixed(2) + ' MB, threads opened: ' + this.results['downloadRunningThreads'] + ')');
        this.sendStats('download');
    }

};

fireProbeApp.prototype.startUpload = function () {
    var jd = 0;
    if (this.configuration['uploadStartThread'] == 0) {
        this.results['startUploadTime'] = utils.currDateMiSecs();
    }
    for (var i = this.configuration['uploadStartThread']; i < this.configuration['uploadThreads']; i++) {
        jd = i % _.size(this.configuration.servers);
        switch (this.configuration['method_upload']) {
            case 'ws':
                this.currentMethods.upload[i] = new uploadMethodWebSocket(i, this.configuration.servers[jd].host, this.configuration.servers[jd].port, this.configuration.servers[jd].pr);
                break;
            default:
                this.currentMethods.upload[i] = new uploadMethodHttp(i, this.configuration.servers[jd].host, this.configuration.servers[jd].port, this.configuration.servers[jd].pr);
        }
        this.currentMethods.upload[i].startTest();
    }
    this.configuration['uploadStartThread'] = this.configuration['uploadThreads'];
};
fireProbeApp.prototype.uploadRefresh = function () {
    this.spg.showProgress('upload');
};
fireProbeApp.prototype.uploadProgress = function () {

    var time = 0;
    var targetThreads = 0;
    var speedSample = 0;

    this.configuration['utCount']++;

    if (this.globalBytes > 0) {
        if (this.lastBytes < this.globalBytes) {
            time = utils.currDateMiSecs() - this.results['startUploadTime'];
            this.lastBytes = this.globalBytes;
            this.byteSamples.push(this.globalBytes);
            this.timeSamples.push(time);
            if (this.byteSamples.length - 2 >= 0 && this.timeSamples.length - 2 >= 0) {
                speedSample = (this.byteSamples[this.byteSamples.length - 1] - this.byteSamples[this.byteSamples.length - 2]) / (this.timeSamples[this.timeSamples.length - 1] - this.timeSamples[this.timeSamples.length - 2]) * 8;
                this.speedSamples.push(speedSample);
                this.results['uploadWeightedResult'] = this.results['uploadRawResult'] = utils.calculateVspeed(this.speedSamples, 0.1, 0.9);
                this.results['uploadResult'] = Math.floor(this.results['uploadWeightedResult'] / this.configuration['unit'] * 100) / 100;
                targetThreads = utils.targetThreads(this.results['uploadRawResult'], 'upload', this.configuration['method_upload']);
                if (targetThreads > this.configuration['uploadThreads'] && this.configuration['utCount'] * this.configuration['resultsRefresh'] > 1) {
                    this.configuration['uploadThreads'] = targetThreads;
                    this.log.info('Upload connections increased to: ' + this.configuration['uploadThreads']);
                    this.startUpload();
                }
            }
        }
    } else {
        this.results['uploadRawResult'] = this.results['uploadWeightedResult'] = this.results['uploadResult'] = -1;
    }

    if ((utils.currDateMiSecs() - this.results['startUploadTime']) / 1000 >= this.configuration['uploadTime']) {

        this.log.info("Stopping test...");

        clearInterval(this.configuration['ut']);
        clearInterval(this.configuration['rut']);

        for (var i = 0; i < this.configuration['uploadThreads']; i++) {
            if (this.currentMethods.upload[i]) {
                if (this.currentMethods.upload[i].getIsStarted() && this.currentMethods.upload[i].getIsRunning()) {
                    this.results['uploadRunningThreads']++;
                }
                this.currentMethods.upload[i].stopTest();
            }
            this.currentMethods.upload[i] = null;
        }

        this.currentMethods.upload = [];
        this.spg.showProgress('upload', true);

        this.log.info('Upload test finished: ' + this.results['uploadResult'] + ' Mbps (data sent: ' + (this.globalBytes / 1024 / 1024).toFixed(2) + ' MB, threads opened: ' + this.results['uploadRunningThreads'] + ')');
        this.sendStats('upload');

    }

};

fireProbeApp.prototype.sendStats = function (mode) {

    if (this.configuration['smg'] == false && this.configuration['stats'] && this.configuration['stats'].web) {

        this.log.info('Saving partial result for ' + mode + '...');

        var result, data, threads, legacy, workers;
        switch (mode) {
            case 'latency':
                result = this.results['latencyResult'];
                data = null;
                threads = null;
                legacy = this.legacyLatency;
                workers = null;
                break;
            case 'download':
                result = this.results['downloadWeightedResult'];
                data = this.results['downloadReceivedKbytes'];
                threads = this.results['downloadRunningThreads'];
                legacy = this.legacyDownload;
                workers = null;
                break;
            case 'upload':
                result = this.results['uploadWeightedResult'];
                data = this.results['uploadSendKbytes'];
                threads = this.results['uploadRunningThreads'];
                legacy = this.legacyUpload;
                workers = null;
                this.results['saved']++;
                break;
            default:
                result = null;
                data = null;
                threads = null;
                legacy = null;
                workers = null;
        }

        $.ajax({
            type: 'POST',
            dataType: 'json',
            url: this.configuration['url']['web'],
            cache: false,
            processData: true,
            data: {
                action: 'html5',
                mode: mode,
                version: this.scriptVersion,
                src: 100000 + parseInt(this.configuration['app']),
                started: this.results['startTimestamp'],
                longitude: this.results['longitude'],
                latitude: this.results['latitude'],
                accuracy: this.results['accuracy'],
                session: this.configuration['session'],
                fingerprint: this.configuration['fingerprint'],
                result: result,
                data: data,
                legacy: legacy ? legacy : 0,
                workers: workers ? 1 : 0,
                threads: threads,
                browser: this.jscd.browser,
                browser_version: this.jscd.browserMajorVersion,
                os: this.jscd.os,
                os_version: this.jscd.osVersion,
                mobile: this.jscd.mobile ? 1 : 0,
                group: this.configuration['serversGroup'],
                hash: CryptoJS.MD5(utils.parseHashPart(mode) +
                    utils.parseHashPart(this.scriptVersion) +
                    utils.parseHashPart(100000 + parseInt(this.configuration['app'])) +
                    utils.parseHashPart(this.results['startTimestamp']) +
                    utils.parseHashPart(this.results['longitude']) +
                    utils.parseHashPart(this.results['latitude']) +
                    utils.parseHashPart(this.results['accuracy']) +
                    utils.parseHashPart(this.configuration['session']) +
                    utils.parseHashPart(result) +
                    utils.parseHashPart(data) +
                    utils.parseHashPart(legacy ? legacy : 0) +
                    utils.parseHashPart(workers ? 1 : 0) +
                    utils.parseHashPart(threads) +
                    utils.parseHashPart(this.jscd.browser) +
                    utils.parseHashPart(this.jscd.browserMajorVersion) +
                    utils.parseHashPart(this.jscd.os) +
                    utils.parseHashPart(this.jscd.osVersion) +
                    utils.parseHashPart(this.jscd.mobile ? 1 : 0) +
                    this.configuration['hashkey']
                ).toString()
            },
            error: function () {
                that.sendEvent("save_partial_" + mode + "error");
            },
            success: function () {
                that.sendEvent("save_partial_" + mode);
            }
        });
    }


};
fireProbeApp.prototype.sendJsStats = function (data) {
    window.parent.postMessage(data, '*');
    if (typeof fireProbeStats === 'function') {
        fireProbeStats(data);
    }
    this.log.info('Sending results as post message to browser...');
};

fireProbeApp.prototype.getMisc = function () {
    var misc = {};
    var connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;

    if (connection !== undefined && connection.type !== undefined) {
        misc[25] = connection.type;
    }

    return misc;
};

fireProbeApp.prototype.uploadResults = function () {

    if (this.configuration['smg'] == false) {

        var socket = (this.legacyDownload && this.legacyDownload) ? 0 : 1;
        var fpc = typeof fpCustom != 'undefined' ? fpCustom : '';

        this.postdata = {
            action: 'result',
            locale: this.configuration['locale'],
            session: this.configuration['session'],
            fingerprint: this.configuration['fingerprint'],
            latency: this.results['latencyResult'],
            jitter: this.results['jitterResult'],
            download: this.results['downloadWeightedResult'],
            upload: this.results['uploadWeightedResult'],
            app: this.configuration['app'],
            server: this.configuration.servers[0].id,
            mobile: this.jscd.mobile ? 1 : 0,
            websocket: socket,
            proxy: this.results['proxy'],
            isp: this.results['isp'],
            org: this.results['org'],
            longitude: this.results['longitude'],
            latitude: this.results['latitude'],
            accuracy: this.results['accuracy'],
            coordinates_mode: this.results['coordinates_mode'],
            misc: JSON.stringify(this.getMisc()),
            custom: fpc,
            hash: CryptoJS.MD5(
                utils.parseHashPart('result') +
                utils.parseHashPart(this.configuration['session']) +
                utils.parseHashPart(this.results['latencyResult']) +
                utils.parseHashPart(this.results['jitterResult']) +
                utils.parseHashPart(this.results['downloadWeightedResult']) +
                utils.parseHashPart(this.results['uploadWeightedResult']) +
                utils.parseHashPart(this.configuration['app']) +
                utils.parseHashPart(this.configuration.servers[0].id) +
                utils.parseHashPart(this.jscd.mobile ? 1 : 0) +
                utils.parseHashPart(socket) +
                utils.parseHashPart(this.results['proxy']) +
                utils.parseHashPart(this.results['isp']) +
                utils.parseHashPart(this.results['org']) +
                utils.parseHashPart(this.results['longitude']) +
                utils.parseHashPart(this.results['latitude']) +
                utils.parseHashPart(this.results['accuracy']) +
                utils.parseHashPart(this.results['coordinates_mode']) +
                utils.parseHashPart(fpc) +
                this.configuration['key']
            ).toString()
        }

        $('body').trigger('fireprobe_test_finnished', this.postdata);

        // send to js
        this.sendJsStats(this.postdata);

        // fireprobe gateway
        if (this.configuration['stats'] && this.configuration['stats'].fireprobe) {

            this.log.info('Saving results to FireProbe gateway...');

            $.ajax({
                type: 'POST',
                dataType: 'json',
                url: this.configuration['gatewayUrl'],
                cache: false,
                processData: true,
                data: this.postdata,
                error: this.evtUploadResultsError,
                success: this.evtUploadResultsSuccess
            });

        }

        // external url
        if (this.configuration['posturl']) {
            if (this.configuration['redirect']) {
                this.log.info('Redirecting POST to external url...');
                $("#fireprobe").append('<form action="' + this.configuration['posturl'] + '" method="POST" target="_parent" id="fpr"></form>');
                $("#fireprobe #fpr").append('<input type="hidden" name="action" value="' + this.postdata.action + '"/>');
                $("#fireprobe #fpr").append('<input type="hidden" name="session" value="' + this.postdata.session + '"/>');
                $("#fireprobe #fpr").append('<input type="hidden" name="fingerprint" value="' + this.postdata.fingerprint + '"/>');
                $("#fireprobe #fpr").append('<input type="hidden" name="latency" value="' + this.postdata.latency + '"/>');
                $("#fireprobe #fpr").append('<input type="hidden" name="jitter" value="' + this.postdata.jitter + '"/>');
                $("#fireprobe #fpr").append('<input type="hidden" name="download" value="' + this.postdata.download + '"/>');
                $("#fireprobe #fpr").append('<input type="hidden" name="upload" value="' + this.postdata.upload + '"/>');
                $("#fireprobe #fpr").append('<input type="hidden" name="app" value="' + this.postdata.app + '"/>');
                $("#fireprobe #fpr").append('<input type="hidden" name="server" value="' + this.postdata.server + '"/>');
                $("#fireprobe #fpr").append('<input type="hidden" name="mobile" value="' + this.postdata.mobile + '"/>');
                $("#fireprobe #fpr").append('<input type="hidden" name="websocket" value="' + this.postdata.websocket + '"/>');
                $("#fireprobe #fpr").append('<input type="hidden" name="proxy" value="' + this.postdata.proxy + '"/>');
                $("#fireprobe #fpr").append('<input type="hidden" name="isp" value="' + this.postdata.isp + '"/>');
                $("#fireprobe #fpr").append('<input type="hidden" name="org" value="' + this.postdata.org + '"/>');
                $("#fireprobe #fpr").append('<input type="hidden" name="longitude" value="' + this.postdata.longitude + '"/>');
                $("#fireprobe #fpr").append('<input type="hidden" name="latitude" value="' + this.postdata.latitude + '"/>');
                $("#fireprobe #fpr").append('<input type="hidden" name="accuracy" value="' + this.postdata.accuracy + '"/>');
                $("#fireprobe #fpr").append('<input type="hidden" name="coordinates_mode" value="' + this.postdata.coordinates_mode + '"/>');
                $("#fireprobe #fpr").append('<input type="hidden" name="custom" value=\'' + this.postdata.custom + '\'/>');
                $("#fireprobe #fpr").append('<input type="hidden" name="hash" value="' + this.postdata.hash + '"/>');
                $("#fireprobe #fpr").submit();
            } else {
                this.log.info('Saving results to external url...');
                $.ajax({
                    type: 'POST',
                    dataType: 'json',
                    url: this.configuration['posturl'],
                    cache: false,
                    processData: true,
                    data: this.postdata,
                    error: function () {
                        that.sendEvent("save_external_error");
                    },
                    success: function () {
                        that.sendEvent("save_external");
                    }
                });
            }

        }

        // stats gateway
        if (this.configuration['stats'] && this.configuration['stats'].stats) {

            this.log.info('Saving results to stats gateway...');
            this.log.info(this.configuration);
            var servers = [];

            if (typeof this.configuration.servers !== 'undefined') {
                this.configuration.servers.map(function(configurationServer) {
                    servers.push(configurationServer.id);
                })
            }

            $.ajax({
                type: 'POST',
                dataType: 'json',
                url: this.configuration['url']['stats'],
                cache: false,
                processData: true,
                data: {
                    action: 'web',
                    servers: JSON.stringify(servers),
                    port: this.configuration['port'],
                    session: this.configuration['session'],
                    fingerprint: this.configuration['fingerprint'],
                    socket: socket,
                    app: 100000 + parseInt(this.configuration['app']),
                    latency: this.results['latencyResult'],
                    jitter: this.results['jitterResult'],
                    download: this.results['downloadWeightedResult'],
                    upload: this.results['uploadWeightedResult'],
                    longitude: this.results['longitude'],
                    latitude: this.results['latitude'],
                    accuracy: this.results['accuracy'],
                    coordinates_mode: this.results['coordinates_mode'],
                    misc: JSON.stringify(this.getMisc()),
                    hash: CryptoJS.MD5(
                        utils.parseHashPart('web') +
                        utils.parseHashPart(this.configuration['port']) +
                        utils.parseHashPart(this.configuration['session']) +
                        utils.parseHashPart(this.configuration['fingerprint']) +
                        utils.parseHashPart(socket) +
                        utils.parseHashPart(100000 + parseInt(this.configuration['app'])) +
                        utils.parseHashPart(this.results['latencyResult']) +
                        utils.parseHashPart(this.results['downloadWeightedResult']) +
                        utils.parseHashPart(this.results['uploadWeightedResult']) +
                        utils.parseHashPart(this.results['longitude']) +
                        utils.parseHashPart(this.results['latitude']) +
                        utils.parseHashPart(this.results['accuracy']) +
                        utils.parseHashPart(this.results['coordinates_mode']) +
                        this.configuration['hashkey']
                    ).toString()
                },
                error: function () {
                    that.sendEvent("save_stats_error");
                },
                success: function () {
                    that.sendEvent("save_stats");
                }
            });

        }

        // speedtestpl gateway
        if (this.configuration['stats'] && this.configuration['stats'].speedtestpl) {

            this.log.info('Saving results to speedtest.pl gateway...');

            $.ajax({
                type: 'POST',
                dataType: 'json',
                url: this.configuration['url']['speedtestpl'],
                cache: false,
                processData: true,
                data: {
                    action: 'resulthtml5',
                    latency: this.results['latencyResult'],
                    latencyJitter: this.results['latencyJitterResult'],
                    download: this.results['downloadWeightedResult'],
                    upload: this.results['uploadWeightedResult'],
                    unit: this.configuration['unit'],
                    port: this.configuration['port'],
                    app: 100000 + parseInt(this.configuration['app']),
                    ip: this.results['ip'],
                    isp: this.results['isp'],
                    org: this.results['org'],
                    hash: CryptoJS.MD5(
                        utils.parseHashPart('resulthtml5') +
                        utils.parseHashPart(this.results['latencyResult']) +
                        utils.parseHashPart(this.results['latencyJitterResult']) +
                        utils.parseHashPart(this.results['downloadWeightedResult']) +
                        utils.parseHashPart(this.results['uploadWeightedResult']) +
                        utils.parseHashPart(this.configuration['unit']) +
                        utils.parseHashPart(this.configuration['port']) +
                        utils.parseHashPart(100000 + parseInt(this.configuration['app'])) +
                        utils.parseHashPart(this.results['ip']) +
                        utils.parseHashPart(this.results['isp']) +
                        utils.parseHashPart(this.results['org']) +
                        this.configuration['hashkey']
                    ).toString()
                },
                error: function () {
                    that.sendEvent("save_speedtestpl_error");
                },
                success: function () {
                    that.sendEvent("save_speedtestpl");
                }
            });

        }

    } else {

        this.spg.resultsLoaded();

    }

};
fireProbeApp.prototype.evtUploadResultsError = function () {
    that.sendEvent("save_gateway_error");
    this.log.error('Cannot save results!');
};
fireProbeApp.prototype.evtUploadResultsSuccess = function (res) {
    $('body').trigger('fireprobe_upload_result_success', res);

    if (res.status == 'ok') {

        this.log.info('Results saved');
        this.results['resultId'] = res.resultId;

        this.configuration['imageSharingFinalUrl'] = this.configuration['imageSharingUrl'] + this.results['resultId'];
        this.configuration['fbSharingFinalUrl'] = this.configuration['fbSharingUrl'] + this.results['resultId'];
        this.configuration['googleSharingFinalUrl'] = this.configuration['googleSharingUrl'] + this.configuration['imageSharingFinalUrl'];
        this.configuration['twitterSharingFinalUrl'] = this.configuration['twitterSharingUrl'] + this.configuration['imageSharingFinalUrl'];
        this.configuration['imageSharingFinalBBCode'] = '[URL=' + this.configuration['imageSharingBBCode'] + '][IMG]' + this.configuration['imageSharingFinalUrl'] + '[/IMG][/URL]';

        this.sendEvent("save_gateway");
        this.spg.resultsLoaded();

        this.results['saved']++;

    } else {
        this.log.error('Cannot save results!');
    }

};

/*
 *  Test Method prototype
 */
var testMethod = function (id, host, port, method, maxcount) {
    _.bindAll(this);
    this.id = id;
    this.host = host;
    this.port = port;
    this.method = method;
    this.maxcount = maxcount;
    this.utid = utils.uuid();
    this.mode = 'none';
    this.testCount = 0;
    this.progressCount = 0;
    this.latency = -1;
    this.jitter = -1;
    this.testObject = null;
    this.isStarted = false;
    this.isRunning = false;
    this.latencyTimeout = 20000;
    this.dataTimeout = 20000;
};
testMethod.prototype.getLatency = function () {
    return this.latency;
};
testMethod.prototype.getJitter = function () {
    return this.jitter;
};
testMethod.prototype.getIsStarted = function () {
    return this.isStarted;
};
testMethod.prototype.getIsRunning = function () {
    return this.isRunning;
};
testMethod.prototype.getTestCount = function () {
    return this.testCount;
};
testMethod.prototype.checkTimeout = function () {
    that.log.debug('testMethod: checkTimeout');
    if (this.testCount == 0 && this.progressCount == 0) {
        this.stopTest();
        that.log.info('Stoping test after timeout');
    }
};

/*
 *  Latency Method HTTP prototype
 */
function latencyMethodHttp(id, host, port, method, maxcount) {
    testMethod.call(this, id, host, port, method, maxcount);
    this.url = (method == 'wss' ? 'https://' : 'http://') + this.host + ':' + this.port + '/?action=latency';
    this.startTime = 0;
    this.latencyTimes = [];
};
latencyMethodHttp.prototype = Object.create(testMethod.prototype);
latencyMethodHttp.prototype.constructor = latencyMethodHttp;
latencyMethodHttp.prototype.startTest = function () {
    that.log.debug('Starting latency test');
    this.isStarted = true;
    this.startTime = utils.currDateMiSecs();
    this.testObject = new XMLHttpRequest();
    this.testObject.addEventListener('loadstart', this.evtLoadStart, false);
    this.testObject.addEventListener('load', this.evtLoad, false);
    this.testObject.addEventListener('error', this.evtError, false);
    this.sendRequest();
    setTimeout(this.checkTimeout, this.latencyTimeout);
};
latencyMethodHttp.prototype.sendRequest = function () {
    var r = "&r=" + this.utid + "-" + this.testCount;
    this.testObject.open('GET', this.url + r, true);
    this.testObject.send();
};
latencyMethodHttp.prototype.restartTest = function () {
    that.log.debug('Restarting latency test');
    this.startTime = utils.currDateMiSecs();
    this.sendRequest();
};
latencyMethodHttp.prototype.stopTest = function () {
    if (this.isStarted) {
        that.log.debug('Stopping latency test');
        this.isStarted = false;
        if (this.testObject) {
            this.testObject.abort();
            delete (this.testObject);
        }
    }
};
latencyMethodHttp.prototype.evtError = function (xhr, ajaxOptions, thrownError) {
    that.log.error("HTTP latency error: " + this.id + " " + this.host + " " + this.port + " " + this.method);
};
latencyMethodHttp.prototype.evtLoadStart = function () {
    this.testObject.responseType = 'blob';
};
latencyMethodHttp.prototype.evtLoad = function (evt) {
    this.isRunning = true;
    this.testCount++;
    this.latencyTimes.push(utils.currDateMiSecs() - this.startTime);
    this.latency = utils.calculateMinFromArray(this.latencyTimes);
    this.jitter = utils.calculateJitter(this.latencyTimes);
    if (this.isStarted && this.testObject.status == '200' && this.testCount < this.maxcount) {
        this.restartTest();
    } else {
        this.stopTest();
    }
}

/*
 *  Download Method HTTP prototype
 */
function downloadMethodHttp(id, host, port, method) {
    testMethod.call(this, id, host, port, method);
    this.url = (method == 'wss' ? 'https://' : 'http://') + this.host + ':' + this.port;
    this.id = id;
    this.lastBytes = 0;
    this.progressCount = 0;
};
downloadMethodHttp.prototype = Object.create(testMethod.prototype);
downloadMethodHttp.prototype.constructor = downloadMethodHttp;
downloadMethodHttp.prototype.startTest = function () {
    that.log.debug('Starting download test');
    this.isStarted = true;
    this.testObject = new XMLHttpRequest();
    this.testObject.addEventListener('progress', this.evtProgress, false);
    this.testObject.addEventListener('loadstart', this.evtLoadStart, false);
    this.testObject.addEventListener('load', this.evtLoad, false);
    this.testObject.addEventListener('error', this.evtError, false);
    this.sendRequest();
    setTimeout(this.checkTimeout, this.dataTimeout);
};
downloadMethodHttp.prototype.sendRequest = function () {
    if (this.testCount == 0) {
        var r = "/?action=latency&r=" + this.utid;
    } else {
        var r = "/?action=download&size=" + that.configuration['download_size'] + "&r=" + this.utid + "-" + this.testCount;
    }
    this.testObject.open('POST', this.url + r, true);
    this.testObject.overrideMimeType('application/octet-stream');
    this.testObject.send();
};
downloadMethodHttp.prototype.restartTest = function () {
    that.log.debug('Restarting download test');
    this.lastBytes = 0;
    this.sendRequest();
};
downloadMethodHttp.prototype.stopTest = function () {
    if (this.isStarted) {
        that.log.debug('Stopping download test');
        this.isStarted = false;
        if (this.testObject) {
            this.testObject.abort();
            delete (this.testObject);
        }
    }
};
downloadMethodHttp.prototype.evtProgress = function (evt) {
    if (evt.lengthComputable === true && this.progressCount > 0) {
        that.globalBytes += evt.loaded - this.lastBytes;
        this.lastBytes = evt.loaded;
    }
    this.progressCount++;
    this.isRunning = true;
};
downloadMethodHttp.prototype.evtLoadStart = function () {
    this.testObject.responseType = 'blob';
};
downloadMethodHttp.prototype.evtLoad = function () {
    if (this.isStarted && this.testObject.status == '200') {
        this.testCount++;
        this.restartTest();
    } else {
        this.stopTest();
    }
};
downloadMethodHttp.prototype.evtError = function () {
    that.log.error("HTTP download error: " + this.id + " " + this.host + " " + this.port + " " + this.method);
};

/*
 *  Upload Method HTTP prototype
 */
function uploadMethodHttp(id, host, port, method) {
    testMethod.call(this, id, host, port, method);
    this.url = (method == 'wss' ? 'https://' : 'http://') + this.host + ':' + this.port;
    this.data = 0;
    this.interTime = 0;
    this.lastBytes = 0;
    this.progressCount = 0;
};
uploadMethodHttp.prototype = Object.create(testMethod.prototype);
uploadMethodHttp.prototype.constructor = uploadMethodHttp;
uploadMethodHttp.prototype.startTest = function () {
    this.isStarted = true;
    that.log.debug('Starting upload test');
    this.testObject = new XMLHttpRequest();
    this.testObject.upload.addEventListener("progress", this.evtProgress, false);
    this.testObject.addEventListener('loadstart', this.evtLoadStart, false);
    this.testObject.addEventListener('load', this.evtLoad, false);
    this.testObject.addEventListener('error', this.evtError, false);
    this.sendRequest();
    this.interTime = this.progressTime = utils.currDateMiSecs();
    setTimeout(this.checkTimeout, this.dataTimeout);
};
uploadMethodHttp.prototype.sendRequest = function () {
    if (this.testCount == 0) {
        var r = "/?action=latency&r=" + this.utid + "-" + this.testCount;
        this.testObject.open('POST', this.url + r, true);
        this.testObject.send();
    } else {
        var r = "/?action=xupload&r=" + this.utid + "-" + this.testCount;
        this.testObject.open('POST', this.url + r, true);
        this.testObject.send(that.uploadData[this.data]);
    }
};
uploadMethodHttp.prototype.restartTest = function () {
    that.log.debug('Restarting upload test');
    this.lastBytes = 0;
    var interTime = utils.currDateMiSecs() - this.interTime;
    that.log.debug(this.id + " Inter time: " + interTime);
    if (interTime < 500 && this.data < that.uploadData.length - 1) {
        this.data++;
        that.log.debug(this.id + ' Increasing data size to: ' + that.uploadData[this.data].size);
    } else if (interTime > 1000 && this.data > 0) {
        this.data--;
        that.log.debug(this.id + ' Decreasing data size to: ' + that.uploadData[this.data].size);
    }
    this.interTime = utils.currDateMiSecs();
    this.sendRequest();
};
uploadMethodHttp.prototype.stopTest = function () {
    if (this.isStarted) {
        that.log.debug('Stopping upload test');
        this.isStarted = false;
        if (this.testObject) {
            this.testObject.abort();
            delete (this.testObject);
        }
    }
};
uploadMethodHttp.prototype.evtError = function () {
    that.log.error("HTTP upload error: " + this.id + " " + this.host + " " + this.port + " " + this.method);
};
uploadMethodHttp.prototype.evtProgress = function (evt) {
    if (evt.lengthComputable === true && this.progressCount > 0) {
        this.isRunning = true;
        if (this.data >= 4) {
            that.globalBytes += evt.loaded - this.lastBytes;
            this.lastBytes = evt.loaded;
        }
    }
    this.progressCount++;
};
uploadMethodHttp.prototype.evtLoadStart = function () {
    this.testObject.responseType = 'blob';
};
uploadMethodHttp.prototype.evtLoad = function (evt) {
    if (this.isStarted && this.testObject.status == '200') {
        this.isRunning = true;
        if (this.data < 4) {
            that.globalBytes += that.uploadData[this.data].size;
        }
        this.testCount++;
        this.restartTest();
    } else {
        this.stopTest();
    }
}

/*
 *  Latency Method WebSocket prototype
 */
function latencyMethodWebSocket(id, host, port, method, maxcount) {
    testMethod.call(this, id, host, port, method, maxcount);
    this.data = new Blob(['LATENCY']);
    this.startTime = 0;
    this.latencyTimes = [];
};
latencyMethodWebSocket.prototype = Object.create(testMethod.prototype);
latencyMethodWebSocket.prototype.constructor = latencyMethodWebSocket;
latencyMethodWebSocket.prototype.startTest = function () {
    that.log.debug('latencyMethodWebSocket: startTest, count: ' + this.testCount);
    this.isStarted = true;
    this.testObject = new WebSocket(this.method + '://' + this.host + ':' + this.port + '/ws?latency');
    this.testObject.binaryType = 'blob';
    this.testObject.onopen = this.evtSuccess;
    this.testObject.onclose = this.evtComplete;
    this.testObject.onerror = this.evtError;
    this.testObject.onmessage = this.evtBeforeSend;
    setTimeout(this.checkTimeout, this.latencyTimeout);
};
latencyMethodWebSocket.prototype.restartTest = function () {
    that.log.debug('latencyMethodWebSocket: restartTest, count: ' + this.testCount);
    this.startTime = utils.currDateMiSecs();
    this.testObject.send(this.data);
};
latencyMethodWebSocket.prototype.stopTest = function () {
    if (this.isStarted) {
        that.log.debug('Stopping latency test');
        this.isStarted = false;
        if (this.testObject) {
            this.testObject.close();
            delete (this.testObject);
        }
    }
};
latencyMethodWebSocket.prototype.evtError = function (thrownError) {
    that.log.error("Websocket latency error: " + this.id + " " + this.host + " " + this.port + " " + this.method);
};
latencyMethodWebSocket.prototype.evtBeforeSend = function (evt) {
    that.log.debug('latencyMethodWebSocket: evtBeforeSend, count: ' + this.testCount);
    this.testCount++;
    this.isRunning = true;
    this.latencyTimes.push(utils.currDateMiSecs() - this.startTime);
    this.latency = utils.calculateMinFromArray(this.latencyTimes);
    this.jitter = utils.calculateJitter(this.latencyTimes);
    if (this.testCount < this.maxcount || this.maxcount == 0) {
        this.restartTest();
    } else {
        this.stopTest();
    }
};
latencyMethodWebSocket.prototype.evtComplete = function () {
    that.log.debug('latencyMethodWebSocket: evtComplete, count: ' + this.testCount);
};
latencyMethodWebSocket.prototype.evtSuccess = function (msg) {
    that.log.debug('latencyMethodWebSocket: evtSuccess, count: ' + this.testCount);
    this.restartTest();
};

/*
 *  Download Method WebSocket prototype
 */
function downloadMethodWebSocket(id, host, port, method) {
    testMethod.call(this, id, host, port, method);
    this.startTime = 0;
    this.pktCount = 16;
    this.id = id;
    this.interTime = 0;
};
downloadMethodWebSocket.prototype = Object.create(testMethod.prototype);
downloadMethodWebSocket.prototype.constructor = downloadMethodWebSocket;
downloadMethodWebSocket.prototype.startTest = function () {
    this.isStarted = true;
    this.testObject = new WebSocket(this.method + '://' + this.host + ':' + this.port + '/ws?download');
    this.testObject.binaryType = 'blob';
    this.testObject.onopen = this.evtSuccess;
    this.testObject.onclose = this.evtComplete;
    this.testObject.onerror = this.evtError;
    this.testObject.onmessage = this.evtBeforeSend;
    this.interTime = utils.currDateMiSecs();
    setTimeout(this.checkTimeout, this.dataTimeout);
};
downloadMethodWebSocket.prototype.restartTest = function () {
    that.log.debug('Restarting download test');
    this.testObject.send('DOWNLOAD|' + this.pktCount);
};
downloadMethodWebSocket.prototype.stopTest = function () {
    if (this.isStarted) {
        that.log.debug('Stopping download test');
        this.isStarted = false;
        if (this.testObject) {
            this.testObject.close();
            delete (this.testObject);
        }
    }
};
downloadMethodWebSocket.prototype.evtError = function (thrownError) {
    that.log.error("Websocket download error: " + this.id + " " + this.host + " " + this.port + " " + this.method);
};
downloadMethodWebSocket.prototype.evtBeforeSend = function (evt) {

    this.isRunning = true;
    this.testCount++;
    that.globalBytes += evt.data.size;

    var interTime = utils.currDateMiSecs() - this.interTime;
    that.log.debug(this.id + " Inter time: " + interTime + ", data size: " + evt.data.size);
    if (interTime < 1000 && this.pktCount < 1024*2) {
        this.pktCount *= 2;
        that.log.debug(this.id + ' Increasing data size to: ' + this.pktCount);
    } else if (interTime > 2000 && this.pktCount > 16) {
        this.pktCount /= 2;
        that.log.debug(this.id + ' Decreasing data size to: ' + this.pktCount);
    }
    this.interTime = utils.currDateMiSecs();
    if (this.isStarted) {
        this.restartTest();
    }

};
downloadMethodWebSocket.prototype.evtComplete = function () {
};
downloadMethodWebSocket.prototype.evtSuccess = function () {
    this.testObject.send('DOWNLOAD|' + this.pktCount);
};

/*
 *  Upload Method WebSocket prototype
 */
function uploadMethodWebSocket(id, host, port, method) {
    testMethod.call(this, id, host, port, method);
    this.data = 0;
    this.interTime = 0;
    this.id = id;
};
uploadMethodWebSocket.prototype = Object.create(testMethod.prototype);
uploadMethodWebSocket.prototype.constructor = uploadMethodWebSocket;
uploadMethodWebSocket.prototype.startTest = function () {
    this.isStarted = true;
    this.testObject = new WebSocket(this.method + '://' + this.host + ':' + this.port + '/ws?upload');
    this.testObject.binaryType = 'blob';
    this.testObject.onopen = this.evtSuccess;
    this.testObject.onclose = this.evtComplete;
    this.testObject.onerror = this.evtError;
    this.testObject.onmessage = this.evtBeforeSend;
    this.interTime = utils.currDateMiSecs();
    setTimeout(this.checkTimeout, this.dataTimeout);
};
uploadMethodWebSocket.prototype.restartTest = function () {
    that.log.debug('Restarting upload test');
    this.testObject.send(that.uploadData[this.data]);
};
uploadMethodWebSocket.prototype.stopTest = function () {
    if (this.isStarted) {
        that.log.debug('Stopping upload test');
        this.isStarted = false;
        if (this.testObject) {
            this.testObject.close();
            delete (this.testObject);
        }
    }
};
uploadMethodWebSocket.prototype.evtError = function (thrownError) {
    that.log.error("Websocket upload error: " + this.id + " " + this.host + " " + this.port + " " + this.method);
};
uploadMethodWebSocket.prototype.evtBeforeSend = function (evt) {

    this.isRunning = true;
    this.testCount++;
    that.globalBytes += Number(evt.data);

    var interTime = utils.currDateMiSecs() - this.interTime;
    that.log.debug(this.id + " Inter time: " + interTime + ", data size: " + Number(evt.data));
    if (interTime < 1000 && this.data < that.uploadData.length - 1 && this.data < 7) {
        this.data++;
        that.log.debug(this.id + ' Increasing data size to: ' + that.uploadData[this.data].size);
    } else if (interTime > 2000 && this.data > 0) {
        this.data--;
        that.log.debug(this.id + ' Decreasing data size to: ' + that.uploadData[this.data].size);
    }
    this.interTime = utils.currDateMiSecs();

    if (this.isStarted) {
        this.restartTest();
    }
};
uploadMethodWebSocket.prototype.evtComplete = function () {
};
uploadMethodWebSocket.prototype.evtSuccess = function () {
    this.testObject.send(that.uploadData[this.data]);
};

/*
 *  Utils class
 */
var utils = function () {
};
utils.calculateBps = function (bytes, time) {
    return Math.floor((bytes * 8) / time);
};
utils.calculateVspeed = function (speedSamples, lowThreshold, highThreshold) {
    speedSamples.sort(function (a, b) {
        return a - b;
    });
    if (speedSamples.length > 10) {
        lowerIndex = Math.floor(speedSamples.length * lowThreshold);
        upperIndex = Math.ceil(speedSamples.length * highThreshold);
    } else {
        lowerIndex = 0
        upperIndex = speedSamples.length - 1;
    }
    count = 0;
    sum = 0;
    for (i = lowerIndex; i <= upperIndex; i++) {
        if (speedSamples[i] === undefined) {
            continue;
        }
        sum += speedSamples[i];
        count++;
    }
    if (count <= 0) {
        return 0;
    }
    return sum / count;
};
utils.currDateMiSecs = function () {
    return Date.now();
};
utils.calculateMedianFromArray = function (values) {
    var vals = values;
    vals.sort(function (a, b) {
        return a - b;
    });
    var half = Math.floor(vals.length / 2);
    if (vals.length % 2) return vals[half];
    else return (vals[half - 1] + vals[half]) / 2.0;
};
utils.calculateMinFromArray = function (values) {
    return Math.min.apply(null, _.without(values, -1));
};
utils.replaceAll = function (str, find, replace) {
    return str.replace(new RegExp(utils.escapeRegExp(find), 'g'), replace);
};
utils.escapeRegExp = function (str) {
    return str.replace(/([.*+?^=!:${}()|\[\]\/\\])/g, "\\$1");
};
utils.randomString = function (length, chars) {
    var mask = '';
    if (chars.indexOf('a') > -1) mask += 'abcdefghijklmnopqrstuvwxyz';
    if (chars.indexOf('A') > -1) mask += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    if (chars.indexOf('#') > -1) mask += '0123456789';
    if (chars.indexOf('!') > -1) mask += '~`!@#$%^&*()_+-={}[]:";\'<>?,./|\\';
    var result = '';
    for (var i = length; i > 0; --i) result += mask[Math.floor(Math.random() * mask.length)];
    return result;
};
utils.parseHashPart = function (part) {
    if (typeof (part) == 'number') {
        if (isNaN(part)) {
            return "";
        }
    }
    if (typeof (part) == 'undefined' || part === null) {
        return "";
    } else {
        return part.toString();
    }
};
utils.setCookie = function (cname, cvalue, exdays) {
    var d = new Date();
    d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
    var expires = "expires=" + d.toUTCString();
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
};
utils.getCookie = function (cname) {
    var name = cname + "=";
    var decodedCookie = decodeURIComponent(document.cookie);
    var ca = decodedCookie.split(';');
    for (var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
};
utils.jscd = function () {

    var unknown = '-';

    // browser
    var nVer = navigator.appVersion;
    var nAgt = navigator.userAgent;
    var browser = navigator.appName;
    var version = '' + parseFloat(navigator.appVersion);
    var majorVersion = parseInt(navigator.appVersion, 10);
    var nameOffset, verOffset, ix;

    // Opera
    if ((verOffset = nAgt.indexOf('Opera')) != -1) {
        browser = 'Opera';
        version = nAgt.substring(verOffset + 6);
        if ((verOffset = nAgt.indexOf('Version')) != -1) {
            version = nAgt.substring(verOffset + 8);
        }
    }
    // Opera Next
    if ((verOffset = nAgt.indexOf('OPR')) != -1) {
        browser = 'Opera';
        version = nAgt.substring(verOffset + 4);
    }
    // Edge
    else if ((verOffset = nAgt.indexOf('Edge')) != -1) {
        browser = 'Edge';
        version = nAgt.substring(verOffset + 5);
    }
    // MSIE
    else if ((verOffset = nAgt.indexOf('MSIE')) != -1) {
        browser = 'IE';
        version = nAgt.substring(verOffset + 5);
    }
    // Chrome
    else if ((verOffset = nAgt.indexOf('Chrome')) != -1) {
        browser = 'Chrome';
        version = nAgt.substring(verOffset + 7);
    }
    // Safari
    else if ((verOffset = nAgt.indexOf('Safari')) != -1) {
        browser = 'Safari';
        version = nAgt.substring(verOffset + 7);
        if ((verOffset = nAgt.indexOf('Version')) != -1) {
            version = nAgt.substring(verOffset + 8);
        }
    }
    // Firefox
    else if ((verOffset = nAgt.indexOf('Firefox')) != -1) {
        browser = 'Firefox';
        version = nAgt.substring(verOffset + 8);
    }
    // MSIE 11+
    else if (nAgt.indexOf('Trident/') != -1) {
        browser = 'IE';
        version = nAgt.substring(nAgt.indexOf('rv:') + 3);
    }
    // Other browsers
    else if ((nameOffset = nAgt.lastIndexOf(' ') + 1) < (verOffset = nAgt.lastIndexOf('/'))) {
        browser = nAgt.substring(nameOffset, verOffset);
        version = nAgt.substring(verOffset + 1);
        if (browser.toLowerCase() == browser.toUpperCase()) {
            browser = navigator.appName;
        }
    }
    // trim the version string
    if ((ix = version.indexOf(';')) != -1) version = version.substring(0, ix);
    if ((ix = version.indexOf(' ')) != -1) version = version.substring(0, ix);
    if ((ix = version.indexOf(')')) != -1) version = version.substring(0, ix);

    majorVersion = parseInt('' + version, 10);
    if (isNaN(majorVersion)) {
        version = '' + parseFloat(navigator.appVersion);
        majorVersion = parseInt(navigator.appVersion, 10);
    }

    // mobile version
    var mobile = /Mobile|mini|Fennec|Android|iP(ad|od|hone)/.test(nVer);

    // system
    var os = unknown;
    var clientStrings = [
        {s: 'Windows 10', r: /(Windows 10.0|Windows NT 10.0)/},
        {s: 'Windows 8.1', r: /(Windows 8.1|Windows NT 6.3)/},
        {s: 'Windows 8', r: /(Windows 8|Windows NT 6.2)/},
        {s: 'Windows 7', r: /(Windows 7|Windows NT 6.1)/},
        {s: 'Windows Vista', r: /Windows NT 6.0/},
        {s: 'Windows Server 2003', r: /Windows NT 5.2/},
        {s: 'Windows XP', r: /(Windows NT 5.1|Windows XP)/},
        {s: 'Windows 2000', r: /(Windows NT 5.0|Windows 2000)/},
        {s: 'Windows ME', r: /(Win 9x 4.90|Windows ME)/},
        {s: 'Windows 98', r: /(Windows 98|Win98)/},
        {s: 'Windows 95', r: /(Windows 95|Win95|Windows_95)/},
        {s: 'Windows NT 4.0', r: /(Windows NT 4.0|WinNT4.0|WinNT|Windows NT)/},
        {s: 'Windows CE', r: /Windows CE/},
        {s: 'Windows 3.11', r: /Win16/},
        {s: 'Android', r: /Android/},
        {s: 'Open BSD', r: /OpenBSD/},
        {s: 'Sun OS', r: /SunOS/},
        {s: 'Linux', r: /(Linux|X11)/},
        {s: 'iOS', r: /(iPhone|iPad|iPod)/},
        {s: 'Mac OS X', r: /Mac OS X/},
        {s: 'Mac OS', r: /(MacPPC|MacIntel|Mac_PowerPC|Macintosh)/},
        {s: 'QNX', r: /QNX/},
        {s: 'UNIX', r: /UNIX/},
        {s: 'BeOS', r: /BeOS/},
        {s: 'OS/2', r: /OS\/2/},
        {s: 'Search Bot', r: /(nuhk|Googlebot|Yammybot|Openbot|Slurp|MSNBot|Ask Jeeves\/Teoma|ia_archiver)/}
    ];
    for (var id in clientStrings) {
        var cs = clientStrings[id];
        if (cs.r.test(nAgt)) {
            os = cs.s;
            break;
        }
    }

    var osVersion = unknown;

    if (/Windows/.test(os)) {
        osVersion = /Windows (.*)/.exec(os)[1];
        os = 'Windows';
    }

    switch (os) {
        case 'Mac OS X':
            osVersion = /Mac OS X ([0-9]+[\.\_\d]+)/.exec(nAgt)[1];
            os = 'MAC';
            break;

        case 'Android':
            osVersion = /Android ([\.\_\d]+)/.exec(nAgt)[1];
            os = 'Android';
            break;

        case 'iOS':
            osVersion = /OS (\d+)_(\d+)_?(\d+)?/.exec(nVer);
            osVersion = osVersion[1] + '.' + osVersion[2] + '.' + (osVersion[3] | 0);
            os = 'iOS';
            break;
    }

    data = {
        browser: browser,
        browserVersion: version,
        browserMajorVersion: majorVersion,
        mobile: mobile,
        os: os,
        osVersion: osVersion
    };

    return data;
};
utils.calculateJitter = function (times) {
    var diffs = [];
    var prev = -1;
    if (times.length > 0) {
        for (var i in times) {
            if (prev > -1) {
                diffs.push(Math.abs(times[i] - prev));
            }
            prev = times[i];
        }
    }
    return utils.calculateMedianFromArray(diffs);
};
utils.weightedSpeed = function (bytes, times) {

    var samplesLength = bytes.length;
    var weight = 0.5;
    var threshold = 20;

    var offset = Math.ceil(samplesLength * (1 - weight)) - 1;

    if (samplesLength) {
        if (samplesLength >= threshold) {
            return (bytes[samplesLength - 1] - bytes[offset]) * 8 / (times [samplesLength - 1] - times [offset]);
        } else {
            return bytes[samplesLength - 1] * 8 / times [samplesLength - 1];
        }
    } else {
        return 0;
    }

};
utils.getDistanceFromLatLonInKm = function (lat1, lon1, lat2, lon2) {
    var R = 6371; // Radius of the earth in km
    var dLat = utils.deg2rad(lat2 - lat1);  // deg2rad below
    var dLon = utils.deg2rad(lon2 - lon1);
    var a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(utils.deg2rad(lat1)) * Math.cos(utils.deg2rad(lat2)) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2)
    ;
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    var d = R * c; // Distance in km
    return d;
};
utils.deg2rad = function deg2rad(deg) {
    return deg * (Math.PI / 180);
};
utils.uuid = function () {
    var dt = new Date().getTime();
    var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        var r = (dt + Math.random() * 16) % 16 | 0;
        dt = Math.floor(dt / 16);
        return (c == 'x' ? r : (r & 0x3 | 0x8)).toString(16);
    });
    return uuid;
};
utils.myPath = function () {
    var scripts = document.getElementsByTagName('script');
    var path = '';
    if (scripts && scripts.length > 0) {
        for (var i in scripts) {
            if (scripts[i].src && scripts[i].src.match(/\/fireprobe\.js($|\?.*$)/)) {
                //path = scripts[i].src.replace(/(.*)\/fireprobe\.js($|\?.*$)/, '$1');
                path = scripts[i].src;
                break;
            }
        }
    }
    return path;
};
utils.targetThreads = function (speed, direction, mode) {

    var targetThreads = 4;
    switch (mode) {
        case 'http':
        case 'ws':
            switch (direction) {
                case 'download':
                    if (speed > 300 * 1000) {
                        targetThreads = 16;
                    } else if (speed > 100 * 1000) {
                        targetThreads = 12;
                    } else if (speed > 10 * 1000) {
                        targetThreads = 8;
                    } else if (speed > 1 * 1000) {
                        targetThreads = 4;
                    } else {
                        targetThreads = 2;
                    }
                    break;
                case 'upload':
                    if (speed > 300 * 1000) {
                        targetThreads = 16;
                    } else if (speed > 100 * 1000) {
                        targetThreads = 12;
                    } else if (speed > 50 * 1000) {
                        targetThreads = 8;
                    } else if (speed > 10 * 1000) {
                        targetThreads = 4;
                    } else if (speed > 5 * 1000) {
                        targetThreads = 3;
                    } else {
                        targetThreads = 2;
                    }
                    break;
                default:
                    targetThreads = 2;
            }
            break;
        default:
            targetThreads = 2;
    }

    //return 1;
    return targetThreads;

};


/*
 *  Logger class
 */
var logger = function (prefix, DEBUG_LEVEL) {
    this.DEBUG_LEVEL = typeof DEBUG_LEVEL !== 'undefined' ? DEBUG_LEVEL : 'ERROR';
    this.prefix = typeof prefix !== 'undefined' ? prefix : 'APP';
};
logger.DEBUG = 7;
logger.INFO = 5;
logger.ERROR = 1;
logger.prototype.log = function (level, msg) {
    console.log(this.prefix + ' | ' + level + ': ' + msg);
    $('#log').html($('#log').html() + new Date().toLocaleString() + ": " + this.prefix + ' | ' + level + ':: ' + msg + '<br>');
};
logger.prototype.debug = function (msg) {
    if (this.DEBUG_LEVEL >= logger.DEBUG) this.log('DEBUG', msg);
};
logger.prototype.info = function (msg) {
    if (this.DEBUG_LEVEL >= logger.INFO) this.log('INFO', msg);
};
logger.prototype.error = function (msg) {
    if (this.DEBUG_LEVEL >= logger.ERROR) this.log('ERROR', msg);
};