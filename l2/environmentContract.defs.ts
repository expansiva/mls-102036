/// <mls fileReference="_102036_/l2/environmentContract.defs.ts" enhancement="_blank"/>

export const asis: mls.defs.AsIs =
{
  "meta": {
    "fileReference": "_102036_/l2/environmentContract.ts",
    "componentType": "other",
    "componentScope": "appFrontEnd",
    "devFidelity": "final"
  },
  "references": {
    "imports": [
      {
        "ref": "/_102036_/l2/shared/interfaces.js",
        "dependencies": [
          {
            "name": "IAgentMeta"
          },
          {
            "name": "IOpenClawIntegration"
          },
          {
            "name": "Thread"
          },
          {
            "name": "ToolsBeforeSendMessage"
          },
          {
            "name": "ExecutionContext"
          },
          {
            "name": "TaskData"
          },
          {
            "name": "Message"
          }
        ]
      }
    ]
  },
  "asIs": {
    "semantic": {
      "generalDescription": "Defines environment contract and runtime for CollabMessages integration.",
      "businessCapabilities": [
        "Integration of agents, bots, tasks, and notifications in CollabMessages environment"
      ],
      "technicalCapabilities": [
        "Environment contract interface for CollabMessages",
        "Runtime type definitions for environment modules",
        "Default implementations for environment modules",
        "Global environment setter and getter",
        "Facade for accessing environment features"
      ],
      "implementedFeatures": [
        "CollabMessagesEnvironment interface",
        "Runtime types for notifications, bots, agents, tasks, config",
        "Default fallback implementations",
        "Global environment setter (setEnvironment)",
        "Global environment getter (getEnv)",
        "Normalizers for environment modules",
        "Facade object (environment) exposing all features"
      ],
      "constraints": [
        "Only features explicitly present in the environment object or defaults are available"
      ]
    }
  }
}
