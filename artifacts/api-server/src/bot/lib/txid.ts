import { createHash } from "node:crypto";

/** Read-only lookup of a blockchain transaction on public explorers / RPCs. */

export type TxResult = {
  chain: string;
  status: "confirmed" | "pending" | "failed";
  confirmations?: number;
  block?: number;
  time?: number; // unix seconds
  amount?: string;
  fee?: string;
  from?: string;
  to?: string;
  token?: string; // e.g. "250 USDT"
  url: string;
};

export const CHAINS = ["btc", "ltc", "doge", "eth", "bsc", "polygon", "trx", "sol"] as const;
export type Chain = (typeof CHAINS)[number];

const T = () => AbortSignal.timeout(8000);
const fmt = (n: number, max = 8) => n.toLocaleString("de-DE", { maximumFractionDigits: max });

async function getJson(url: string, init?: RequestInit) {
  const r = await fetch(url, { ...init, signal: T() });
  if (!r.ok) throw new Error(`HTTP ${r.status}`);
  return r.json() as Promise<any>;
}

// ---------- BTC / LTC (mempool.space-style API) ----------
async function esplora(chain: "btc" | "ltc", id: string): Promise<TxResult | null> {
  const base = chain === "btc" ? "https://mempool.space" : "https://litecoinspace.org";
  const sym = chain === "btc" ? "BTC" : "LTC";
  const r = await fetch(`${base}/api/tx/${id}`, { signal: T() });
  if (r.status === 400 || r.status === 404) return null;
  if (!r.ok) throw new Error(`HTTP ${r.status}`);
  const tx = (await r.json()) as any;
  let confirmations = 0;
  if (tx.status?.confirmed) {
    const tip = Number(await (await fetch(`${base}/api/blocks/tip/height`, { signal: T() })).text());
    confirmations = tip - tx.status.block_height + 1;
  }
  const out = (tx.vout ?? []).reduce((a: number, o: any) => a + (o.value ?? 0), 0) / 1e8;
  return {
    chain: sym,
    status: tx.status?.confirmed ? "confirmed" : "pending",
    confirmations,
    block: tx.status?.block_height,
    time: tx.status?.block_time,
    amount: `${fmt(out)} ${sym}`,
    fee: tx.fee != null ? `${fmt(tx.fee / 1e8)} ${sym}` : undefined,
    from: tx.vin?.[0]?.prevout?.scriptpubkey_address,
    to: tx.vout?.[0]?.scriptpubkey_address,
    url: `${base}/tx/${id}`,
  };
}

// ---------- DOGE (blockcypher) ----------
async function doge(id: string): Promise<TxResult | null> {
  const r = await fetch(`https://api.blockcypher.com/v1/doge/main/txs/${id}`, { signal: T() });
  if (r.status === 404) return null;
  if (!r.ok) throw new Error(`HTTP ${r.status}`);
  const tx = (await r.json()) as any;
  return {
    chain: "DOGE",
    status: (tx.confirmations ?? 0) > 0 ? "confirmed" : "pending",
    confirmations: tx.confirmations,
    block: tx.block_height > 0 ? tx.block_height : undefined,
    time: tx.confirmed ? Math.floor(Date.parse(tx.confirmed) / 1000) : undefined,
    amount: `${fmt((tx.total ?? 0) / 1e8)} DOGE`,
    fee: `${fmt((tx.fees ?? 0) / 1e8)} DOGE`,
    from: tx.inputs?.[0]?.addresses?.[0],
    to: tx.outputs?.[0]?.addresses?.[0],
    url: `https://blockchair.com/dogecoin/transaction/${id}`,
  };
}

// ---------- EVM (ETH / BSC / Polygon) ----------
const EVM = {
  eth: { name: "ETH", rpc: "https://ethereum-rpc.publicnode.com", sym: "ETH", explorer: "https://etherscan.io/tx/" },
  bsc: { name: "BSC", rpc: "https://bsc-rpc.publicnode.com", sym: "BNB", explorer: "https://bscscan.com/tx/" },
  polygon: { name: "Polygon", rpc: "https://polygon-bor-rpc.publicnode.com", sym: "POL", explorer: "https://polygonscan.com/tx/" },
} as const;

async function rpc(url: string, method: string, params: unknown[]) {
  const j = await getJson(url, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ jsonrpc: "2.0", id: 1, method, params }),
  });
  if (j.error) throw new Error(j.error.message ?? "rpc error");
  return j.result;
}

const big = (h?: string | null) => (h ? BigInt(h) : 0n);
function units(v: bigint, decimals: number, max = 6) {
  const neg = v < 0n;
  if (neg) v = -v;
  const s = v.toString().padStart(decimals + 1, "0");
  const n = Number(`${s.slice(0, s.length - decimals)}.${s.slice(s.length - decimals)}`);
  return (neg ? "-" : "") + fmt(n, max);
}

function decodeAbiString(hex: string): string {
  const h = hex.replace(/^0x/, "");
  if (h.length === 64) return Buffer.from(h, "hex").toString("utf8").replace(/\0+$/, ""); // bytes32
  if (h.length < 128) return "";
  const len = parseInt(h.slice(64, 128), 16);
  return Buffer.from(h.slice(128, 128 + len * 2), "hex").toString("utf8");
}

async function evm(chain: keyof typeof EVM, id: string): Promise<TxResult | null> {
  const c = EVM[chain];
  const tx = await rpc(c.rpc, "eth_getTransactionByHash", [id]);
  if (!tx) return null;
  const [receipt, head] = await Promise.all([
    rpc(c.rpc, "eth_getTransactionReceipt", [id]),
    rpc(c.rpc, "eth_blockNumber", []),
  ]);
  const blockNum = tx.blockNumber ? Number(big(tx.blockNumber)) : undefined;
  let time: number | undefined;
  if (tx.blockNumber) {
    const blk = await rpc(c.rpc, "eth_getBlockByNumber", [tx.blockNumber, false]).catch(() => null);
    if (blk?.timestamp) time = Number(big(blk.timestamp));
  }
  const gasPrice = big(receipt?.effectiveGasPrice ?? tx.gasPrice);
  const fee = receipt ? units(big(receipt.gasUsed) * gasPrice, 18) : undefined;

  let token: string | undefined;
  let to: string | undefined = tx.to ?? undefined;
  const input: string = tx.input ?? "0x";
  if (input.startsWith("0xa9059cbb") && input.length >= 138 && tx.to) {
    to = "0x" + input.slice(34, 74);
    const raw = BigInt("0x" + input.slice(74, 138));
    const [dec, sym] = await Promise.all([
      rpc(c.rpc, "eth_call", [{ to: tx.to, data: "0x313ce567" }, "latest"]).catch(() => null),
      rpc(c.rpc, "eth_call", [{ to: tx.to, data: "0x95d89b41" }, "latest"]).catch(() => null),
    ]);
    const decimals = dec ? Number(big(dec)) : 18;
    token = `${units(raw, decimals)} ${(sym && decodeAbiString(sym)) || "Token"}`;
  }

  return {
    chain: c.name,
    status: !receipt ? "pending" : receipt.status === "0x1" ? "confirmed" : "failed",
    confirmations: blockNum != null ? Number(big(head)) - blockNum + 1 : 0,
    block: blockNum,
    time,
    amount: `${units(big(tx.value), 18)} ${c.sym}`,
    fee: fee ? `${fee} ${c.sym}` : undefined,
    from: tx.from,
    to,
    token,
    url: c.explorer + id,
  };
}

// ---------- TRON ----------
const B58 = "123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz";
function base58check(hex: string) {
  const bytes = Buffer.from(hex, "hex");
  const sum = createHash("sha256").update(createHash("sha256").update(bytes).digest()).digest().subarray(0, 4);
  const buf = Buffer.concat([bytes, sum]);
  let n = BigInt("0x" + buf.toString("hex"));
  let out = "";
  while (n > 0n) {
    out = B58[Number(n % 58n)] + out;
    n /= 58n;
  }
  for (const b of buf) {
    if (b !== 0) break;
    out = "1" + out;
  }
  return out;
}
const tronAddr = (hex?: string) => (hex ? base58check(hex.length === 40 ? "41" + hex : hex) : undefined);
const TRC20: Record<string, [string, number]> = {
  TR7NHqjeKQxGTCi8q8ZY4pL8otSzgjLj6t: ["USDT", 6],
  TEkxiTehnzSmSe2XqrBj4w32RUN966rdz8: ["USDC", 6],
};

async function tron(id: string): Promise<TxResult | null> {
  const post = (path: string) =>
    getJson(`https://api.trongrid.io/wallet/${path}`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ value: id }),
    });
  const tx = await post("gettransactionbyid");
  if (!tx?.txID) return null;
  const info = await post("gettransactioninfobyid").catch(() => ({}));
  const ct = tx.raw_data?.contract?.[0];
  const v = ct?.parameter?.value ?? {};
  let amount: string | undefined;
  let token: string | undefined;
  let to = tronAddr(v.to_address);
  if (ct?.type === "TransferContract") amount = `${units(BigInt(v.amount ?? 0), 6)} TRX`;
  if (ct?.type === "TriggerSmartContract" && typeof v.data === "string" && v.data.startsWith("a9059cbb")) {
    to = tronAddr(v.data.slice(32, 72));
    const contract = tronAddr(v.contract_address) ?? "";
    const [sym, dec] = TRC20[contract] ?? ["Token", 6];
    token = `${units(BigInt("0x" + v.data.slice(72, 136)), dec)} ${sym}`;
  }
  const ret = tx.ret?.[0]?.contractRet;
  const failed = (ret && ret !== "SUCCESS") || info?.receipt?.result === "REVERT";
  return {
    chain: "TRON",
    status: failed ? "failed" : info?.blockNumber ? "confirmed" : "pending",
    block: info?.blockNumber,
    time: info?.blockTimeStamp ? Math.floor(info.blockTimeStamp / 1000) : undefined,
    amount,
    token,
    fee: info?.fee != null ? `${units(BigInt(info.fee), 6)} TRX` : undefined,
    from: tronAddr(v.owner_address),
    to,
    url: `https://tronscan.org/#/transaction/${id}`,
  };
}

// ---------- Solana ----------
async function sol(id: string): Promise<TxResult | null> {
  const tx = await rpc("https://api.mainnet-beta.solana.com", "getTransaction", [
    id,
    { encoding: "json", maxSupportedTransactionVersion: 0, commitment: "confirmed" },
  ]);
  if (!tx) return null;
  const keys: string[] = tx.transaction?.message?.accountKeys ?? [];
  const pre: number[] = tx.meta?.preBalances ?? [];
  const post: number[] = tx.meta?.postBalances ?? [];
  const moved = keys.length > 1 ? Math.abs((post[1] ?? 0) - (pre[1] ?? 0)) / 1e9 : 0;
  return {
    chain: "Solana",
    status: tx.meta?.err ? "failed" : "confirmed",
    block: tx.slot,
    time: tx.blockTime ?? undefined,
    amount: moved ? `${fmt(moved, 9)} SOL` : undefined,
    fee: tx.meta?.fee != null ? `${fmt(tx.meta.fee / 1e9, 9)} SOL` : undefined,
    from: keys[0],
    to: keys[1],
    url: `https://solscan.io/tx/${id}`,
  };
}

const LOOKUP: Record<Chain, (id: string) => Promise<TxResult | null>> = {
  btc: (id) => esplora("btc", id),
  ltc: (id) => esplora("ltc", id),
  doge,
  eth: (id) => evm("eth", id),
  bsc: (id) => evm("bsc", id),
  polygon: (id) => evm("polygon", id),
  trx: tron,
  sol,
};

export function guessChains(id: string): Chain[] {
  if (/^0x[0-9a-fA-F]{64}$/.test(id)) return ["eth", "bsc", "polygon"];
  if (/^[0-9a-fA-F]{64}$/.test(id)) return ["btc", "trx", "ltc", "doge"];
  if (/^[1-9A-HJ-NP-Za-km-z]{80,90}$/.test(id)) return ["sol"];
  return [];
}

export async function lookupTx(id: string, chain?: Chain): Promise<TxResult | null> {
  const list = chain ? [chain] : guessChains(id);
  for (const c of list) {
    const hash = ["eth", "bsc", "polygon"].includes(c) && !id.startsWith("0x") ? "0x" + id : id;
    try {
      const r = await LOOKUP[c](hash);
      if (r) return r;
    } catch {
      /* try next chain */
    }
  }
  return null;
}
