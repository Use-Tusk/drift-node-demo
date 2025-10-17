<p align="center">
  <img src="https://github.com/Use-Tusk/drift-node-sdk/raw/main/images/tusk-banner.png" alt="Tusk Drift Banner">
</p>

# Tusk Drift Demo - Node.js Service

Welcome to the Tusk Drift demo! This repository demonstrates how Tusk Drift automatically generates API tests from real traffic, helping you catch regressions before they reach production.

**🚀 Get started in under 2 minutes**

## What You'll Experience

This demo includes a simple Express.js API service that integrates with external APIs. You'll:

1. ✅ Run realistic API tests in seconds (no setup needed!)
2. 🐛 See how Tusk catches bugs by detecting API behavior changes
3. 📚 Learn how to record your own tests from real traffic
4. ☁️ Discover Tusk Cloud's intelligent test suite management

## Two Ways to Use Tusk

Both use the same open-source CLI and SDK. This demo shows the **standalone workflow**.

### Standalone

Record traces locally, save them to `.tusk/traces/`, and replay with `tusk run`. You manage which traces to keep.

**Saves time vs. writing API tests manually.**

### With Tusk Cloud

Record from dev/production (at low sampling rates), and Cloud handles trace curation automatically. When you run `tusk run` in CI, it pulls your curated suite from Cloud and reports results. If tests fail, you get PR comments showing what changed and suggested fixes.

**A self-maintaining API test suite based on actual traffic.**

## Quick Start

### Prerequisites

- Node.js v22.18.0+ (we recommend using [nvm](https://github.com/nvm-sh/nvm))
- npm

### 1. Clone and Install

```bash
# Clone the repository
git clone https://github.com/Use-Tusk/drift-node-demo.git
cd drift-node-demo

# Install Node.js version (if using nvm)
nvm use

# Install dependencies
npm install
```

### 2. Install Tusk CLI

**macOS/Linux:**

```bash
curl -fsSL https://raw.githubusercontent.com/Use-Tusk/tusk-drift-cli/main/install.sh | sh
```

**Windows:**

Download the latest release from [Tusk CLI Releases](https://github.com/Use-Tusk/tusk-drift-cli/releases/latest)

Full installation guide: [Tusk CLI Installation](https://github.com/Use-Tusk/tusk-drift-cli?tab=readme-ov-file#install)

### 3. Run the Tests

This repository includes **pre-recorded test traces** from real API traffic (in `.tusk/traces/`), so you can see Tusk Drift in action immediately without recording anything yourself.

```bash
# Run all pre-recorded API tests
tusk run
```

You should see output showing tests running against the Express server with deterministic mocks.

**🎉 Success!** You just replayed real API tests with zero setup.

> **Note:** These tests were recorded from actual API calls made to this service. Later in this guide, we'll show you how to record your own tests from scratch.

## What's Happening Under the Hood?

This demo repo includes:

- **Express.js Server** (`server.ts`) - API service with multiple external integrations
- **Pre-recorded Traces** (`.tusk/traces/`) - Real API call recordings in JSONL format
- **Tusk Configuration** (`.tusk/config.yaml`) - Service configuration for test replay

When you run `tusk run`, the CLI:

1. Starts your Express server (using configuration in `.tusk/config.yaml`)
2. Replays the recorded inbound HTTP requests
3. Mocks all outbound requests (external APIs or database calls) using recorded responses
4. Compares actual vs. expected API responses
5. Reports any deviations

## Detecting Bugs with Tusk

Want to see Tusk catch a bug? Switch to the `buggy-branch` branch:

```bash
git checkout buggy-branch
tusk run
```

This branch introduces a subtle bug by converting the temperature from Celsius to Fahrenheit without updating the temperature thresholds used to determine activity recommendations.

Tusk Drift will detect the deviation in the `/api/weather-activity` endpoint and mark the test as failed.

Changes in `buggy-branch`:

```diff
@@ -8,6 +8,10 @@ const PORT = 3000;

 app.use(express.json());

+const convertCelsiusToFahrenheit = (celsius: number) => {
+  return (celsius * 9/5) + 32;
+};
+
 // GET /api/weather-activity - Get location from IP, weather, and activity recommendations
 app.get('/api/weather-activity', async (req: Request, res: Response) => {
   try {
@@ -24,6 +28,8 @@ app.get('/api/weather-activity', async (req: Request, res: Response) => {
     );
     const weather = weatherResponse.data.current_weather;

+    weather.temperature = convertCelsiusToFahrenheit(weather.temperature);
+
     // Business logic: Recommend activity based on weather
     let recommendedActivity = 'Play a board game';
     if (weather.temperature > 40) {
```

## How Tusk Drift Works

Tusk Drift consists of three components:

### 1. **Tusk Drift SDK** (Recording)

The SDK instruments your application to record all inbound and outbound traffic:

- **Inbound requests**: HTTP requests to your service (headers, body, query params)
- **Outbound requests**: External API calls, database queries, etc.
- **Deterministic Replay**: Records responses for exact replay during testing
- **Minimal Overhead**: Low sampling rates for production use
- **PII Protection**: Redact sensitive data and blacklist endpoints

[See full list of supported packages →](https://github.com/Use-Tusk/drift-node-sdk#requirements)

### 2. **Tusk CLI** (Replay)

The CLI replays recorded traces against your service:

- Spins up your service locally
- Sends the recorded inbound requests
- Intercepts outbound calls and returns mocked responses
- Detects deviations in API responses

**Key Commands:**
- `tusk init` - Initialize Tusk for a new service
- `tusk list` - List available traces
- `tusk run` - Replay local traces

### 3. **Tusk Cloud** (Optional)

Tusk Cloud adds automated trace curation and failure analysis on top of the open-source CLI/SDK.

Features include:

- **Automatic Test Suite Creation**: Intelligently selects representative traces from user traffic
- **CI/CD Integration**: Run tests in GitHub Actions, GitLab CI, etc. with PR comments showing test results
- **Deviation Classification**: AI-powered classification of failing tests as either intended or unintended + auto-fixes
- **Test Maintenance**: Automatically updates/removes outdated tests

## Recording Your Own Tests

This demo uses pre-recorded traces, but you can record new ones for this service from real traffic:

### 1. Start in Record Mode

```bash
git checkout main
npm run start:record
```

This sets `TUSK_DRIFT_MODE=record` and starts the server.

### 2. Generate Traffic

```bash
# Make some API calls
curl http://localhost:3000/api/weather-activity
curl http://localhost:3000/api/user/1
curl http://localhost:3000/api/post/5
```

Wait a few seconds and then stop the server with `Ctrl+C`. Your newly recorded traces are now in `.tusk/traces/`!

### 3. View and Replay Tests

View the newly recorded tests:

```bash
tusk list
```

Replay the tests:

```bash
tusk run
```

## Next Steps

### Use Tusk on Your Own Service

1. **Initialize a service using the Tusk CLI**: Follow the [Tusk CLI quick start guide](https://github.com/Use-Tusk/tusk-drift-cli?tab=readme-ov-file#quick-start)
2. **Install the Tusk Drift SDK**: Follow the [Node SDK setup guide](https://github.com/Use-Tusk/drift-node-sdk#installation)
3. **Record traces**: Capture traffic locally or in dev/staging environments to let Tusk automatically create a test suite
4. **Replay in CI**: Add `tusk run` to your test pipeline
5. **Catch regressions**: Get notified via PR comments when API behavior changes

### Try Tusk Cloud

Sign up at [usetusk.ai](https://usetusk.ai) to unlock:

- Intelligent test suite curation
- AI-powered deviation classification
- Team collaboration features
- PR integration with GitHub/GitLab


## FAQ

### Do I need to modify my application code?

Minimal changes - just initialize the SDK at startup and call `TuskDrift.markAppAsReady()` when your app is ready to accept requests.

### What about PII and sensitive data?

Tusk supports PII and sensitive data masking. You can:

- Blacklist specific endpoints
- Configure custom redaction rules based on request/response patterns
- Keep all data local (no cloud export)

### Can I use this in production?

Yes! Use a low sampling rate (e.g., 1-5%) to minimize overhead. Most teams start by recording in staging/dev environments and then switch to production traffic to capture representative traffic.

### What about non-deterministic data (timestamps, UUIDs)?

Tusk has built-in rules for dynamic fields. You can customize these in `.tusk/config.yaml` to handle application-specific dynamic data.


### How does this compare to traditional mocking?

Traditional mocking requires:
- Manual mock creation and maintenance
- Keeping mocks in sync with real APIs
- Guessing at edge cases

Tusk Drift:
- Automatically captures real API behavior
- Updates tests based on actual traffic
- Finds edge cases you didn't know existed

## Resources

- [Tusk CLI Repository](https://github.com/Use-Tusk/tusk-drift-cli)
- [Node SDK Repository](https://github.com/Use-Tusk/drift-node-sdk)
- [Documentation](https://docs.usetusk.ai)

## Community

Join our open source community on [Slack](https://join.slack.com/t/tusk-community/shared_invite/zt-3fve1s7ie-NAAUn~UpHsf1m_2tdoGjsQ).

## Support

Questions? Reach out:

- 📧 Email: [support@usetusk.ai](mailto:support@usetusk.ai)
- 🐛 Issues: [GitHub Issues](https://github.com/Use-Tusk/drift-node-demo/issues)
- 𝕏 Twitter: [@usetusk](https://twitter.com/usetusk)

---

**Ready to catch bugs before production?** [Get started with Tusk Drift →](https://github.com/Use-Tusk/drift-node-sdk)
