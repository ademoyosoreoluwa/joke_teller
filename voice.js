const VoiceRSS = {
    speech: function (settings) {
        this._validate(settings);
        this._request(settings);
    },

    _validate: function (settings) {
        if (!settings) {
            throw "The settings are undefined";
        }
        if (!settings.key) {
            throw "The API key is undefined";
        }
        if (!settings.src) {
            throw "The text is undefined";
        }
        if (!settings.hl) {
            throw "The language is undefined";
        }

        if (settings.c && settings.c.toLowerCase() !== "auto") {
            let isSupported = false;
            switch (settings.c.toLowerCase()) {
                case "mp3":
                    isSupported = new Audio().canPlayType("audio/mpeg").replace("no", "");
                    break;
                case "wav":
                    isSupported = new Audio().canPlayType("audio/wav").replace("no", "");
                    break;
                case "aac":
                    isSupported = new Audio().canPlayType("audio/aac").replace("no", "");
                    break;
                case "ogg":
                    isSupported = new Audio().canPlayType("audio/ogg").replace("no", "");
                    break;
                case "caf":
                    isSupported = new Audio().canPlayType("audio/x-caf").replace("no", "");
                    break;
            }

            if (!isSupported) {
                throw `The browser does not support the audio codec ${settings.c}`;
            }
        }
    },

    _request: function (settings) {
        const requestData = this._buildRequest(settings);
        const xhr = this._getXHR();

        xhr.onreadystatechange = function () {
            if (xhr.readyState === 4 && xhr.status === 200) {
                if (xhr.responseText.startsWith("ERROR")) {
                    throw xhr.responseText;
                }
                audioElement.src = xhr.responseText;
                audioElement.play();
            }
        };

        xhr.open("POST", "https://api.voicerss.org/", true);
        xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded; charset=UTF-8");
        xhr.send(requestData);
    },

    _buildRequest: function (settings) {
        const codec = settings.c && settings.c.toLowerCase() !== "auto" ? settings.c : this._detectCodec();
        return `key=${settings.key || ""}` +
               `&src=${settings.src || ""}` +
               `&hl=${settings.hl || ""}` +
               `&r=${settings.r || ""}` +
               `&c=${codec || ""}` +
               `&f=${settings.f || ""}` +
               `&ssml=${settings.ssml || ""}` +
               `&b64=true`;
    },

    _detectCodec: function () {
        const audio = new Audio();
        if (audio.canPlayType("audio/mpeg").replace("no", "")) return "mp3";
        if (audio.canPlayType("audio/wav").replace("no", "")) return "wav";
        if (audio.canPlayType("audio/aac").replace("no", "")) return "aac";
        if (audio.canPlayType("audio/ogg").replace("no", "")) return "ogg";
        if (audio.canPlayType("audio/x-caf").replace("no", "")) return "caf";
        return "";
    },

    _getXHR: function () {
        try {
            return new XMLHttpRequest();
        } catch (e) {}
        try {
            return new ActiveXObject("Msxml3.XMLHTTP");
        } catch (e) {}
        try {
            return new ActiveXObject("Msxml2.XMLHTTP.6.0");
        } catch (e) {}
        try {
            return new ActiveXObject("Msxml2.XMLHTTP.3.0");
        } catch (e) {}
        try {
            return new ActiveXObject("Msxml2.XMLHTTP");
        } catch (e) {}
        try {
            return new ActiveXObject("Microsoft.XMLHTTP");
        } catch (e) {}

        throw "The browser does not support HTTP request";
    }
};