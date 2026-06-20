---
description: Lanza el subagente issue-planner para convertir una feature o tarea en un plan por fases (read-only, no escribe código).
---

Usa la herramienta Agent con `subagent_type: "issue-planner"` para planificar la siguiente tarea.

Tarea a planificar:

$ARGUMENTS

Pásale al subagente la descripción completa de la tarea. El subagente explorará el código relevante y devolverá un plan por fases con contratos explícitos (schema, server actions, hooks, componentes, orden de ejecución, verificación y preguntas abiertas). No implementes nada todavía — solo entrega el plan que produzca el subagente.
