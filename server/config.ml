let snowtrace_url address =
  "https://api-testnet.snowtrace.io/api?module=account&action=tokennfttx&address="
  ^ address ^ "&sort=asc"
