'use client'
import { WagmiProvider, type Config } from 'wagmi'
import type { ReactNode } from 'react'
import { sepolia } from 'wagmi/chains'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { getDefaultConfig, RainbowKitProvider } from '@rainbow-me/rainbowkit'

import '@rainbow-me/rainbowkit/styles.css'

const queryClient = new QueryClient()

const config = getDefaultConfig({
  appName: 'Hello Dapp',
  projectId: process.env.WALLETCONNECT_PROJECT_ID!,
  chains: [sepolia],
  ssr: true,
}) as Config

export default function WalletProvider({ children }: { children: ReactNode }) {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider>{children}</RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  )
}
