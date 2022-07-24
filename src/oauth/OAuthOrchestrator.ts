// OAuthOrchestrator ---------------------------------------------------------

// Initialize OAuth handling for this application.

// External Modules ----------------------------------------------------------

const customEnv = require("custom-env");
customEnv.env(true);
import {Orchestrator} from "@craigmcc/oauth-orchestrator";

// Internal Modules ----------------------------------------------------------

import OAuthOrchestratorHandlers from "./OAuthOrchestratorHandlers";
export const OAuthOrchestrator: Orchestrator
    = new Orchestrator(OAuthOrchestratorHandlers, {
        accessTokenLifetime: 24 * 60 * 60, // One day
        issueRefreshToken: true,
        refreshTokenLifetime: 24 * 60 * 60 * 365, // One year
    });

export default OAuthOrchestrator;
