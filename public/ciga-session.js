// ========================================
// CIGA SESSION LOG
// ========================================

const CIGA_LOG_KEY = "ciga_session_log";
const CIGA_SESSION_KEY = "ciga_session_started";


// ========================================
// GET LOCAL TIME
// ========================================

function cigaGetTime() {

    const now = new Date();

    return now.toLocaleTimeString(
        [],
        {
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
            hour12: false
        }
    );
}


// ========================================
// LOAD LOG
// ========================================

function cigaGetLogs() {

    try {

        const stored =
            sessionStorage.getItem(
                CIGA_LOG_KEY
            );

        if (!stored) {
            return [];
        }

        return JSON.parse(stored);

    } catch (error) {

        console.error(
            "CIGA SESSION LOG ERROR:",
            error
        );

        return [];
    }
}


// ========================================
// SAVE LOG
// ========================================

function cigaSaveLogs(logs) {

    sessionStorage.setItem(
        CIGA_LOG_KEY,
        JSON.stringify(logs)
    );
}


// ========================================
// ADD LOG
// ========================================

function cigaAddLog(message) {

    const logs = cigaGetLogs();

    logs.push({
        time: cigaGetTime(),
        message: message
    });

    cigaSaveLogs(logs);
}


// ========================================
// START SESSION
// ========================================

function cigaStartSession() {

    const sessionStarted =
        sessionStorage.getItem(
            CIGA_SESSION_KEY
        );

    if (!sessionStarted) {

        sessionStorage.setItem(
            CIGA_SESSION_KEY,
            "true"
        );

        cigaAddLog(
            "SITE OPEN"
        );

        cigaAddLog(
            "SYSTEM CONNECTION ESTABLISHED"
        );

        cigaAddLog(
            "OPERATIVE SESSION INITIALIZED"
        );

    }

}


// ========================================
// RENDER LOG
// ========================================

function cigaRenderLogs(
    containerId
) {

    const container =
        document.getElementById(
            containerId
        );

    if (!container) {
        return;
    }

    container.innerHTML = "";

    const logs =
        cigaGetLogs();

    logs.forEach(
        log => {

            const logElement =
                document.createElement(
                    "div"
                );

            logElement.className =
                "log";

            const time =
                document.createElement(
                    "span"
                );

            time.className =
                "log-time";

            time.textContent =
                log.time;

            logElement.appendChild(
                time
            );

            logElement.appendChild(
                document.createTextNode(
                    log.message
                )
            );

            container.appendChild(
                logElement
            );

        }
    );

}


// ========================================
// LOG + RENDER
// ========================================

function cigaLogAndRender(
    message,
    containerId
) {

    cigaAddLog(message);

    cigaRenderLogs(
        containerId
    );

}
