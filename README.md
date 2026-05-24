# @moibe/falai-nucleo

Shared, framework-agnostic core for fal.ai-powered projects. Bundles the endpoint catalog, per-provider option metadata, cost helpers, and pure async factories that wrap fal.ai queue submissions/statuses. Consumed locally via a `file:` dependency from sibling apps (e.g. `studio`); not published to npm. Adapters that depend on a specific framework (SvelteKit, Next, etc.) live in the consumer projects.
