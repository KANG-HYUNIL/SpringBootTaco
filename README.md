동아리 홍보 페이지 + 게시판 프로젝트

기능 단위로 분류한다. 각 기능 단위로 사용하는 DTO, Entity(Document), API 양식, 프론트에서 보내야 하는 요청 양식, 각 요청에 대한 응답 구성으로 설명.

//imww mczi xkba gsae 

## 0. 사용한 기술 스택(버전 명시 해야 함)
- Spring Boot
- MongoDB Community 8.0.4
- Mysql 8.0
- Redis 3.0.504 //비밀번호 foobared?
- 그 외 프론트는 순수 js 채용

이 프로젝트는 빠른 완성을 위해 프론트와 백을 구분하지 않고 하나의 서버에서 처리, 순수 js 만을 사용한다.
그렇기에 프론트엔드의 js 코드가 다소 비효율적(느린 속도), 다소 하드코딩된 부분도 존재한다.
또한 프론트엔드의 뷰 부분은 모두 Creatie 의 자동생성으로 얻은 코드를 사용한다. 이후 디자인 변경 및 
프론트엔드 최적화 작업을 진행할 시에 이 부분에 유의가 필요하다. 

프론트엔드에서 호출할 가능성이 있는 가능한 모든 API 및 양식, 그에 대한 상황별 응답을 하단에 기재해놓았으나,
이 문서는 완벽하지 않을 수 있다. 모호하거나 부족한 부분이 있다면 서버 코드의 Controller 부분을 확인해봐라.

_______________________________________________________

## 1. 계정 관련 기능들
로그인, 회원가입, 이메일 인증, 아이디 및 비밀번호 찾기

### 1.1 회원가입 및 계정 정보 찾기

관련 DTO 및 Entity들

UserDTO
```java
public class UserDTO {

    private String id; //User의 Id
    private String password; //User의 Password
    private String name; //User의 이름
    private String email; //User의 email
    private String role; //User의 권한 (ROLE_USER, ROLE_ADMIN)

}
```

UserEntity
```java
@Entity
@Getter
@Setter
@Table(name = "user_table")
public class UserEntity {

    @Id
    private String id; //User의 Id

    @Column
    private String password; //User의 Password

    @Column
    private String name; //User의 이름

    @Column(unique = true)
    private String email; //User의 이메일

    @Column
    private String role; //User의 권한 (ROLE_USER, ROLE_ADMIN)

//    @OneToMany //1대다 관계 설정 annotation
//    @JoinColumn(name="user_id") //BoardEntity의 user_id 컬럼과 매핑
//    private List<BoardEntity> writtenBoardList; //작성한 게시글 목록
}
```

관련 API 양식


회원가입용 API 
/account/signup (POST)
```java

기대되는 프론트 요청 양식
body : {
    id : "String",
    password : "String",    
    name : "String",
    email : "String",    
    role : "ROLE_USER" (혹은 null로 보내면 백엔드에서 설정 가능),
    authCode : "String" (인증번호)    
        }
        
기대되는 백엔드 응답 코드

Id, Password 유효성 검증 실패 시 : 
        400 상태 코드 반환
        //데이터 입력 양식(id에 특수문자 등) 예외 처리
        @ExceptionHandler(InvalidInputException.class)
        public ResponseEntity<?> handleInvalidInputException(InvalidInputException e, WebRequest request) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.BAD_REQUEST);
        }

        
Id 이미 존재 시 :
        409 상태 코드 반환
        //데이터 중복 예외 처리
        @ExceptionHandler(DuplicateDataException.class)
        public ResponseEntity<?> handleDuplicateIdException(DuplicateDataException e, WebRequest request) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.CONFLICT);
        }

        
인증 번호 불일치 시 :
        401 상태 코드 반환
        //유효하지 않은 인증번호 예외 처리
        @ExceptionHandler(InvalidAuthCodeException.class)
        public ResponseEntity<?> handleInvalidAuthCodeException(InvalidAuthCodeException e, WebRequest request) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.UNAUTHORIZED);
        }
        
        
그 외 알 수 없는 예외 발생 시 :
        500 상태 코드 반환
        //알 수 없는 예외 처리
        @ExceptionHandler(Exception.class)
        public ResponseEntity<?> handleException(Exception e, WebRequest request) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }

메서드 본문
@PostMapping("/signup")
public ResponseEntity<?> signup(@RequestBody UserDTO userDTO, @RequestParam("authCode") String authCode)
```


### 1.2 이메일 인증

관련 DTO 및 Entity들 

EmailRequestDTO
```java
public class EmailRequestDTO {
    private String email; //이메일 주소
    private String authCode; //인증 번호
}
```

관련 API 양식

회원가입 용 이메일 인증 요청 API /member/email/signup_verification_req (POST)

```java

기대하는 프론트 요청 양식
body :{
    email : "string"
    }
    
    
기대하는 백엔드 응답 코드
        
이메일 인증 메일 발송 성공 시 :
    200 상태 코드 반환
    return new ResponseEntity<>(HttpStatus.OK);


이미 존재하는 이메일 주소 사용 시 :
    409 상태 코드 반환
    //이미 존재하는 이메일 주소 예외 처리
    @ExceptionHandler(DuplicateDataException.class)
    public ResponseEntity<?> handleDuplicateEmailException(DuplicateDataException e, WebRequest request) {
        return new ResponseEntity<>(e.getMessage(), HttpStatus.CONFLICT);
    }
    
    
그 외의 알 수 없는 예외 발생 시 :
    500 상태 코드 반환
    //알 수 없는 예외 처리
    @ExceptionHandler(Exception.class)
    public ResponseEntity<?> handleException(Exception e, WebRequest request) {
        return new ResponseEntity<>(e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
    }     

메서드 본문
//아이디 및 비밀번호 찾기 시 이메일 인증 요청에 대한 처리, 이미 존재하는 이메일이여야만 함
@PostMapping("/email/signup_verification_req")
public ResponseEntity<?> sendSignUpVerificationEmail(@RequestBody EmailRequestDTO emailRequest)
```
//

계정 정보 찾기 용 이메일 인증 요청 API /member/email/find_verification_req (POST)
```java
기대하는 프론트 요청 양식
body :{
    email : "string"
    }
    
    
기대하는 백엔드 응답 코드
        
이메일 인증 메일 발송 성공 시 :
    200 상태 코드 반환
    return new ResponseEntity<>(HttpStatus.OK);


존재하지 않는 이메일 주소 사용 시 :
    404 상태 코드 반환
    //데이터 없음 예외 처리
    @ExceptionHandler(NoDataException.class)
    public ResponseEntity<?> handleNoDataException(NoDataException e, WebRequest request) {
        return new ResponseEntity<>(e.getMessage(), HttpStatus.NOT_FOUND);
    }
    
    
그 외의 알 수 없는 예외 발생 시 :
    500 상태 코드 반환
    //알 수 없는 예외 처리
    @ExceptionHandler(Exception.class)
    public ResponseEntity<?> handleException(Exception e, WebRequest request) {
        return new ResponseEntity<>(e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
    }     

    
메서드 본문
        
//아이디 및 비밀번호 찾기 시 이메일 인증 요청에 대한 처리, 이미 존재하는 이메일이여야만 함
@PostMapping("/email/find_verification_req")
public ResponseEntity<?> sendFindVerificationEmail(@RequestBody EmailRequestDTO emailRequest)
```
//

이메일 인증 번호 검증 요청 API /member/emails/verifications (POST)

```java
기대하는 프론트 요청 양식
body :{
    email : "string",
    authCode : "string"
    }
    

기대하는 백엔드 응답 코드

이메일 인증 메일 발송 성공 시 :
    200 상태 코드 반환
    return new ResponseEntity<>(HttpStatus.OK);


인증 번호 불일치 시 :
    401 상태 코드 반환
    //유효하지 않은 인증번호 예외 처리
    @ExceptionHandler(InvalidAuthCodeException.class)
    public ResponseEntity<?> handleInvalidAuthCodeException(InvalidAuthCodeException e, WebRequest request) {
        return new ResponseEntity<>(e.getMessage(), HttpStatus.UNAUTHORIZED);
    }


그 외의 알 수 없는 예외 발생 시 :
    500 상태 코드 반환
    //알 수 없는 예외 처리
    @ExceptionHandler(Exception.class)
    public ResponseEntity<?> handleException(Exception e, WebRequest request) {
        return new ResponseEntity<>(e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
    }


메서드 본문

//이메일 인증 번호 확인에 대한 처리
@GetMapping("/emails/verifications")
public ResponseEntity<?> verificationEmail(@RequestBody EmailRequestDTO emailRequest)        

```


### 1.3 로그인

관련 DTO 및 Entity들

LoginDTO
```java
public class LoginDTO {
    private String id; //User의 Id
    private String password; //User의 Password
}
```

관련 API 양식

로그인 요청 전달 API /account/login (POST)
```java
기대하는 프론트 요청 양식
        
body : {
    id : "String",
    password : "String"
    }
    

기대하는 백엔드 응답 코드
        

로그인 성공 시 :
    200 상태 코드 반환
    "access" 이름으로 Header에 Access Token 추가
    "refresh" 이름으로 Cookie에 Refresh Token 추가



Id, Password 유효성 검증 실패 시 :
    401 상태 코드 반환


Id 검색 실패 시 :
    401 상태 코드 반환


로그인 실패 시 :
    401 상태 코드 반환


그 외의 알 수 없는 예외 발생 시 :
    500 상태 코드 반환
    Message: "An unexpected error occurred: [error message]"
```

로그아웃 요청 전달 API ^\\/logout$ (POST)

```java
기대하는 프론트 요청 양식
        
보내는 요청의 쿠키에 "refresh" 라는 이름으로 Refresh Toekn 실어 보내기        
        
        
기대되는 백엔드 응답

이미 만료되었거나 유효하지 않은 Refresh Token:
    400 상태 코드 반환

정상 로그아웃 :
    200 상태 코드 반환

그 외 알 수 없는 예외 발생 시 :
    500 상태 코드 반환
    

프론트에서 비정상 상태 코드를 받을 경우, Refresh Token 이 비정상 이라는 의미 이고
정상 상태 코드는 정상 로그아웃 된 것이니
즉, 어느 상태 코드를 받던 간에 응답이 돌아오기만 하면 로그아웃이 완료된 것이다
*프론트에서는 응답 받은 후에 로컬 스토리지 및 쿠키에 있는 Access, Refresh Token을 삭제해주어야 함*


```

추후 작성 예정


### 1.4 Jwt 2중 토큰 

관련 DTO 및 Entity(구조)

Jwt 2중 Access, Refresh 토큰 구조를 채용함


모든 Access Token 발급은 "access" 라는 이름의Response Header에 담아짐

모든 Refresh Token 발급은 "refresh" 라는 이름의 cookie로 발급됨
**!!HTTP-Only 쿠키임!!**

//

Access Token을 요청에 실어 보냈는데 만료되었을 경우,
서버는 406 상태 코드를 반환한다. 

프론트엔드에서는 권한이 필요한 요청을 보냈을 때에 406 응답을 받는다면, Refresh 토큰을 통해 Access Token을 재발급 받는 요청을 보내어 Access Token을 재발급 받아야 한다

로그인 성공 후 jwt token 받을 때 프론트에 저장하는 방법

```java
fetch('/account/login', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    id: 'user_id',
    password: 'user_password'
  }),
  credentials: 'include' // 쿠키를 포함하여 요청
})
.then(response => {
  if (response.ok) {
    return response.json();
  } else {
    throw new Error('Login failed');
  }
})
.then(data => {
  // 응답에서 access token과 refresh token을 저장
  const accessToken = response.headers.get('access');
  const refreshToken = getCookie('refresh'); // 쿠키에서 refresh token을 가져옴

  // 토큰을 로컬 스토리지에 저장
  localStorage.setItem('accessToken', accessToken);
  localStorage.setItem('refreshToken', refreshToken);
})
.catch(error => {
  console.error('Error:', error);
});


function getCookie(name) {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
}


```


```java
Token을 요청에 실어 보낼 때에는 다음과 같이 보내야 한다

headers: {
    "access" : Access Token,
    "refresh" : Refresh Token
    }
credentials: 'include' //이 옵션을 통해 쿠키를 전송    

```
//

관련 API 양식

Access Token 재발급 요청 API /refresh (POST)
```java
기대되는 프론트 요청 양식
        
//Access Token 재발급 요청이므로 Access Token을 실어 보내지 않아도 된다
headers: {
    "refresh" : Refresh Token
    }
credentials: 'include'    


기대되는 백엔드 응답 코드
        

정상적 발급 성공 시 :
    200번 상태 코드 반환
    "access" 이름으로 Header에 Access Token
    "refresh" 이름으로 Cookie에 Refresh Token 실어서 전송    


발급 실패 시 :
    401 상태 코드 반환
    이 경우에는 재 로그인을 통해 다시 처음부터 Access, Refresh Token 발급 필요

```

### 1.5 아이디 및 비밀번호 찾기 

관련 DTO 및 Entity들



관련 API 양식

사용자 id를 토대로 사용자의 정보 찾기 API /account/getUserById (POST)

```java
기대되는 프론트 요청 양식
        
body : {
    id : "userId"    
}        


기대되는 백엔드 응답 코드
        
정상적인 사용자 정보 반환 시 :
    200 상태 코드 반환
    UserDTO 반환
            
사용자 정보 검색 실패 시 :
    404 상태 코드 반환

그 외의 알 수 없는 예외 발생 시 :
    500 상태 코드 반환


```


사용자 name를 토대로 사용자의 정보 찾기 API /account/getUserByName (POST)

```java
기대되는 프론트 요청 양식
        
body : {
    name : "userName"    
}        


기대되는 백엔드 응답 코드
        
정상적인 사용자 정보 반환 시 :
    200 상태 코드 반환
    UserDTO 반환
            
사용자 정보 검색 실패 시 :
    404 상태 코드 반환

그 외의 알 수 없는 예외 발생 시 :
    500 상태 코드 반환


```

_______________________________________________________

## 2.관리자 용 백페이지 

회원 관리, 관리자 등록 및 삭제, 홍보 페이지 내용 CRUD, 게시판 관리, 

모든 관리자 용 백페이지는 "/admin"으로 시작한다

관리자 계정은 UserEntity의 role이 "ROLE_ADMIN" 이며, role이 다르면 관리자 용 백페이지에 접근 불가.

### 2.1 홍보 페이지 내용 CRUD

홍보 에서는 크게 3개의 단락을.  동아리 소개 / 세션 / 프로젝트 소개  이렇게.

동아리 소개 페이지는 내부에서 파트가 또 나뉘지는 않고, 긴 글(이미지와 동영상이 첨가된)이 작섣될 것임.
___
세션 페이지는 우선 동아리 기수 별로 나눌 수 있어야 한다(콤보 박스 같은 걸로 프론트에서 처리?)
기수 내의 션에는 진행한 세션에 대한 내용이 작성될 것인데, 

우선 겉면에 "*썸네일, 기수, 제목(세션 x)*"

이렇게 작성되지 싶다.

세션의 본문으로 들어가면, 겉면의 내용이 가장 위에 나타나있고, 그 아래에 세션의 내용(글과 이미지, 영상)

______
프로젝트 페이지 또한 동아리 기수 별로 나눌 수 있어야 한다
기수 내의 프로젝트 들에는 해당 기수의 팀에서 진행(완성)한 프로젝트들의 소개가 작성될 것임

겉면에 "*썸네일, 기수, 팀 이름, 프로젝트 제목*"

이렇게 작성되지 싶다.

프로젝트의 본문으로 들어가면 겉면의 내용이 가장 위에 나타나있고, 그 아래에 세션의 내용(글과 이미지, 영상)


관련 DTO 및 Entity(Document) 들

Session 게시물 DTO
```java
public class SessionDTO {

    //Session 게시물의 데이터를 중간에서 관리할 DTO 클래스

    //thumbnail, term, title 가 외관 페이지에 나타날 것이고, content는 세부 페이지에 진입 시 사용

    private String id;
    
    private String thumbnail; //썸네일에 들어갈 이미지가 저장된 경로를 보관할 멤버

    private String term; //3기, 4기 할 때의 기수를 보관할 멤버. 귀찮으니 String으로

    private String title; //세션의 제목

    private String content; //세션의 내용

    private List<String> attachmentFilePaths; //첨부 파일 경로들

}
```

Session 게시물 Document
```java
@Document(collection = "sessionData") //실제 mongodb의 collection 이름과 동일해야 함
@Data
public class SessionDocument {

    @Id
    private String id; //PK

    private String thumbnail; //썸네일

    private String term; // 기수 (3기, 4기)

    private String title; //제목

    private String content; //본문 내용

    private List<String> attachmentFilePaths; //첨부 파일 경로들

}
```


Project 게시물 DTO
```java
public class ProjectDTO {

    //Project 게시물 정보를 중간에서 관리할 DTO 클래스

    //thumbnail, term, team, title 가 외관 페이지에 나타날 것이고, content는 세부 페이지에 진입 시 사용

    private String id;
    
    private String thumbnail; //썸네일에 들어갈 이미지가 저장된 경로를 보관할 멤버

    private String term; //3기, 4기 할 때의 기수를 보관할 멤버. 귀찮으니 String으로

    private String team; //팀의 이름

    private String title; //프로젝트의 제목

    private String content; //프로젝트의 내용

    private List<String> attachmentFilePaths; //첨부파일 경로들

}
```


Project 게시물 Document
```java
@Document(collection = "projectData")
@Data
public class ProjectDocument {

    @Id
    private String id; //PK

    private String thumbnail; //썸네일

    private String term; // 기수 (3기, 4기)

    private String team; // 팀 이름

    private String title; //제목

    private String content; //본문 내용

    private List<String> attachmentFilePaths; //첨부 파일 경로들

}
```

굳이 Session 과 Project를 분리한 이유는, 나중에 이 둘이 나타내는 정보의 방향성이 달라질 수 있기에 추후 관리 용이성을 위해서 분리.
* 주의 * 
현재 html 뷰에서 게시물 작성 시 Toast TUI 를 채용하고 있다. 이 Toast TUI 및 시간의 제약으로 인해, 동영상은 유튜브 링크를 통해서 유튜브 동영상만을
올릴 수 있는 상태임. 또한 Toast TUI 사용을 위해 외부와 연결된 스크립트에서 정의된 클래스를 사용하고 있다.
Toast TUI 와 관련된 js 코드들은 모두 html 의 script 내에 작성되어 있다. 이후 수정 시 주의가 필요


이 프로젝트는 빠른 작동을 위해 프론트와 백을 구분하지 않고 하나의 서버에서 처리, 순수 js 만을 사용한다.
그렇기 때문에 React 에서는 분리 작성이 가능한 것이, 여기서는 그러지 못한다.


관련 API 양식

전체 Session 게시물 데이터 획득 API "/getProjectData" 
```java

기대되는 프론트 요청 양식
        없음

기대되는 백엔드 응답 코드

정상적 조회 성공 시 :
        200 상태 코드 반환
        Map<String, List<ProjectDTO>> 반환(기수 별로 묶인 ProjectDTO 리스트를 가진 Map)

에러 발생 시 :
        500 상태 코드 반환
```


Session 게시물 작성 API /admin/writeSession (POST)
```java
기대하는 프론트 요청 양식
body :{
    thumbnail : "string",
    term : "string",
    title : "string",
    content : "string",
    attachmentFilePaths : ["string1", "string2", ...]
    }

기대되는 백엔드 응답 코드


정상적 발급 성공 시 :
        200번 상태 코드 반환
        
발급 실패 시 :
        상황에 따른 상태 코드 및 응답 처리 구현하고 채워놓음.
    
    
    
```

Session 게시물 삭제 API "/admin/deleteSession" (POST)
```java
기대되는 프론트 요청 양식
body : {    
    id : "string"
}

기대되는 백엔드 응답 코드

정상적 발급 성공 시 :
        200번 상태 코드 반환

발급 실패 시 :
        상황에 따른 상태 코드 및 응답 처리 구현하고 채워놓음.        


```

Session 게시물 수정 API "/admin/fixSession" (POST)
```java
기대되는 프론트 요청 양식
body : {
    id : "string",
    thumbnail : "string",
    term : "string",
    title : "string",
    content : "string",
    attachmentFilePaths : ["string1", "string2", ...]
}        

기대되는 백엔드 응답 코드
        
정상적 수정 성공 시 :
        200번 상태 코드 반환
        
수정 실패 시 :
        상황에 따른 상태 코드 및 응답 처리 구현하고 채워놓음.

```


전체 Project 게시물 데이터 획득 API "/getProjectData" 
```java

기대되는 프론트 요청 양식
        없음

기대되는 백엔드 응답 코드

정상적 조회 성공 시 :
        200 상태 코드 반환
        Map<String, List<SessionDTO>> 반환(기수 별로 묶인 SessionDTO 리스트를 가진 Map)

에러 발생 시 :
        500 상태 코드 반환
```

Project 게시물 작성 API /admin/writeProject (POST)
```java
기대하는 프론트 요청 양식
body :{
    thumbnail : "string",
    term : "string",
    title : "string",
    content : "string",
    attachmentFilePaths : ["string1", "string2", ...],
    team : "string"
    }


정상적 발급 성공 시 :
        200번 상태 코드 반환

발급 실패 시 :
        상황에 따른 상태 코드 및 응답 처리 구현하고 채워놓음.
    
```

Project 게시물 삭제 API "/admin/deleteProject" (POST)
```java
기대되는 프론트 요청 양식
body : {    
    id : "string"
}

기대되는 백엔드 응답 코드

정상적 발급 성공 시 :
        200번 상태 코드 반환

발급 실패 시 :
        상황에 따른 상태 코드 및 응답 처리 구현하고 채워놓음.        

```

Project 게시물 수정 API "/admin/fixProject" (POST)
```java
기대되는 프론트 요청 양식
body : {
    id : "string",
    thumbnail : "string",
    term : "string",
    title : "string",
    content : "string",
    team : "string",
    attachmentFilePaths : ["string1", "string2", ...]
}        

기대되는 백엔드 응답 코드
        
정상적 수정 성공 시 :
        200번 상태 코드 반환
        
수정 실패 시 :
        상황에 따른 상태 코드 및 응답 처리 구현하고 채워놓음.

```

### 2.1 Application 페이지 CRUD
Application 내용 추가해야 함.

관련 DTO 및 Entity(Document) 들
__________________________________________

## 3. 파일(이미지 및 동영상) 업로드 및 다운로드

파일의 업로드 및 다운로드 기능(게시물 작성 시에 사용되는 파일 미리 업로드도 포함)
구상으로는, 게시물에서 일반 문자들은 바로 CSR로 웹 페이지에 렌더링시키고,
파일들은 문자들 사이의 img, video 태그를 발견 시에 프론트에서 다시 해당 파일을 가져오는 요청을 보내게끔(src 경로 통해)

이미지는 텍스트 에디터 상에서 바로 업로드가 가능하나, 동영상은 개발 속도에 의해 직접 업로드가 안된다.
대신 유튜브에 업로드 한 동영상을 가져와서 활용할 수 있다.

관련 DTO 및 Entity

DisplayedFileDTO
```java

public class DisplayedFileDTO {

    //파일 이름
    private String fileName;

    //저장 위치
    private String filePath;
}

```





파일 예비 업로드(게시물 작성 시 이미지 혹은 동영상을 게시물 내부에 첨가 시) 용 API
예비 업로드 성공 시에 해당 파일이 저장된 예비 저장소 경로를 응답에 반환함

/file/preUpload (POST)

```java

기대되는 프론트 요청 양식

        application-json 이 아닌, form-data를 통해 파일을 전송
        

기대되는 백엔드 응답
        200 상태 코드 반환
        DisplayedFileDTO 반환(임시 파일 경로가 작성된 상태)
        //파일 업로드 성공 시 반환되는
        

메서드 원문

    @PostMapping("/preUpload")
    public ResponseEntity<DisplayedFileDTO> filePreUpload(@RequestPart MultipartFile multipartFile)
    {
        DisplayedFileDTO displayedFileDTO = fileService.filePreUpload(multipartFile);
        return new ResponseEntity<DisplayedFileDTO>(displayedFileDTO,HttpStatus.OK); //fixme
    }
```


게시물 본문에 있는 이미지 가져오기(사용 안함)
/file/downloadImg (GET)

```java

기대되는 프론트 요청 양식

body : {
    filePath : "String"
    }
    
기대되는 백엔드 응답
        
정상 파일 반환 시 :
        200 상태 코드 반환
        이미지 파일 반환
        
파일이 존재하지 않을 시 :
        404 상태 코드 반환
        
그 외의 알 수 없는 예외 발생 시 :
        500 상태 코드 반환


메서드 원문

@GetMapping("/downloadImg")
public ResponseEntity<Resource> getImg(@RequestBody DisplayedFileDTO displayedFileDTO) {
    try {
        Resource resource = fileService.getFile(displayedFileDTO.getFilePath());

        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + resource.getFilename() + "\"")
                .body(resource);
    } catch (IllegalArgumentException e) {
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
    }
}


```


게시물 본문에 있는 동영상 가져오기(사용 안함)
/file/downloadVideo (GET)

```java

기대되는 프론트 요청 양식

body : {
    filePath : "String"
    }
    
기대되는 백엔드 응답
        
정상 파일 반환 시 :
        200 상태 코드 반환
        동영상 파일 반환
        
파일이 존재하지 않을 시 :
        404 상태 코드 반환
        
그 외의 알 수 없는 예외 발생 시 :
        500 상태 코드 반환



메서드 원문

// 게시물 내의 동영상을 가져오는 메서드
@GetMapping("/downloadVideo")
public ResponseEntity<Resource> getVideo(@RequestBody DisplayedFileDTO displayedFileDTO) {
    try {
        Resource resource = fileService.getFile(displayedFileDTO.getFilePath());

        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + resource.getFilename() + "\"")
                .body(resource);
    } catch (IllegalArgumentException e) {
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
    }
}


```


서버에서 파일(이미지, 문서 등)을 가져오는 메서드
/file/downloadFile(GET)
    

```java
기대되는 프론트 응답 양식


기대되는 백엔드 응답

    정상 파일 반환 시 :
            200 상태 코드 반환
    동영상 파일 반환
    
    파일이 존재하지 않을 시 :
            404 상태 코드 반환
    
    그 외의 알 수 없는 예외 발생 시 :
            500 상태 코드 반환



```


## 4. 페이지 이동 

각 View들 이동을 위한 API 들 서술. GET 요청에 대해서만 다룬다. 
크게 3가지 종류로 나눌 수 있다.
1. 모든 사용자 접근 가능
2. 로그인 된 사용자만 접근 가능
3. ADMIN 만 접근 가능

2번, 3번에 해당하는 API 들은 요청을 보낼 시에 header에 "access" 라는 이름으로 access token을 실어서 보내주어야
하고, 406 응답이 돌아올 시에는 refresh token을 통한 access token 재발급 절차를 시행해야 한다. 


1번. 모든 사용자 접근 가능 API 들

메인 페이지 (GET) "/"

로그인 페이지 (GET) "/account/login"

회원가입 페이지 (GET) "/account/signup"

소개 페이지 (GET) "/about"

프로젝트 페이지 (GET) "/project"

세션 페이지 (GET) "/session"

FAQ 페이지 (GET) "faq"

Application 페이지 (GET) "/application"
유의 : applicationData 라는 이름으로, 데이터가 담길 예정.


2번. 로그인 된 일반 사용자만 접근 가능

아직 만들지는 않았음, 추후에도 없을 수 있음


3번. 관리자만 접근 가능

관리자 페이지 (GET) "/admin/"  
관리자 프로젝트 페이지 (GET) "/admin/project"

관리자 프로젝트 작성 페이지 (GET) "/admin/project/write"

관리자 프로젝트 수정 페이지 (GET) "/admin/project/fix" **이 경로에 해당하는 요청은 token이 필요하지 않음

관리자 세션 페이지 (GET) "/admin/session"

관리자 세션 작성 페이지 (GET) "admin/session/write"

관리자 세션 수정 페이지 (GET) "admin/session/fix" **이 경로에 해당하는 요청은 token이 필요하지 않음


아마 이 아래에는 Application 관련 추가 될듯




