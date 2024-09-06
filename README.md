<div align="center">
  <br />
  <img src="https://github.com/user-attachments/assets/bbd42328-9caf-4f01-b32f-732e89334ffb" alt="멍냥터"  height="100px" />
  <br />
  <br />
</div>


## 🧑🏻‍💻 프로젝트 소개

<div align="center"> 
<p>반려동물과 함께하는 개인 일상 공유 SNS 서비스 입니다.<p/>

| 프로젝트 명 | 멍냥터 |
| --- | --- |
| 개발 기간 | 2024.08.07 ~ 2024.09.04 (28일) |
| 배포 주소 |[배포 링크 🌎](https://hanghae99-project.vercel.app/) |
| 테스트 계정 email | admin@naver.com |
| 테스트 계정 password | 55good@@ |
</div>


## ⚙️ 기술 스택
<div>
  <img src="https://img.shields.io/badge/nextdotjs-000000?style=for-the-badge&logo=react&logoColor=white">
  <img src="https://img.shields.io/badge/typescript-3178C6?style=for-the-badge&logo=react&logoColor=white">
  <img src="https://img.shields.io/badge/firebase-DD2C00?style=for-the-badge&logo=react&logoColor=white">
  <br />
  <br />
  <img src="https://img.shields.io/badge/reactquery-FF4154?style=for-the-badge&logo=react&logoColor=white">
  <img src="https://img.shields.io/badge/reacthookform-EC5990?style=for-the-badge&logo=react&logoColor=white">
  <img src="https://img.shields.io/badge/zod-3E67B1?style=for-the-badge&logo=npm&logoColor=white">
   <img src="https://img.shields.io/badge/zustand-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB"/>
  <br />
  <br />
  <img src="https://img.shields.io/badge/tailwindcss-06B6D4?style=for-the-badge&logo=sass&logoColor=white">
  <img src="https://img.shields.io/badge/shadcnui-000000?style=for-the-badge&logo=sass&logoColor=white">
  <img src="https://img.shields.io/badge/npm-CB3837?style=for-the-badge&logo=npm&logoColor=white">
  <img src="https://img.shields.io/badge/vercel-000000?style=for-the-badge&logo=npm&logoColor=white">
</div>


## 💻 주요 기능
### [회원가입]
> 초기 회원가입시 각 단계에 따라 회원 정보 입력이 가능합니다. ( /signup )

<div>
  <img src="https://github.com/user-attachments/assets/3ee6a971-f006-4fb2-99df-f66720b389a3" alt="로그인 1"  height="250px" />
  <img src="https://github.com/user-attachments/assets/742c52c2-6381-476f-ae03-515d6a118512" alt="로그인 2"  height="250px" />
  <img src="https://github.com/user-attachments/assets/a71195f3-73d4-4669-8724-8b1d0346fcc9" alt="로그인 3"  height="250px" />
<div/>
  
* 1단계: 이메일 / 비밀번호
  * 유효성 검사 (zod) - 이메일: 이메일 형식 / 비밀번호: 대문자, 소문자, 특수문자 중 3종류 이상 포함
* 2단계: 회원 정보 (프로필 이미지 / 닉네임 / 자기소개)
* 3단계: 반려동물 정보 (반려동물 이미지 / 이름 / 종)

### [로그인]
> 등록한 계정으로 로그인 ( /login )
- firebase auth 유저 인증 및 sessionCookie 활용을 통한 로그인 인증 상태 관리

### [메인 페이지]
> 게시글 작성/조회 및 유저 검색이 가능합니다. ( / )
- react-query 무한스크롤
- invalidateQueries를 활용한 자동 업데이트


### [유저 프로필 페이지]
> 개인 프로필 페이지로 해당 유저 정보 및 게시글 조회가 가능합니다. ( /user/[nickname] )
- 본인 페이지의 경우 게시글 수정 / 삭제 가능


### [계정 설정 페이지]
> 사용자의 회원 정보 / 반려동물 정보를 관리하는 페이지입니다. ( /accounts/[nickname] )

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

- next/image를 통한 이미지 최적화

> 위의 작업들을 통해 Performance Score 62점 → 88점으로 개선, Speed Index 속도 3.5초 → 1.3초로 개선


## 🎯 트러블 슈팅
## 💭 기술적 의사결정


## ⚙️ 와이어프레임 / 유저 플로우 차트
> 디자인 툴 : Figma
> 
> 각 페이지 별 구조 설계 및 유저 플로우

<img src="https://github.com/user-attachments/assets/3c3ec36b-1844-42a2-9cdf-6ca0f72e97d9" alt="와이어프레임" style="width: 700px" />

> 디자인 툴 : miro
> 
> 각 페이지 별 구조 설계 및 유저 플로우
<img src="https://github.com/user-attachments/assets/0d94bbb2-4ca3-49b7-a34e-f18379561d42" alt="와이어프레임" style="width: 700px" />




## 🗂️ 폴더 구조

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
| 폴더명 | 설명 |
| --- | --- |
| `components` | 재사용 컴포넌트들을 모아놓은 폴더   |
| `constants` | 상수 값을 모아놓은 폴더   |
| `hooks` | 커스텀 훅 선언   |
| `interface` | 타입에 대한 정의를 모아놓은 폴더    |
| `layout` | 컴포넌트 페이지 레이아웃을 모아놓은 폴더   |
| `pages` | 컴포넌트 페이지를 모아놓은 폴더   |
| `router` | 페이지 라우터 컴포넌트들을 모아놓은 폴더 |
| `service` | 서버와 관련된 config 폴더 |
| `store` | 전역 상태를 관리하기 위한 폴더 |
| `styles` | 전역 스타일을 관리학 위한 폴더 |
| `utils` | 유틸 함수를 모아놓은 폴더 |








