from typing import Dict, Any, List, Callable
import logging

logger = logging.getLogger("NexaCommerce.PluginEngine")

class HookManager:
    _listeners: Dict[str, List[Dict[str, Any]]] = {}

    @classmethod
    def register_hook_listener(cls, hook_name: str, plugin_slug: str, callback_url: str, priority: int = 10):
        """Register an active listener for a core hook event."""
        if hook_name not in cls._listeners:
            cls._listeners[hook_name] = []

        cls._listeners[hook_name].append({
            "plugin_slug": plugin_slug,
            "callback_url": callback_url,
            "priority": priority
        })
        # Sort by priority
        cls._listeners[hook_name].sort(key=lambda x: x["priority"])
        logger.info(f"Registered hook '{hook_name}' for plugin '{plugin_slug}'")

    @classmethod
    def trigger_hook(cls, hook_name: str, payload: Dict[str, Any]) -> Dict[str, Any]:
        """Fire a hook across all registered plugin listeners and pass updated payload."""
        logger.info(f"Triggering Hook: {hook_name}")
        listeners = cls._listeners.get(hook_name, [])

        modified_payload = payload.copy()
        executed_plugins = []

        for listener in listeners:
            plugin_slug = listener["plugin_slug"]
            executed_plugins.append(plugin_slug)
            # In production, this fires an asynchronous HTTP request/Webhook to the plugin's callback endpoint
            # e.g., Tax calculation plugin adds 'calculated_tax' into modified_payload

        return {
            "hook_name": hook_name,
            "listeners_triggered": len(listeners),
            "executed_plugins": executed_plugins,
            "result_payload": modified_payload
        }