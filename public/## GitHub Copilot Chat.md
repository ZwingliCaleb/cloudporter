## GitHub Copilot Chat

- Extension Version: 0.22.4 (prod)
- VS Code: vscode/1.95.3
- OS: Linux
- Remote Name: wsl

## Network

User Settings:
```json
  "github.copilot.advanced": {
    "debug.useElectronFetcher": true,
    "debug.useNodeFetcher": false
  }
```

Connecting to https://api.github.com:
- DNS ipv4 Lookup: 20.87.245.6 (50 ms)
- DNS ipv6 Lookup: 64:ff9b::1457:f506 (29 ms)
- Electron Fetcher: Unavailable
- Node Fetcher: HTTP 200 (523 ms)
- Helix Fetcher (configured): HTTP 200 (608 ms)

Connecting to https://api.individual.githubcopilot.com/_ping:
- DNS ipv4 Lookup: 140.82.114.22 (5 ms)
- DNS ipv6 Lookup: 64:ff9b::8c52:7016 (23 ms)
- Electron Fetcher: Unavailable
- Node Fetcher: HTTP 200 (816 ms)
- Helix Fetcher (configured): HTTP 200 (793 ms)

## Documentation

In corporate networks: [Troubleshooting firewall settings for GitHub Copilot](https://docs.github.com/en/copilot/troubleshooting-github-copilot/troubleshooting-firewall-settings-for-github-copilot).