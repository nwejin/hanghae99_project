<div align="center">
  <br />
  <img width="300" height="150" alt="Group 68" src="https://github.com/user-attachments/assets/210c606a-66c9-4743-9c67-30c700b84ab0" />

  <br />
</div>


## 🧑🏻‍💻 프로젝트 소개

> 반려동물과 함께하는 개인 일상 공유 SNS 서비스 입니다.
  
<div align="center"> 

| 프로젝트 명 | 멍냥터 |
| --- | --- |
| 개발 기간 | 2024.08.07 ~ 2024.09.04 (28일) |
| 배포 주소 |[배포 링크 🌎](https://cheonggun-house.vercel.app/) |

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
   <img src="https://img.shields.io/badge/supabase-3FCF8E?style=for-the-badge&logo=supabase&logoColor=white">
   <img src="https://img.shields.io/badge/cloudflare-F38020?style=for-the-badge&logo=cloudflare&logoColor=white">
</div>

#### Deployment | Package Management
<div>
 <img src="https://img.shields.io/badge/vercel-000000?style=for-the-badge&logo=vercel&logoColor=white">
   <img src="https://img.shields.io/badge/npm-CB3837?style=for-the-badge&logo=npm&logoColor=white">
</div>

#### AI Agent
<div>
 <img src="https://img.shields.io/badge/claude-D97757?style=for-the-badge&logo=claude&logoColor=white">
</div>


## 💻 주요 기능

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









