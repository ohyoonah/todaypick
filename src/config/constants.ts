// route
export const ROUTE_PATH = {
  HOME: "/",
  LOGIN: "/login",
  SIGNUP: "/signup",
  PROFILE: "/profile",
  FEEDS: "/feeds", // 피드 전체보기 페이지
} as const;

// 폼 데이터
export const FORM_DATA = {
  EMAIL: "email",
  PASSWORD: "password",
  CONFIRM_PASSWORD: "confirmPassword",
  NICKNAME: "nickname",
} as const;

// Feed 카테고리
export const FEED_CATEGORY = {
  IT_NEWS: "it_news",
  TECH_BLOG: "tech_blog",
} as const;
