// OAuthOrchestrator ---------------------------------------------------------

// Initialize OAuth handling for this application.

// External Modules ----------------------------------------------------------

const customEnv = require("custom-env");
customEnv.env(true);
import {Orchestrator} from "@craigmcc/oauth-orchestrator";

// Internal Modules ----------------------------------------------------------

import OAuthOrchestratorHandlers from "./OAuthOrchestratorHandlers";
export const OAuthOrchestrator: Orchestrator
    = new Orchestrator(OAuthOrchestratorHandlers, { issueRefreshToken: false });

export default OAuthOrchestrator;
