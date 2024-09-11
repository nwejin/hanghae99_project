<div align="center">
  <br />
  <img src="https://github.com/user-attachments/assets/bbd42328-9caf-4f01-b32f-732e89334ffb" alt="멍냥터"  height="100px" />
  <br />
  <br />
</div>


## 🧑🏻‍💻 프로젝트 소개

> 반려동물과 함께하는 개인 일상 공유 SNS 서비스 입니다.
  
<div align="center"> 

| 프로젝트 명 | 멍냥터 |
| --- | --- |
| 개발 기간 | 2024.08.07 ~ 2024.09.04 (28일) |
| 배포 주소 |[배포 링크 🌎](https://hanghae99-project.vercel.app/) |
| 테스트 계정 email | admin@naver.com |
| 테스트 계정 password | 55good@@ |
</div>

## ⚙️ 기술 스택

#### FrontEnd
<div>
  <img src="https://img.shields.io/badge/next.js-v14.2.5-000000?style=for-the-badge&logo=nextdotjs&logoColor=white">
  <img src="https://img.shields.io/badge/typescript-v5.0-3178C6?style=for-the-badge&logo=typescript&logoColor=white">
  <img src="https://img.shields.io/badge/reactquery-v5.52.2-FF4154?style=for-the-badge&logo=reactquery&logoColor=white">
</div>
<div>
  <img src="https://img.shields.io/badge/reacthookform-EC5990?style=for-the-badge&logo=reacthookform&logoColor=white">
  <img src="https://img.shields.io/badge/zod-3E67B1?style=for-the-badge&logo=zod&logoColor=white">
  <img src="https://img.shields.io/badge/zustand-%2320232a.svg?style=for-the-badge&logo=zustand&logoColor=%2361DAFB"/>
</div>

#### Style
<div>
  <img src="https://img.shields.io/badge/tailwindcss-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white">
  <img src="https://img.shields.io/badge/shadcnui-000000?style=for-the-badge&logo=shadcnui&logoColor=white">
</div>

#### DataBase
<div>
   <img src="https://img.shields.io/badge/firebase-DD2C00?style=for-the-badge&logo=firebase&logoColor=white">
</div>

#### Deployment | Package Management
<div>
 <img src="https://img.shields.io/badge/vercel-000000?style=for-the-badge&logo=vercel&logoColor=white">
   <img src="https://img.shields.io/badge/npm-CB3837?style=for-the-badge&logo=npm&logoColor=white">
</div>

## 💻 주요 기능
피드백) 완성된 페이지 gif 파일로 미리보기 넣기 / 내용이 길어지면 토글로 열로 닫을 수 있게 만들기
피드백) 페이지별 말고 기능별로 분류 나누기 ex) 유저 검색, 게시글 작성 등..
피드백) 기능 설명은 간단하게 -> 여기서는 기술적인 부분보다는 기능적인 내용 위주로 작성 + ui/ux부분에 초점을 맞춰서 작성해보기

### [유저 인증]
> 초기 회원가입시 각 단계에 따라 회원 정보 입력이 가능하며 zod를 통해 유효성 검사를 진행합니다.
> 
> 유효성 검사 (zod) - 이메일: 이메일 형식 / 비밀번호: 대문자, 소문자, 특수문자 중 3종류 이상 포함
>
> firebase auth 유저 인증 및 sessionCookie 활용을 통한 로그인 인증 상태 관리


### [게시글 작성]
> 
- react-query 무한스크롤
- invalidateQueries를 활용한 자동 업데이트


### [유저 검색]
> 개인 프로필 페이지로 해당 유저 정보 및 게시글 조회가 가능합니다. ( /user/[nickname] )
- 본인 페이지의 경우 게시글 수정 / 삭제 가능


### [유저 정보 수정]
> 사용자의 회원 정보 / 반려동물 정보를 관리하는 페이지입니다. ( /accounts/[nickname] )


gif넣기

## 🔥 성능 최적화

|                                              웹 성능 최적화 전 (24.09.06 기준)                                              |                                     웹 성능 최적화 후 (24.00.00 기준)                                    |
| :---------------------------------------------------------------------------------------------------------: | :--------------------------------------------------------------------------------------------------------: |
| <img src="https://github.com/user-attachments/assets/f38c9028-e095-4766-a64c-d12fbfff38d1" alt="9/6_lighthouse" alt="웹 성능 최적화 전 분석 이미지" width="500px" /> | <img src="https://github.com/user-attachments/assets/f38c9028-e095-4766-a64c-d12fbfff38d1" alt="9/6_lighthouse" alt="웹 성능 최적화 후 분석 이미지" width="500px" /> |

|           항목           | 웹 성능 최적화 전 | 웹 성능 최적화 후 |
| :----------------------: | :---------------: | :---------------: |
|    Performance Score     |        80         |        00         |
|  First Contentful Paint  |       0.2s        |       0s        |
|       Speed Index        |       3.3s        |       0s        |
|   Total Blocking Time    |       90ms       |        0ms        |
| Largest Contentful Paint |       2.2s        |       0s        |
| Cumulative Layout Shift  |       0.06      |       00       |

- 기존 img 태그 -> next/image를 통한 이미지 최적화
피드백) 이미지 최적화 부분을 고민해서 진행하기 next/image는 내장 라이브러리라서 다른걸로 최적화 해보기
피드백) 개선사항은 이미지 말고 점수로만 기록해도 괜찮다

> 위의 작업들을 통해 Performance Score 62점 → 88점으로 개선, Speed Index 속도 3.5초 → 1.3초로 개선


## 🎯 트러블 슈팅

피드백) 단순한 에러 해결은 작성하지 말고 실제로 어떠한 부분을 적용할때 발생했던 에러
피드백) ex) 메인페이지에서 게시글을 작성했을때 작성한 게시글이 바로 업데이트되지 않아서 새로고침을 해야하는 문제 발생 -> 작성하는 동시에 바로 화면에 보여졌으면 좋겠음 -> 파이어베이스를 사용하니까 getDoc을 onSnapshot으로 변경해서 게시글이 추가되면 실시간 반영되게 -> 리액트쿼리 invalidateQueries로 쿼리키로 데이터를 불러오게 해서 해당 문제 처리

1. 회원가입 시 유저 정보 확인

## 💭 기술적 의사결정

피드백) 기술스택에서 해당 기술을 사용한 이유
피드백) 예를들어 리액트 쿼리를 왜 사용했는지 등... 구체적으로 써보기
피드백) 리액트 훅폼이나 조드를 어떤 이유에서 사용했는지.. 등
피드백) 비교군이 있으면 두개를 비교해서 ~~한 이유때문에 이걸 사용했다 등
피드백) 낙관적 업데이트를 왜 구현했는지 이유 

## ⚙️ 와이어프레임 / 유저 플로우 차트
피드백) 와이어프레임은 지워도 괜찮을듯 

> 디자인 툴 : Figma
> 
> 각 페이지 별 구조 설계 및 유저 플로우

<img src="https://github.com/user-attachments/assets/3c3ec36b-1844-42a2-9cdf-6ca0f72e97d9" alt="와이어프레임" style="width: 700px" />

> 디자인 툴 : miro
> 
> 각 페이지 별 구조 설계 및 유저 플로우
<img src="https://github.com/user-attachments/assets/0d94bbb2-4ca3-49b7-a34e-f18379561d42" alt="와이어프레임" style="width: 700px" />




## 🗂️ 폴더 구조
피드백) 폴더 구조 변경하기 컴포넌트 -> feature -> 각 페이지별 기능들 / common -> ui로 구분하기 
피드백) 너무 세분화해서 폴더 구조를 나눌 필요는 없을듯

```
📦app
 ┣ 📂(afterLogin)
 ┣ 📂(beforeLogin)
 ┣ 📂api
 ┃ ┣ 📂accounts
 ┃ ┣ 📂comment
 ┃ ┣ 📂like
 ┃ ┣ 📂login
 ┃ ┣ 📂logout
 ┃ ┣ 📂post
 ┃ ┣ 📂profile
 ┃ ┗ 📂search
📦components
 ┣ 📂_account
 ┣ 📂_main
 ┃ ┣ 📂_elements
 ┃ ┣ 📂_layouts
 ┃ ┗ 📂_ui
 ┣ 📂_newpost
 ┣ 📂_profile
 ┣ 📂_signup
 ┣ 📂common
 ┗ 📂ui
📦config
📦lib
 ┣ 📂accounts
 ┣ 📂comment
 ┣ 📂like
 ┣ 📂login
 ┣ 📂post
 ┗ 📂profile
📦public
📦schemas
📦shared
📦store
📦styles
📦utils

```
| 폴더명 |  | 설명 |
| --- | --- | --- |
| `components` | 각 페이지별 컴포넌트를 모아놓은 폴더   | |
| `components` |  `common` | 재사용 가능한 컴포넌트를 모아놓은 폴더  | 
| `app` | 각 페이지를 모아놓은 폴더   | |
| `hooks` | 커스텀 훅 선언   | |
| `interface` | 타입에 대한 정의를 모아놓은 폴더    | |
| `layout` | 컴포넌트 페이지 레이아웃을 모아놓은 폴더   | |
| `pages` | 컴포넌트 페이지를 모아놓은 폴더   | |
| `router` | 페이지 라우터 컴포넌트들을 모아놓은 폴더 | |
| `service` | 서버와 관련된 config 폴더 | |
| `store` | 전역 상태를 관리하기 위한 폴더 | |
| `styles` | 전역 스타일을 관리학 위한 폴더 | |
| `utils` | 유틸 함수를 모아놓은 폴더 | |








