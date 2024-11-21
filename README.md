# CHALLET 챌린지에 참여해 소비습관을 개선하는 금융 서비스 
![main](./imgs/main.PNG)

## 🚩Challet를 소개합니다
핀테크와 챌린지를 통한 소비습관 개선 플랫폼으로 소비습관을 효과적으로 관리하기 위한 설계된 서비스 입니다. 사용자의 편의성을 개선시키고자 결제시 자동으로 참여된 챌린지 방에 거래내역이 공유되며 공동의 목표를 가진 사람들과 챌린지를 통해 지출을 관리를 제공하는 서비스 입니다.

## 📅 개발기간
- 2024.8.19. ~ 2024.10.10.(7주)


## 🏃주요기능

1. **은행 서비스**
    - 회원가입
    - 계좌 조회
    - QR 결제
    - 송금
    - 마이 데이터 연결
2. **챌린지**
    - 챌린지 생성 및 조회
    - 챌린지 진행
    - 리워드
3. **지출 및 통계**



## ✅ 기능 소개

### 1. **은행서비스**
#### 회원가입

- 문자 인증을 통해 회원가입을 할 수 있습니다.
<img src="./imgs/회원가입.gif" alt="회원가입" width="300px">

#### 계좌 조회
- 계좌 내역 조회 및 계좌 내역 상세 조회를 할 수 있습니다. 
<img src="./imgs/거래내역조회.gif" alt="거래내역조회" width="300px">

#### QR 결제
- 간편비밀번호와 QR를 통해 결제를 할 수 있습니다.
<img src="./imgs/QR결제.gif" alt="QR결제" width="300px">

#### 계좌 이체
- 이체 전 이체 계좌의 존재 여부를 검사 합니다.
- 금액 입력 시 잔액 검사 후 송금이 가능합니다.
<img src="./imgs/송금.gif" alt="송금" width="300px">

#### 마이 데이터 연결
- 타 은행의 통장 연결 및 거래내역 조회가 가능합니다.
<img src="./imgs/마이데이터.png" alt="마이데이터" width="300px">

---
### 2.챌린지

#### 챌린지 조회
- 카테고리 및 검색으로 조회 할 수 있습니다.
<img src="./imgs/챌린지 조회.gif" alt="챌린지 조회" width="300px">

#### 챌린지 생성
- 카테고리와 기간, 인원을 선택하여 챌린지를 생성할 수 있습니다.
<img src="./imgs/챌린지생성.gif" alt="챌린지 생성" width="300px">

#### 챌린지 진행
- 거래 시 자신이 참여하고 있는 챌린지에 자동으로 거래내역이 업데이트 됩니다.
- 이모지와 댓글로 피드백을 받을 수 있습니다.
<img src="./imgs/챌린지 진행.gif" alt="챌린지 진행" width="300px">

#### 리워드
- 종료한 챌린지 미션 달성 여부와 챌린지 상세 내용을 보여줍니다.
<img src="./imgs/리워드.png" alt="리워드" width="300px">


---
### 3.지출 및 통계

#### 거래 내역 조회(캘린더)
- 챌렛 계좌와 마이테이터에 연결된 계좌의 거래내역을 조회합니다.
<img src="./imgs/거래내역조회(캘린더).gif" alt="캘린더 조회" width="300px">

#### 소비내역 통계 및 비교
- 한달 간의 카테고리 별 소비내역의 통계를 볼 수 있습니다.
- 자신과 비슷한 연령과 성별의 소비내역을 비교하며 소비습관의 인식을 높일 수 있습니다.
<img src="./imgs/소비내역비교.gif" alt="소비내역비교" width="300px">


## 🏠 아키텍쳐
<img src="./imgs/시스템아키텍처.png" alt="아키텍쳐" width="800px">

## ⚙️ ERD
### Challet ERD
<img src="./imgs/ERD(Challet).PNG" alt="ERD" width="800px">

### Bank ERD
<img src="./imgs/ERD(Bank).PNG" alt="ERD" width="800px">


## 🖥 개발환경

<table>

  <tr>
	<td><b>BE</b></td>
	<td>
		<img src="https://img.shields.io/badge/java-%23ED8B00.svg?style=for-the-badge&logo=openjdk&logoColor=white"/>
		<img src="https://img.shields.io/badge/Spring Boot-6DB33F?style=for-the-badge&logo=Spring Boot&logoColor=white"/>
		<img src="https://img.shields.io/badge/JWT-000000?style=for-the-badge&logo=JSON Web Tokens&logoColor=white"/>
		<img src="https://img.shields.io/badge/mysql-4479A1.svg?style=for-the-badge&logo=mysql&logoColor=white"/>
        <img src="https://img.shields.io/badge/ElasticSearch-005571?style=for-the-badge&logo=ElasticSearch&logoColor=white">
		<img src="https://img.shields.io/badge/JPA-59666C?style=for-the-badge&logo=Hibernate&logoColor=white"/>
		<img src="https://img.shields.io/badge/redis-%23DD0031.svg?style=for-the-badge&logo=redis&logoColor=white"/>
		<img src="https://img.shields.io/badge/Gradle-C71A36?style=for-the-badge&logo=Gradle&logoColor=white"/>
	</td>
  </tr>
  <tr>
	<td><b>FE</b></td>
	<td>
<img src="https://img.shields.io/badge/react-%2320232a.svg?style=for-the-badge&logo=react&logoColor=white&color=%2361DAFB" />
<img src="https://img.shields.io/badge/typescript-3178C6?style=for-the-badge&logo=typescript&logoColor=white">
<img src="https://img.shields.io/badge/tailwindcss-%2338B2AC.svg?style=for-the-badge&logo=tailwind-css&logoColor=white" />
<img src="https://img.shields.io/badge/node.js-6DA55F?style=for-the-badge&logo=node.js&logoColor=white"/>
		<img src="https://img.shields.io/badge/vite-%23646CFF.svg?style=for-the-badge&logo=vite&logoColor=white"/>
		<img src="https://img.shields.io/badge/PNPM-%23CB3837.svg?style=for-the-badge&logo=pnpm&logoColor=white"/>
	</td>
  </tr>
  <tr>
	<td><b>Infra</b></td>
	<td>
		<img src="https://img.shields.io/badge/AWS EC2-%23FF9900.svg?style=for-the-badge&logo=amazon-aws&logoColor=white"/>
		<img src="https://img.shields.io/badge/Jenkins-D24939?style=for-the-badge&logo=Jenkins&logoColor=white"/>
		<img src="https://img.shields.io/badge/Docker-4479A1?style=for-the-badge&logo=Docker&logoColor=white"/>
		<img src="https://img.shields.io/badge/NGINX-009639?style=for-the-badge&logo=NGINX&logoColor=white"/>
	</td>
  <tr>
	<td><b>Tools</b></td>
	<td>
		<img src="https://img.shields.io/badge/GitLab-FCA121?style=for-the-badge&logo=GitLab&logoColor=white"/>
		<img src="https://img.shields.io/badge/jira-%230A0FFF.svg?style=for-the-badge&logo=jira&logoColor=white"/>
		<img src="https://img.shields.io/badge/Notion-333333?style=for-the-badge&logo=Notion&logoColor=white"/>
		<img src="https://img.shields.io/badge/figma-%23F24E1E.svg?style=for-the-badge&logo=figma&logoColor=white" />

</table>

### BackEnd    
SpringBoot: 3.3.3, Java: 21, JDK: corretto-21(Amazon Corretto 21.0.4), MySql: 8.0.30, JPA: 3.3.3, Spring-cloud: 4.1.4, eureka: 4.1.3, Spring-Cloud-Gateway: 4.1.5

### FrontEnd
React 18.3.1, TypeScript 5.5.3, tailwindcss : 3.4.10, Node.js v20.17.0, Vite 5.4.
1, zustand : 4.5.5,  pnpm : 9.9.0

### Infra
EC2 ubuntu(20.04.6), Nginx 1.27.2, Jenkins 2.479.1, Docker 27.3.1, Docker Compose v2.29.7 



## 👨‍👩‍👧‍👦 팀원 소개

|                  BackEnd                  |                   BackEnd                    |                  Infra                   |                  FrontEnd               |                  FrontEnd                        |                  FrontEnd                         |
| :-----------------------------------------: | :-------------------------------------------: | :----------------------------------------: | :----------------------------------------: |:----------------------------------------: |:----------------------------------------: |
| <a href="https://github.com/tam31" target="_blank"><img src="https://avatars.githubusercontent.com/u/98944772?v=4" width="100px;" alt="tam31"/></a> | <a href="https://github.com/kimzonah" target="_blank"><img src="https://avatars.githubusercontent.com/u/124108725?v=4" width="100px;" alt="kimzonah"/></a> | <a href="https://github.com/dev-prao" target="_blank"><img src="https://avatars.githubusercontent.com/u/101629085?v=4" width="100px;" alt="prao"/></a> | <a href="https://github.com/yjjj1612" target="_blank"><img src="https://avatars.githubusercontent.com/u/156387293?v=4" width="100px;" alt="kimzonah"/></a> | <a href="https://github.com/kkkhhh4930" target="_blank"><img src="https://avatars.githubusercontent.com/u/156387278?v=4" width="100px;" alt="werocktoparty"/></a> | <a href="https://github.com/werocktoparty" target="_blank"><img src="https://avatars.githubusercontent.com/u/156086962?v=4" width="100px;" alt="werocktoparty"/></a> |
|     최태민     |     김선하     |     박찬호     |      손유진     |     강현후     |     하정수     |

