import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cdn.medium.com",
      },
      {
        protocol: "https",
        hostname: "miro.medium.com",
      },
      {
        protocol: "https",
        hostname: "*.medium.com",
      },
      {
        protocol: "https",
        hostname: "d2.naver.com",
      },
      {
        protocol: "https",
        hostname: "blog.banksalad.com",
      },
      {
        protocol: "https",
        hostname: "toss.tech",
      },
      {
        protocol: "https",
        hostname: "static.toss.im",
      },
      {
        protocol: "https",
        hostname: "tech.kakao.com",
      },
      {
        protocol: "https",
        hostname: "tech.kakaoenterprise.com",
      },
      {
        protocol: "https",
        hostname: "techblog.woowahan.com",
      },
      {
        protocol: "https",
        hostname: "helloworld.kurly.com",
      },
      {
        protocol: "https",
        hostname: "tech.devsisters.com",
      },
      {
        protocol: "https",
        hostname: "techblog.lycorp.co.jp",
      },
      {
        protocol: "https",
        hostname: "tech.socarcorp.kr",
      },
      {
        protocol: "https",
        hostname: "www.ridicorp.com",
      },
      {
        protocol: "https",
        hostname: "meetup.toast.com",
      },
      {
        protocol: "https",
        hostname: "techblog.lotteon.com",
      },
      {
        protocol: "https",
        hostname: "techblog.gccompany.co.kr",
      },
      {
        protocol: "https",
        hostname: "netmarble.engineering",
      },
      {
        protocol: "https",
        hostname: "engineering-skcc.github.io",
      },
      {
        protocol: "https",
        hostname: "yanolja.github.io",
      },
      {
        protocol: "https",
        hostname: "hyperconnect.github.io",
      },
      {
        protocol: "https",
        hostname: "tech.inflab.com",
      },
      {
        protocol: "https",
        hostname: "techblog.yogiyo.co.kr",
      },
      {
        protocol: "https",
        hostname: "www.itdaily.kr",
      },
      {
        protocol: "https",
        hostname: "it.donga.com",
      },
      // 일반적인 CDN 및 이미지 호스팅 서비스
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
    ],
  },
  async headers() {
    return [
      {
        source: "/api/:path*",
        headers: [
          {
            key: "Access-Control-Allow-Origin",
            value: "*",
          },
          {
            key: "Access-Control-Allow-Methods",
            value: "GET, POST, PUT, DELETE, OPTIONS",
          },
          {
            key: "Access-Control-Allow-Headers",
            value: "Content-Type, Authorization",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
