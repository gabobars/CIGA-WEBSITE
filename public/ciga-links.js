/* ==========================================
   CIGA LINK RENDERER
   ========================================== */

(function () {

    "use strict";


    /* ==========================================
       HTML ESCAPE
       ========================================== */

    function escapeHTML(value) {

        return String(value ?? "")

            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");

    }


    /* ==========================================
       SAFE LINK DESTINATION
       ========================================== */

    function cigaSafeLinkDestination(value) {

        const destination =
            String(value ?? "").trim();


        if (!destination) {

            return null;

        }


        /*
            Reject dangerous protocols.
        */

        const lowered =
            destination.toLowerCase();


        if (
            lowered.startsWith("javascript:") ||
            lowered.startsWith("data:") ||
            lowered.startsWith("vbscript:")
        ) {

            return null;

        }


        /*
            Allow:

            relative paths
            /paths
            ./paths
            ../paths
            #
            http://
            https://
        */

        if (
            lowered.startsWith("http://") ||
            lowered.startsWith("https://") ||
            lowered.startsWith("/") ||
            lowered.startsWith("./") ||
            lowered.startsWith("../") ||
            lowered.startsWith("#") ||
            !lowered.includes(":")
        ) {

            return destination;

        }


        return null;

    }


    /* ==========================================
       LINK SYNTAX

       [[TEXT|DESTINATION]]
       ========================================== */

    function cigaRenderLinks(text) {

        const source =
            String(text ?? "");


        if (!source) {

            return "";

        }


        const linkPattern =
            /\[\[([^\[\]\n|]+)\|([^\[\]\n]+)\]\]/g;


        let output = "";

        let lastIndex = 0;

        let match;


        while (
            (
                match =
                    linkPattern.exec(
                        source
                    )
            ) !== null
        ) {

            /*
                Normal text before the link.
            */

            output +=
                escapeHTML(
                    source.slice(
                        lastIndex,
                        match.index
                    )
                );


            const linkText =
                match[1].trim();


            const destination =
                cigaSafeLinkDestination(
                    match[2]
                );


            /*
                Invalid destination:
                keep original syntax as text.
            */

            if (!destination) {

                output +=
                    escapeHTML(
                        match[0]
                    );

            } else {

                output += `

                    <a
                        href="${escapeHTML(
                            destination
                        )}"
                        class="ciga-lore-link"
                        ${
                            destination.startsWith(
                                "http://"
                            )
                            ||
                            destination.startsWith(
                                "https://"
                            )
                                ? `
                                    target="_blank"
                                    rel="noopener noreferrer"
                                  `
                                : ""
                        }
                    >
                        ${escapeHTML(
                            linkText
                        )}
                    </a>

                `;

            }


            lastIndex =
                linkPattern.lastIndex;

        }


        /*
            Remaining text after last link.
        */

        output +=
            escapeHTML(
                source.slice(
                    lastIndex
                )
            );


        /*
            Preserve normal line breaks.
        */

        return output.replace(
            /\n/g,
            "<br>"
        );

    }


    /* ==========================================
       EXPOSE GLOBALLY
       ========================================== */

    window.cigaRenderLinks =
        cigaRenderLinks;


    window.cigaEscapeHTML =
        escapeHTML;

})();
