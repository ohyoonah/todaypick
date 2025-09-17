import { Quiz } from "@/types/quiz";

export const quizzes: Quiz[] = [
  {
    id: "1",
    question: "다음 중 JavaScript에서 변수를 선언하는 방법이 아닌 것은?",
    options: ["var", "let", "const", "variable"],
    correct_answer: 3,
    explanation:
      "JavaScript에서 변수 선언 키워드는 var, let, const입니다. variable은 변수 선언 키워드가 아닙니다.",
    category: "programming",
    created_at: new Date().toISOString(),
  },
  {
    id: "2",
    question: "HTTP 상태 코드 404의 의미는?",
    options: [
      "서버 오류",
      "권한 없음",
      "페이지를 찾을 수 없음",
      "요청이 성공함",
    ],
    correct_answer: 2,
    explanation:
      'HTTP 404 상태 코드는 "Not Found"를 의미하며, 요청한 리소스를 찾을 수 없을 때 반환됩니다.',
    category: "web",
    created_at: new Date().toISOString(),
  },
  {
    id: "3",
    question: "다음 중 관계형 데이터베이스의 특징이 아닌 것은?",
    options: [
      "ACID 속성 보장",
      "테이블 구조",
      "NoSQL 문서 기반",
      "SQL 쿼리 사용",
    ],
    correct_answer: 2,
    explanation:
      "NoSQL 문서 기반은 관계형 데이터베이스의 특징이 아닙니다. 관계형 데이터베이스는 테이블 구조를 가지고 ACID 속성을 보장하며 SQL을 사용합니다.",
    category: "database",
    created_at: new Date().toISOString(),
  },
  {
    id: "4",
    question: "다음 중 가장 안전한 비밀번호 정책은?",
    options: [
      "8자 이상, 대소문자 포함",
      "12자 이상, 대소문자, 숫자, 특수문자 포함",
      "6자 이상, 숫자 포함",
      "10자 이상, 대소문자 포함",
    ],
    correct_answer: 1,
    explanation:
      "12자 이상의 길이에 대소문자, 숫자, 특수문자를 모두 포함하는 비밀번호가 가장 안전합니다. 길이가 길수록 브루트포스 공격에 대한 저항력이 높아집니다.",
    category: "security",
    created_at: new Date().toISOString(),
  },
  {
    id: "5",
    question: "Docker 컨테이너와 가상머신(VM)의 주요 차이점은?",
    options: [
      "Docker는 더 많은 리소스를 사용함",
      "VM은 호스트 OS를 공유함",
      "Docker는 호스트 OS 커널을 공유함",
      "VM이 더 빠르게 시작됨",
    ],
    correct_answer: 2,
    explanation:
      "Docker 컨테이너는 호스트 OS의 커널을 공유하여 더 가볍고 빠르게 실행됩니다. 반면 VM은 각각 독립적인 OS를 실행합니다.",
    category: "devops",
    created_at: new Date().toISOString(),
  },
  {
    id: "6",
    question: "다음 중 RESTful API 설계 원칙이 아닌 것은?",
    options: [
      "무상태성(Stateless)",
      "캐시 가능(Cacheable)",
      "계층형 시스템(Layered System)",
      "동기식 처리(Synchronous)",
    ],
    correct_answer: 3,
    explanation:
      "RESTful API는 비동기식 처리를 지원하며, 동기식 처리는 REST의 설계 원칙이 아닙니다. REST의 주요 원칙은 무상태성, 캐시 가능, 계층형 시스템 등입니다.",
    category: "web",
    created_at: new Date().toISOString(),
  },
  {
    id: "7",
    question: "다음 중 Git에서 브랜치를 병합하는 명령어는?",
    options: ["git branch", "git merge", "git checkout", "git clone"],
    correct_answer: 1,
    explanation:
      "git merge 명령어는 브랜치를 병합할 때 사용합니다. git branch는 브랜치 목록을 보거나 생성할 때, git checkout은 브랜치를 전환할 때, git clone은 저장소를 복제할 때 사용합니다.",
    category: "programming",
    created_at: new Date().toISOString(),
  },
  {
    id: "8",
    question: "다음 중 클라우드 컴퓨팅의 주요 모델이 아닌 것은?",
    options: [
      "IaaS (Infrastructure as a Service)",
      "PaaS (Platform as a Service)",
      "SaaS (Software as a Service)",
      "DaaS (Data as a Service)",
    ],
    correct_answer: 3,
    explanation:
      "클라우드 컴퓨팅의 주요 모델은 IaaS, PaaS, SaaS입니다. DaaS는 일반적인 클라우드 서비스 모델이 아닙니다.",
    category: "cloud",
    created_at: new Date().toISOString(),
  },
  {
    id: "9",
    question: "다음 중 시간 복잡도가 O(log n)인 알고리즘은?",
    options: ["선형 검색", "이진 검색", "버블 정렬", "선택 정렬"],
    correct_answer: 1,
    explanation:
      "이진 검색은 정렬된 배열에서 중간값을 기준으로 검색 범위를 절반씩 줄여나가므로 시간 복잡도가 O(log n)입니다.",
    category: "algorithm",
    created_at: new Date().toISOString(),
  },
  {
    id: "10",
    question: "다음 중 HTTPS의 보안 기능이 아닌 것은?",
    options: ["데이터 암호화", "서버 인증", "데이터 무결성", "방화벽 보호"],
    correct_answer: 3,
    explanation:
      "HTTPS는 데이터 암호화, 서버 인증, 데이터 무결성을 제공하지만 방화벽 보호는 제공하지 않습니다. 방화벽은 네트워크 레벨에서의 보안 기능입니다.",
    category: "security",
    created_at: new Date().toISOString(),
  },
];
