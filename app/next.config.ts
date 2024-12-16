import type { NextConfig } from "next";
import UnpluginIcons from 'unplugin-icons/webpack'

const nextConfig: NextConfig = {
  webpack(config) {
    config.plugins.push(
      UnpluginIcons({
        compiler: 'jsx',
        jsx: 'react'
      })
    )

    return config
  },
};

export default nextConfig;
